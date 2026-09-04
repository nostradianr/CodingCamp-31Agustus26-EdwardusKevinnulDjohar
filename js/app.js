// ============================================
// 1. CONFIGURATION & CONSTANTS
// ============================================

const CONFIG = {
  TIMER_DURATION: 25 * 60,           // 25 minutes in seconds (1500)
  TIMER_UPDATE_INTERVAL: 1000,       // 1 second
  TIME_UPDATE_INTERVAL: 1000,        // 1 second
  STORAGE_KEYS: {
    TODOS: 'todos',
    QUICK_LINKS: 'quickLinks',
    DASHBOARD: 'dashboard'
  },
  VALIDATION: {
    MAX_TASK_LENGTH: 500,
    MAX_LINK_TITLE_LENGTH: 100
  },
  ERROR_DISPLAY_DURATION: 3000       // 3 seconds
};

// ============================================
// 2. UTILITY FUNCTIONS
// ============================================

/**
 * Generate a UUID v4 string
 * @returns {string} UUID v4 formatted string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Validate if a URL string is valid
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format a date object as "HH:MM" or "H:MM" (12/24 hour)
 * @param {Date} date - Date object to format
 * @returns {string} Formatted time string
 */
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format a date object as "Day, Month Date, Year"
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string (e.g., "Monday, August 26, 2024")
 */
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for innerHTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format seconds to MM:SS display format
 * @param {number} seconds - Number of seconds
 * @returns {string} Formatted string (e.g., "25:00")
 */
function formatTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Display error message in validation container
 * @param {string} message - Error message to display
 * @param {string} containerSelector - CSS selector for message container
 * @param {number} duration - Duration to show message (ms)
 */
function showValidationMessage(message, containerSelector, duration = CONFIG.ERROR_DISPLAY_DURATION) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  container.textContent = message;
  container.classList.add('show');
  
  setTimeout(() => {
    container.classList.remove('show');
    container.textContent = '';
  }, duration);
}

/**
 * Validate task input
 * @param {string} title - Task title to validate
 * @returns {Object} { valid: boolean, error: string|null }
 */
function validateTaskInput(title) {
  // Check for empty or whitespace-only input
  if (!title || !title.trim()) {
    return { valid: false, error: 'Task cannot be empty' };
  }
  
  // Check for max length (500 chars)
  if (title.length > CONFIG.VALIDATION.MAX_TASK_LENGTH) {
    return { valid: false, error: `Task cannot exceed ${CONFIG.VALIDATION.MAX_TASK_LENGTH} characters` };
  }
  
  return { valid: true, error: null };
}

/**
 * Validate link input
 * @param {string} title - Link title to validate
 * @param {string} url - Link URL to validate
 * @returns {Object} { valid: boolean, error: string|null }
 */
function validateLinkInput(title, url) {
  // Check for empty title
  if (!title || !title.trim()) {
    return { valid: false, error: 'Link title cannot be empty' };
  }
  
  // Check for valid URL format
  if (!isValidURL(url)) {
    return { valid: false, error: 'Please enter a valid URL (e.g., https://example.com)' };
  }
  
  return { valid: true, error: null };
}

/**
 * Display error in a specific container
 * @param {string} message - Error message to display
 * @param {string} containerSelector - CSS selector for error container
 * @param {number} duration - Duration to show error (ms)
 */
function showError(message, containerSelector, duration = CONFIG.ERROR_DISPLAY_DURATION) {
  showValidationMessage(message, containerSelector, duration);
}

/**
 * Display storage-specific error message
 * @param {Error} error - The error object
 */
function showStorageError(error) {
  if (error && error.name === 'QuotaExceededError') {
    showValidationMessage(
      'Storage quota exceeded. Please delete some items to continue.',
      '.validation-message',
      CONFIG.ERROR_DISPLAY_DURATION * 2
    );
  } else {
    showValidationMessage(
      'An error occurred while saving. Please try again.',
      '.validation-message',
      CONFIG.ERROR_DISPLAY_DURATION
    );
  }
}

/**
 * Log error to console with context
 * @param {string} context - Context describing where error occurred
 * @param {Error} error - The error object
 * @param {Object} details - Additional details object
 */
function logError(context, error, details = {}) {
  console.error(`[${context}]`, error, details);
}

// ============================================
// 3. STATE MANAGEMENT
// ============================================

const AppState = {
  tasks: [],                    // Array of task objects
  quickLinks: [],               // Array of quick link objects
  timer: {
    seconds: 1500,             // Remaining time in seconds
    isRunning: false,          // Timer is counting down
    isComplete: false          // Timer has reached 00:00
  },
  userName: '',                // User's name for greeting
  editingTodoId: null,         // ID of task currently in edit mode, or null
  editingLinkId: null,         // ID of link currently in edit mode, or null
  
  // Getter methods
  getTaskById(id) {
    return this.tasks.find(t => t.id === id);
  },
  
  getLinkById(id) {
    return this.quickLinks.find(l => l.id === id);
  }
};

// ============================================
// 4. LOCAL STORAGE MANAGER
// ============================================

const StorageManager = {
  /**
   * Save tasks array to localStorage
   * @param {Array} tasks - Tasks to save
   */
  saveTodos(tasks) {
    try {
      const data = { version: 1, data: tasks };
      localStorage.setItem(CONFIG.STORAGE_KEYS.TODOS, JSON.stringify(data));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Local Storage quota exceeded for tasks');
      } else {
        console.error('Error saving tasks:', e);
      }
    }
  },

  /**
   * Load tasks array from localStorage
   * @returns {Array} Tasks array or empty array on error
   */
  loadTodos() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.TODOS);
      if (!stored) return [];
      
      const { data } = JSON.parse(stored);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error loading tasks:', e);
      return [];
    }
  },

  /**
   * Save quick links array to localStorage
   * @param {Array} links - Quick links to save
   */
  saveQuickLinks(links) {
    try {
      const data = { version: 1, data: links };
      localStorage.setItem(CONFIG.STORAGE_KEYS.QUICK_LINKS, JSON.stringify(data));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        console.error('Local Storage quota exceeded for quick links');
      } else {
        console.error('Error saving quick links:', e);
      }
    }
  },

  /**
   * Load quick links array from localStorage
   * @returns {Array} Quick links array or empty array on error
   */
  loadQuickLinks() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.QUICK_LINKS);
      if (!stored) return [];
      
      const { data } = JSON.parse(stored);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error loading quick links:', e);
      return [];
    }
  },

  /**
   * Save dashboard settings (userName, timerState) to localStorage
   * @param {Object} data - Dashboard data to save
   */
  saveDashboard(data) {
    try {
      const payload = { version: 1, data };
      localStorage.setItem(CONFIG.STORAGE_KEYS.DASHBOARD, JSON.stringify(payload));
    } catch (e) {
      console.error('Error saving dashboard settings:', e);
    }
  },

  /**
   * Load dashboard settings from localStorage
   * @returns {Object} Dashboard data or empty object on error
   */
  loadDashboard() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.DASHBOARD);
      if (!stored) return {};
      
      const { data } = JSON.parse(stored);
      return data || {};
    } catch (e) {
      console.error('Error loading dashboard settings:', e);
      return {};
    }
  }
};

// ============================================
// 5. GREETING SECTION
// ============================================

const GreetingComponent = {
  // Initialize greeting component
  init() {
    this.loadUserName();
    this.updateTime();
    setInterval(() => this.updateTime(), CONFIG.TIME_UPDATE_INTERVAL);
  },

  // Update time and date displays
  updateTime() {
    const now = new Date();
    const hour = now.getHours();
    
    document.querySelector('.greeting-text').textContent = this.getGreeting(hour);
    document.querySelector('.time-display').textContent = formatTime(now);
    document.querySelector('.date-display').textContent = formatDate(now);
  },

  // Get time-based greeting
  getGreeting(hour) {
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  },

  // Save user name to AppState and localStorage
  saveUserName(name) {
    const trimmedName = name.trim();
    AppState.userName = trimmedName;
    StorageManager.saveDashboard({ userName: trimmedName });
  },

  // Load user name from localStorage and restore to input
  loadUserName() {
    const dashboard = StorageManager.loadDashboard();
    if (dashboard.userName) {
      AppState.userName = dashboard.userName;
      document.querySelector('.user-name-input').value = dashboard.userName;
    }
  }
};

// ============================================
// 6. FOCUS TIMER COMPONENT
// ============================================

const TimerComponent = {
  intervalId: null,

  // Initialize timer
  init() {
    this.updateTimerUI();
  },

  // Start countdown
  startTimer() {
    if (AppState.timer.isRunning) return;
    
    AppState.timer.isRunning = true;
    this.updateTimerUI();
    
    this.intervalId = setInterval(() => this.decrementTimer(), CONFIG.TIMER_UPDATE_INTERVAL);
  },

  // Pause countdown
  stopTimer() {
    AppState.timer.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.updateTimerUI();
  },

  // Reset to 25:00
  resetTimer() {
    this.stopTimer();
    AppState.timer.seconds = CONFIG.TIMER_DURATION;
    AppState.timer.isComplete = false;
    document.querySelector('.focus-timer').classList.remove('complete');
    this.updateTimerUI();
  },

  // Decrement timer by 1 second
  decrementTimer() {
    AppState.timer.seconds--;
    
    if (AppState.timer.seconds <= 0) {
      AppState.timer.seconds = 0;
      AppState.timer.isRunning = false;
      AppState.timer.isComplete = true;
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.playNotification();
    }
    
    this.updateTimerUI();
  },

  // Play completion notification
  playNotification() {
    // Visual indicator
    document.querySelector('.focus-timer').classList.add('complete');
    document.querySelector('.timer-status').textContent = 'Complete';
    
    // Audio notification (simple beep using Web Audio API)
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.warn('Could not play audio notification:', e);
    }
  },

  // Update timer display and button states
  updateTimerUI() {
    const display = document.querySelector('.timer-display');
    display.textContent = formatTimerDisplay(AppState.timer.seconds);
    
    const startBtn = document.querySelector('.start-btn');
    const stopBtn = document.querySelector('.stop-btn');
    const resetBtn = document.querySelector('.reset-btn');
    
    if (AppState.timer.isRunning) {
      startBtn.textContent = 'Pause';
      stopBtn.disabled = false;
      resetBtn.disabled = true;
      document.querySelector('.timer-status').textContent = 'Running';
    } else {
      startBtn.textContent = 'Start';
      stopBtn.disabled = true;
      resetBtn.disabled = false;
      if (!AppState.timer.isComplete) {
        document.querySelector('.timer-status').textContent = 'Ready';
      }
    }
  }
};

// ============================================
// 7. TO-DO LIST COMPONENT
// ============================================

const TodoComponent = {
  // Initialize todo component
  init() {
    AppState.tasks = StorageManager.loadTodos();
    this.render();
  },

  // Add new task
  addTodo(title) {
    const validated = this.validateInput(title);
    if (!validated.valid) {
      showValidationMessage(validated.error, '.todo-validation-message');
      return;
    }

    const task = {
      id: generateUUID(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now()
    };

    AppState.tasks.push(task);
    this.saveTodosToStorage();
    this.render();
    
    document.querySelector('.todo-input').value = '';
    document.querySelector('.todo-input').focus();
  },

  // Edit task title
  editTodo(id, newTitle) {
    const validated = this.validateInput(newTitle);
    if (!validated.valid) {
      showValidationMessage(validated.error, '.todo-validation-message');
      return;
    }

    const task = AppState.getTaskById(id);
    if (!task) return;

    task.title = newTitle.trim();
    AppState.editingTodoId = null;
    this.saveTodosToStorage();
    this.render();
  },

  // Delete task
  deleteTodo(id) {
    const index = AppState.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      AppState.tasks.splice(index, 1);
      if (AppState.editingTodoId === id) {
        AppState.editingTodoId = null;
      }
      this.saveTodosToStorage();
      this.render();
    }
  },

  // Toggle task completion status
  toggleComplete(id) {
    const task = AppState.getTaskById(id);
    if (task) {
      task.completed = !task.completed;
      this.saveTodosToStorage();
      this.render();
    }
  },

  // Validate task input
  validateInput(title) {
    if (!title || !title.trim()) {
      return { valid: false, error: 'Task cannot be empty' };
    }
    if (title.length > CONFIG.VALIDATION.MAX_TASK_LENGTH) {
      return { valid: false, error: `Task cannot exceed ${CONFIG.VALIDATION.MAX_TASK_LENGTH} characters` };
    }
    return { valid: true };
  },

  // Render all tasks
  render() {
    const list = document.querySelector('.todo-list');
    const emptyMessage = document.querySelector('.todo-list-section .empty-message');
    
    list.innerHTML = '';
    
    if (AppState.tasks.length === 0) {
      emptyMessage.classList.add('show');
      return;
    }
    
    emptyMessage.classList.remove('show');
    AppState.tasks.forEach(task => this.renderItem(task));
  },

  // Render single task item
  renderItem(task) {
    const list = document.querySelector('.todo-list');
    const isEditing = AppState.editingTodoId === task.id;
    
    if (isEditing) {
      // Edit mode
      const item = document.createElement('li');
      item.className = 'todo-item edit-mode';
      item.dataset.id = task.id;
      item.innerHTML = `
        <input type="text" class="edit-input" value="${escapeHtml(task.title)}" autofocus>
        <button class="save-edit-btn" data-id="${task.id}">Save</button>
        <button class="cancel-edit-btn" data-id="${task.id}">Cancel</button>
      `;
      list.appendChild(item);
      
      // Focus on input
      setTimeout(() => item.querySelector('.edit-input').focus(), 0);
    } else {
      // Display mode
      const item = document.createElement('li');
      item.className = `todo-item ${task.completed ? 'completed' : ''}`;
      item.dataset.id = task.id;
      item.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="todo-title">${escapeHtml(task.title)}</span>
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      `;
      list.appendChild(item);
    }
  },

  // Save todos to localStorage
  saveTodosToStorage() {
    StorageManager.saveTodos(AppState.tasks);
  },

  // Load todos from localStorage
  loadTodosFromStorage() {
    AppState.tasks = StorageManager.loadTodos();
  }
};

// ============================================
// 8. QUICK LINKS COMPONENT
// ============================================

const LinksComponent = {
  // Initialize quick links component
  init() {
    AppState.quickLinks = StorageManager.loadQuickLinks();
    this.render();
  },

  // Add new link
  addLink(title, url) {
    const validated = this.validateInput(title, url);
    if (!validated.valid) {
      showValidationMessage(validated.error, '.link-validation-message');
      return;
    }

    const link = {
      id: generateUUID(),
      title: title.trim(),
      url: url.trim()
    };

    AppState.quickLinks.push(link);
    this.saveLinksToStorage();
    this.render();
    
    document.querySelector('.link-title-input').value = '';
    document.querySelector('.link-url-input').value = '';
    document.querySelector('.link-title-input').focus();
  },

  // Edit link
  editLink(id, newTitle, newUrl) {
    const validated = this.validateInput(newTitle, newUrl);
    if (!validated.valid) {
      showValidationMessage(validated.error, '.link-validation-message');
      return;
    }

    const link = AppState.getLinkById(id);
    if (!link) return;

    link.title = newTitle.trim();
    link.url = newUrl.trim();
    AppState.editingLinkId = null;
    this.saveLinksToStorage();
    this.render();
  },

  // Delete link
  deleteLink(id) {
    const index = AppState.quickLinks.findIndex(l => l.id === id);
    if (index !== -1) {
      AppState.quickLinks.splice(index, 1);
      if (AppState.editingLinkId === id) {
        AppState.editingLinkId = null;
      }
      this.saveLinksToStorage();
      this.render();
    }
  },

  // Validate link input
  validateInput(title, url) {
    if (!title || !title.trim()) {
      return { valid: false, error: 'Link title cannot be empty' };
    }
    if (!url || !url.trim()) {
      return { valid: false, error: 'URL cannot be empty' };
    }
    if (!isValidURL(url)) {
      return { valid: false, error: 'Invalid URL format' };
    }
    return { valid: true };
  },

  // Render all links
  render() {
    const container = document.querySelector('.quick-links-container');
    const emptyMessage = document.querySelector('.quick-links-section .empty-message');
    
    container.innerHTML = '';
    
    if (AppState.quickLinks.length === 0) {
      emptyMessage.classList.add('show');
      return;
    }
    
    emptyMessage.classList.remove('show');
    AppState.quickLinks.forEach(link => this.renderItem(link));
  },

  // Render single link item
  renderItem(link) {
    const container = document.querySelector('.quick-links-container');
    const isEditing = AppState.editingLinkId === link.id;
    
    if (isEditing) {
      // Edit mode
      const item = document.createElement('div');
      item.className = 'quick-link edit-mode';
      item.dataset.id = link.id;
      item.innerHTML = `
        <input type="text" class="edit-link-title" value="${escapeHtml(link.title)}" autofocus>
        <input type="url" class="edit-link-url" value="${escapeHtml(link.url)}">
        <button class="save-link-edit-btn" data-id="${link.id}">Save</button>
        <button class="cancel-link-edit-btn" data-id="${link.id}">Cancel</button>
      `;
      container.appendChild(item);
      
      // Focus on title input
      setTimeout(() => item.querySelector('.edit-link-title').focus(), 0);
    } else {
      // Display mode
      const item = document.createElement('a');
      item.className = 'quick-link';
      item.href = link.url;
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
      item.dataset.id = link.id;
      item.innerHTML = `
        <span class="link-title">${escapeHtml(link.title)}</span>
        <button class="link-edit-btn" data-id="${link.id}" onclick="event.stopPropagation()">Edit</button>
        <button class="link-delete-btn" data-id="${link.id}" onclick="event.stopPropagation()">Delete</button>
      `;
      container.appendChild(item);
    }
  },

  // Save links to localStorage
  saveLinksToStorage() {
    StorageManager.saveQuickLinks(AppState.quickLinks);
  },

  // Load links from localStorage
  loadLinksFromStorage() {
    AppState.quickLinks = StorageManager.loadQuickLinks();
  }
};

// ============================================
// 9. EVENT DELEGATION & HANDLERS
// ============================================

/**
 * Global event delegation for all click events
 */
function handleGlobalClick(e) {
  const target = e.target;
  
  // Todo buttons
  if (target.classList.contains('add-todo-btn')) {
    const input = document.querySelector('.todo-input');
    TodoComponent.addTodo(input.value);
  } else if (target.classList.contains('edit-btn') && target.dataset.id) {
    AppState.editingTodoId = target.dataset.id;
    TodoComponent.render();
  } else if (target.classList.contains('delete-btn') && target.dataset.id) {
    if (confirm('Are you sure you want to delete this task?')) {
      TodoComponent.deleteTodo(target.dataset.id);
    }
  } else if (target.classList.contains('save-edit-btn') && target.dataset.id) {
    const input = target.closest('.todo-item').querySelector('.edit-input');
    TodoComponent.editTodo(target.dataset.id, input.value);
  } else if (target.classList.contains('cancel-edit-btn')) {
    AppState.editingTodoId = null;
    TodoComponent.render();
  } else if (target.classList.contains('todo-checkbox') && target.closest('.todo-item').dataset.id) {
    TodoComponent.toggleComplete(target.closest('.todo-item').dataset.id);
  }
  
  // Link buttons
  else if (target.classList.contains('add-link-btn')) {
    const titleInput = document.querySelector('.link-title-input');
    const urlInput = document.querySelector('.link-url-input');
    LinksComponent.addLink(titleInput.value, urlInput.value);
  } else if (target.classList.contains('link-edit-btn') && target.dataset.id) {
    AppState.editingLinkId = target.dataset.id;
    LinksComponent.render();
  } else if (target.classList.contains('link-delete-btn') && target.dataset.id) {
    if (confirm('Are you sure you want to delete this link?')) {
      LinksComponent.deleteLink(target.dataset.id);
    }
  } else if (target.classList.contains('save-link-edit-btn') && target.dataset.id) {
    const item = target.closest('.quick-link');
    const titleInput = item.querySelector('.edit-link-title');
    const urlInput = item.querySelector('.edit-link-url');
    LinksComponent.editLink(target.dataset.id, titleInput.value, urlInput.value);
  } else if (target.classList.contains('cancel-link-edit-btn')) {
    AppState.editingLinkId = null;
    LinksComponent.render();
  }
  
  // Timer buttons
  else if (target.classList.contains('start-btn')) {
    if (AppState.timer.isRunning) {
      TimerComponent.stopTimer();
    } else {
      TimerComponent.startTimer();
    }
  } else if (target.classList.contains('stop-btn')) {
    TimerComponent.stopTimer();
  } else if (target.classList.contains('reset-btn')) {
    TimerComponent.resetTimer();
  }
}

/**
 * Global event delegation for keyboard events
 */
function handleGlobalKeydown(e) {
  // Add task on Enter in todo input
  if (e.key === 'Enter' && e.target === document.querySelector('.todo-input')) {
    const input = document.querySelector('.todo-input');
    TodoComponent.addTodo(input.value);
  }
  
  // Save task edit on Enter
  else if (e.key === 'Enter' && e.target.classList.contains('edit-input')) {
    const btn = e.target.closest('.todo-item').querySelector('.save-edit-btn');
    btn.click();
  }
  
  // Cancel task edit on Escape
  else if (e.key === 'Escape' && e.target.classList.contains('edit-input')) {
    const btn = e.target.closest('.todo-item').querySelector('.cancel-edit-btn');
    btn.click();
  }
  
  // Add link on Enter in link inputs
  else if (e.key === 'Enter' && (e.target === document.querySelector('.link-title-input') || e.target === document.querySelector('.link-url-input'))) {
    const titleInput = document.querySelector('.link-title-input');
    const urlInput = document.querySelector('.link-url-input');
    LinksComponent.addLink(titleInput.value, urlInput.value);
  }
  
  // Save link edit on Enter
  else if (e.key === 'Enter' && (e.target.classList.contains('edit-link-title') || e.target.classList.contains('edit-link-url'))) {
    const btn = e.target.closest('.quick-link').querySelector('.save-link-edit-btn');
    btn.click();
  }
  
  // Cancel link edit on Escape
  else if (e.key === 'Escape' && (e.target.classList.contains('edit-link-title') || e.target.classList.contains('edit-link-url'))) {
    const btn = e.target.closest('.quick-link').querySelector('.cancel-link-edit-btn');
    btn.click();
  }
  
  // Save user name on Enter
  else if (e.key === 'Enter' && e.target === document.querySelector('.user-name-input')) {
    GreetingComponent.saveUserName(e.target.value);
  }
}

/**
 * Save user name on blur
 */
function handleUserNameBlur(e) {
  GreetingComponent.saveUserName(e.target.value);
}

// ============================================
// 10. INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Check localStorage availability
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
  } catch (e) {
    console.error('Local Storage is not available. Private browsing mode may be enabled.');
  }
  
  // Initialize settings first
  SettingsManager.init();
  
  // Initialize all components
  GreetingComponent.init();
  TimerComponent.init();
  TodoComponent.init();
  LinksComponent.init();
  
  // Attach event listeners
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('keydown', handleGlobalKeydown);
  document.querySelector('.user-name-input').addEventListener('blur', handleUserNameBlur);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (TimerComponent.intervalId) {
    clearInterval(TimerComponent.intervalId);
  }
});


// ============================================
// 11. SETTINGS & THEME MANAGEMENT
// ============================================

const SettingsManager = {
  // Initialize settings
  init() {
    this.loadSettings();
    this.setupEventListeners();
    this.applySettings();
  },

  // Load settings from localStorage
  loadSettings() {
    try {
      const stored = localStorage.getItem('dashboard-settings') || '{}';
      const settings = JSON.parse(stored);
      AppState.settings = {
        darkMode: settings.darkMode || false,
        greetingName: settings.greetingName || '',
        timerDuration: settings.timerDuration || 25
      };
    } catch (e) {
      AppState.settings = {
        darkMode: false,
        greetingName: '',
        timerDuration: 25
      };
    }
  },

  // Save settings to localStorage
  saveSettings() {
    try {
      localStorage.setItem('dashboard-settings', JSON.stringify(AppState.settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  },

  // Apply settings to the UI
  applySettings() {
    // Apply dark mode
    if (AppState.settings.darkMode) {
      document.body.classList.add('dark-mode');
      document.getElementById('theme-toggle').checked = true;
    } else {
      document.body.classList.remove('dark-mode');
      document.getElementById('theme-toggle').checked = false;
    }

    // Apply greeting name
    if (AppState.settings.greetingName) {
      document.getElementById('custom-greeting-name').value = AppState.settings.greetingName;
    }

    // Apply timer duration
    const timerDurationInput = document.getElementById('timer-duration');
    timerDurationInput.value = AppState.settings.timerDuration;
  },

  // Setup event listeners
  setupEventListeners() {
    // Settings panel toggle
    document.getElementById('settings-toggle').addEventListener('click', () => {
      const panel = document.getElementById('settings-panel');
      panel.classList.toggle('show');
    });

    // Close settings panel
    document.getElementById('settings-close').addEventListener('click', () => {
      document.getElementById('settings-panel').classList.remove('show');
    });

    // Close settings panel when clicking outside
    document.addEventListener('click', (e) => {
      const panel = document.getElementById('settings-panel');
      const btn = document.getElementById('settings-toggle');
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('show');
      }
    });

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('change', (e) => {
      AppState.settings.darkMode = e.target.checked;
      this.saveSettings();
      this.applySettings();
    });

    // Greeting name input
    document.getElementById('custom-greeting-name').addEventListener('change', (e) => {
      AppState.settings.greetingName = e.target.value.trim();
      this.saveSettings();
      GreetingComponent.updateGreetingWithName();
    });

    // Timer duration input
    document.getElementById('timer-duration').addEventListener('change', (e) => {
      const newDuration = parseInt(e.target.value);
      if (newDuration >= 1 && newDuration <= 60) {
        AppState.settings.timerDuration = newDuration;
        this.saveSettings();
        // Reset timer with new duration
        TimerComponent.resetTimer();
      }
    });
  }
};

// Update CONFIG to use dynamic timer duration
Object.defineProperty(CONFIG, 'TIMER_DURATION', {
  get() {
    return (AppState.settings?.timerDuration || 25) * 60;
  }
});

// Update GreetingComponent to include custom name
const GreetingComponentOriginalUpdateTime = GreetingComponent.updateTime;
GreetingComponent.updateGreetingWithName = function() {
  const now = new Date();
  const hour = now.getHours();
  let greetingText = this.getGreeting(hour);
  
  if (AppState.settings?.greetingName) {
    greetingText += ', ' + AppState.settings.greetingName;
  }
  
  document.querySelector('.greeting-text').textContent = greetingText;
};

// Enhance updateTime to include custom name
GreetingComponent.updateTime = function() {
  const now = new Date();
  const hour = now.getHours();
  
  let greetingText = this.getGreeting(hour);
  if (AppState.settings?.greetingName) {
    greetingText += ', ' + AppState.settings.greetingName;
  }
  
  document.querySelector('.greeting-text').textContent = greetingText;
  document.querySelector('.time-display').textContent = formatTime(now);
  document.querySelector('.date-display').textContent = formatDate(now);
};

