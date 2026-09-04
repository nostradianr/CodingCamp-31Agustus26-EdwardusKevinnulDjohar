# To-Do List Dashboard - Technical Design Document

## Overview

The To-Do List Dashboard is a lightweight, client-side web application built with vanilla JavaScript, HTML, and CSS. It provides users with a focused productivity interface combining a time-based greeting, Pomodoro timer, task management system, and quick link shortcuts. All data persists exclusively through the browser's Local Storage API, requiring no backend infrastructure.

**Design Philosophy**: Minimal, fast, and maintainable. Single CSS and JS files maximize simplicity and performance while meeting all functional requirements.

---

## Architecture

### System Structure

The application follows a modular, layered architecture organized into distinct concerns:

```
┌─────────────────────────────────────────────────┐
│          Presentation Layer (DOM)               │
│  ┌─────────┬──────────┬─────────┬────────────┐  │
│  │Greeting │  Timer   │ To-Do   │ Quick Link │  │
│  │Component│Component │Component│ Component  │  │
│  └─────────┴──────────┴─────────┴────────────┘  │
├─────────────────────────────────────────────────┤
│       State Management & Event Handling         │
│  ┌────────────────────────────────────────────┐ │
│  │  Application State Store                   │ │
│  │  Event Bus / Delegation                    │ │
│  └────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────┤
│         Data Access & Persistence               │
│  ┌────────────────────────────────────────────┐ │
│  │  Local Storage Manager                     │ │
│  │  Serialization / Deserialization           │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Core Principle: MVC-Inspired Separation

- **Model**: Data stored in Local Storage (tasks, quick links)
- **View**: DOM elements rendered from state
- **Controller**: Event listeners and business logic

Single-file constraint handled via:
1. **One CSS file** (`css/styles.css`): All styling organized by component
2. **One JS file** (`js/app.js`): All logic organized into logical sections with clear comments

---

## Components and Interfaces

### 1. Greeting Section Component

**Responsibility**: Display current time, date, and time-based greeting

**DOM Structure**:
```html
<div class="greeting-section">
  <div class="greeting-text">Good Morning</div>
  <div class="time-display">14:35</div>
  <div class="date-display">Monday, August 26, 2024</div>
  <input type="text" class="user-name-input" placeholder="Enter your name">
</div>
```

**Functions**:
- `initGreeting()`: Initialize greeting section
- `updateTime()`: Update time display every second
- `getGreeting(hour)`: Determine greeting based on current hour
- `formatTime(date)`: Format time in 12/24-hour format
- `formatDate(date)`: Format date as "Day, Month Date, Year"
- `saveUserName(name)`: Store user name to Local Storage
- `loadUserName()`: Retrieve user name from Local Storage

**State Managed**:
- Current time (updated every second)
- User name (persistent)

---

### 2. Focus Timer Component

**Responsibility**: Pomodoro timer with start, pause, stop, and reset controls

**DOM Structure**:
```html
<div class="focus-timer">
  <div class="timer-display">25:00</div>
  <div class="timer-controls">
    <button class="timer-btn start-btn">Start</button>
    <button class="timer-btn stop-btn">Stop</button>
    <button class="timer-btn reset-btn">Reset</button>
  </div>
  <div class="timer-status">Ready</div>
</div>
```

**Functions**:
- `initTimer()`: Initialize timer to 25:00
- `startTimer()`: Begin countdown from current value
- `stopTimer()`: Pause countdown
- `resetTimer()`: Return to 25:00
- `decrementTimer()`: Reduce time by 1 second
- `formatTimerDisplay(seconds)`: Convert seconds to MM:SS format
- `playNotification()`: Trigger completion notification
- `updateTimerUI()`: Render timer display and control states

**State Managed**:
- Current time remaining (in seconds)
- Is running (boolean)
- Is complete (boolean)

**Notification Strategy**:
- Visual: Change color to green, display "Complete" message
- Audio: Play system notification sound
- Browser: Optional native notification API

---

### 3. To-Do List Component

**Responsibility**: Full CRUD operations on tasks with local persistence

**DOM Structure**:
```html
<div class="todo-list-section">
  <div class="todo-input-area">
    <input type="text" class="todo-input" placeholder="Add a new task...">
    <button class="add-todo-btn">Add</button>
  </div>
  <div class="todo-validation-message"></div>
  <ul class="todo-list">
    <li class="todo-item" data-id="unique-id">
      <input type="checkbox" class="todo-checkbox">
      <span class="todo-title">Task Title</span>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </li>
    <!-- Edit mode -->
    <li class="todo-item edit-mode" data-id="unique-id">
      <input type="text" class="edit-input" value="Task Title">
      <button class="save-edit-btn">Save</button>
      <button class="cancel-edit-btn">Cancel</button>
    </li>
  </ul>
  <div class="empty-message">No tasks yet. Add one to get started!</div>
</div>
```

**Functions**:
- `initTodoList()`: Initialize from Local Storage
- `addTodo(title)`: Create new task
- `editTodo(id, newTitle)`: Update task title
- `deleteTodo(id)`: Remove task
- `toggleComplete(id)`: Toggle completion status
- `renderTodoList()`: Render all tasks to DOM
- `renderTodoItem(task)`: Render single task or edit mode
- `saveTodosToStorage()`: Persist tasks to Local Storage
- `loadTodosFromStorage()`: Retrieve tasks from Local Storage
- `validateTaskInput(title)`: Validate non-empty, non-whitespace input

**State Managed**:
- Tasks array: `[{ id, title, completed, createdAt }, ...]`
- Active edit mode (id or null)

---

### 4. Quick Links Component

**Responsibility**: Create, edit, delete, and navigate to user-defined links

**DOM Structure**:
```html
<div class="quick-links-section">
  <div class="quick-links-header">Quick Links</div>
  <div class="quick-links-input-area">
    <input type="text" class="link-title-input" placeholder="Link title">
    <input type="url" class="link-url-input" placeholder="https://example.com">
    <button class="add-link-btn">Add</button>
  </div>
  <div class="link-validation-message"></div>
  <div class="quick-links-container">
    <a href="https://example.com" class="quick-link" data-id="unique-id">
      <span class="link-title">Example</span>
      <button class="link-edit-btn">Edit</button>
      <button class="link-delete-btn">Delete</button>
    </a>
    <!-- Edit mode -->
    <div class="quick-link edit-mode" data-id="unique-id">
      <input type="text" class="edit-link-title" value="Example">
      <input type="url" class="edit-link-url" value="https://example.com">
      <button class="save-link-edit-btn">Save</button>
      <button class="cancel-link-edit-btn">Cancel</button>
    </div>
  </div>
  <div class="empty-message">No quick links yet. Add one to get started!</div>
</div>
```

**Functions**:
- `initQuickLinks()`: Initialize from Local Storage
- `addLink(title, url)`: Create new link
- `editLink(id, newTitle, newUrl)`: Update link
- `deleteLink(id)`: Remove link
- `renderQuickLinks()`: Render all links to DOM
- `renderQuickLink(link)`: Render single link or edit mode
- `saveLinksToStorage()`: Persist links to Local Storage
- `loadLinksFromStorage()`: Retrieve links from Local Storage
- `validateLinkInput(title, url)`: Validate non-empty title and valid URL format

**State Managed**:
- Links array: `[{ id, title, url }, ...]`
- Active edit mode (id or null)

---

## Data Models

### Task Model
```javascript
{
  id: "uuid-v4-string",           // Unique identifier
  title: "Task description",       // Task title (required, non-empty)
  completed: false,                // Completion status
  createdAt: 1693046400000         // Timestamp in milliseconds
}
```

### Quick Link Model
```javascript
{
  id: "uuid-v4-string",           // Unique identifier
  title: "Google",                // Link display name (required, non-empty)
  url: "https://google.com"       // Full URL (required, valid format)
}
```

### Application State
```javascript
{
  tasks: [],                      // Array of Task objects
  quickLinks: [],                 // Array of Quick Link objects
  timer: {
    seconds: 1500,                // Remaining time (25 min = 1500 sec)
    isRunning: false,
    isComplete: false
  },
  userName: "",                   // User's name (optional)
  editingTodoId: null,            // ID of task in edit mode or null
  editingLinkId: null             // ID of link in edit mode or null
}
```

---

## Local Storage Schema

### Storage Keys

```javascript
{
  "todos": {
    version: 1,
    data: [
      { id, title, completed, createdAt },
      ...
    ]
  },
  "quickLinks": {
    version: 1,
    data: [
      { id, title, url },
      ...
    ]
  },
  "dashboard": {
    version: 1,
    data: {
      userName: "John",
      timerState: {
        seconds: 1500,
        isRunning: false,
        isComplete: false
      }
    }
  }
}
```

### Rationale

- **Separate keys** for todos, quickLinks, and dashboard settings allow independent updates and scalability
- **Version field** enables future schema migrations without data loss
- **Nested structure** organizes metadata (version) with data for clarity

### Migration Strategy

```javascript
function migrateLocalStorage() {
  // Check version numbers
  // If outdated, transform data structure
  // Update version after migration
}
```

---

## JavaScript Module Structure

### File Organization: `js/app.js`

The single JavaScript file is organized into logical sections:

```javascript
// ============================================
// 1. CONFIGURATION & CONSTANTS
// ============================================
const CONFIG = {
  TIMER_DURATION: 25 * 60,        // 25 minutes in seconds
  TIMER_UPDATE_INTERVAL: 1000,    // 1 second
  TIME_UPDATE_INTERVAL: 1000,     // 1 second
  STORAGE_KEYS: {
    TODOS: 'todos',
    QUICK_LINKS: 'quickLinks',
    DASHBOARD: 'dashboard'
  }
};

// ============================================
// 2. UTILITY FUNCTIONS
// ============================================
// UUID generation
// Date/time formatting
// URL validation
// Local Storage helpers

// ============================================
// 3. STATE MANAGEMENT
// ============================================
const AppState = {
  tasks: [],
  quickLinks: [],
  timer: { seconds: 1500, isRunning: false, isComplete: false },
  userName: '',
  editingTodoId: null,
  editingLinkId: null,
  
  // Getters and setters
};

// ============================================
// 4. LOCAL STORAGE MANAGER
// ============================================
const StorageManager = {
  saveTodos(tasks) { ... },
  loadTodos() { ... },
  saveQuickLinks(links) { ... },
  loadQuickLinks() { ... },
  saveDashboard(data) { ... },
  loadDashboard() { ... }
};

// ============================================
// 5. GREETING SECTION
// ============================================
const GreetingComponent = {
  init() { ... },
  updateTime() { ... },
  getGreeting(hour) { ... }
};

// ============================================
// 6. FOCUS TIMER COMPONENT
// ============================================
const TimerComponent = {
  init() { ... },
  start() { ... },
  stop() { ... },
  reset() { ... },
  decrement() { ... }
};

// ============================================
// 7. TO-DO LIST COMPONENT
// ============================================
const TodoComponent = {
  init() { ... },
  add(title) { ... },
  edit(id, newTitle) { ... },
  delete(id) { ... },
  toggleComplete(id) { ... },
  render() { ... }
};

// ============================================
// 8. QUICK LINKS COMPONENT
// ============================================
const LinksComponent = {
  init() { ... },
  add(title, url) { ... },
  edit(id, newTitle, newUrl) { ... },
  delete(id) { ... },
  render() { ... }
};

// ============================================
// 9. EVENT DELEGATION & HANDLERS
// ============================================
function attachEventListeners() {
  document.addEventListener('click', handleClick);
  document.addEventListener('keydown', handleKeydown);
  // etc.
}

// ============================================
// 10. INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  // Load from storage
  // Start intervals
});
```

### Key Functions

#### UUID Generation
```javascript
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

#### URL Validation
```javascript
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

#### Local Storage Error Handling
```javascript
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showError('Storage quota exceeded. Please clear some data.');
    }
  }
}
```

---

## CSS Design System

### File Organization: `css/styles.css`

The single CSS file is organized by component and concern:

```css
/* ============================================
   1. CSS VARIABLES & GLOBAL STYLES
   ============================================ */
:root {
  /* Color Palette */
  --primary: #4a5568;          /* Dark slate gray */
  --primary-light: #cbd5e0;    /* Light gray */
  --accent: #667eea;           /* Indigo (accent) */
  --success: #48bb78;          /* Green (complete/timer done) */
  --warning: #ed8936;          /* Orange (warning) */
  --error: #f56565;            /* Red (error) */
  --bg-primary: #ffffff;       /* White background */
  --bg-secondary: #f7fafc;     /* Light gray background */
  --text-primary: #2d3748;     /* Dark text */
  --text-secondary: #718096;   /* Medium text */
  --text-light: #a0aec0;       /* Light text */
  
  /* Spacing */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 24px;
  --sp-6: 32px;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  
  /* Other */
  --transition: all 0.2s ease;
  --radius: 8px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
}

/* Base Styles */
body {
  font-family: var(--font-family);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  margin: 0;
  padding: var(--sp-5);
}

/* ============================================
   2. LAYOUT & CONTAINER
   ============================================ */
.dashboard {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--sp-5);
}

@media (min-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr 1fr;
  }
}

/* ============================================
   3. GREETING SECTION
   ============================================ */
.greeting-section {
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: white;
  padding: var(--sp-5);
  border-radius: var(--radius);
  box-shadow: var(--shadow-md);
}

.greeting-text {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--sp-3);
}

.time-display {
  font-size: var(--font-size-2xl);
  font-weight: bold;
  font-family: 'Monaco', monospace;
  margin-bottom: var(--sp-2);
}

.date-display {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin-bottom: var(--sp-4);
}

.user-name-input {
  width: 100%;
  padding: var(--sp-2) var(--sp-3);
  border: none;
  border-radius: 4px;
  font-size: var(--font-size-sm);
}

/* ============================================
   4. FOCUS TIMER SECTION
   ============================================ */
.focus-timer {
  background: var(--bg-secondary);
  padding: var(--sp-5);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  text-align: center;
}

.timer-display {
  font-size: var(--font-size-2xl);
  font-family: 'Monaco', monospace;
  font-weight: bold;
  color: var(--accent);
  margin-bottom: var(--sp-4);
}

.focus-timer.complete .timer-display {
  color: var(--success);
}

.timer-controls {
  display: flex;
  gap: var(--sp-2);
  justify-content: center;
  margin-bottom: var(--sp-3);
}

.timer-btn {
  padding: var(--sp-2) var(--sp-4);
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: var(--transition);
}

.timer-btn:hover:not(:disabled) {
  background: #5569f3;
}

.timer-btn:disabled {
  background: var(--primary-light);
  cursor: not-allowed;
  opacity: 0.6;
}

.timer-status {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* ============================================
   5. TO-DO LIST SECTION
   ============================================ */
.todo-list-section {
  background: var(--bg-secondary);
  padding: var(--sp-5);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  grid-column: span 2;
}

.todo-input-area {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.todo-input,
.link-title-input,
.link-url-input {
  flex: 1;
  padding: var(--sp-2) var(--sp-3);
  border: 1px solid var(--primary-light);
  border-radius: 4px;
  font-size: var(--font-size-base);
}

.add-todo-btn,
.add-link-btn {
  padding: var(--sp-2) var(--sp-4);
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: var(--transition);
}

.add-todo-btn:hover,
.add-link-btn:hover {
  background: #5569f3;
}

.validation-message {
  color: var(--error);
  font-size: var(--font-size-sm);
  margin-bottom: var(--sp-2);
  display: none;
}

.validation-message.show {
  display: block;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-3);
  background: white;
  border-bottom: 1px solid var(--primary-light);
  transition: var(--transition);
}

.todo-item:hover {
  background: #f8f9fa;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: var(--text-secondary);
  opacity: 0.7;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--success);
}

.todo-title {
  flex: 1;
  font-size: var(--font-size-base);
}

.edit-btn,
.delete-btn,
.link-edit-btn,
.link-delete-btn {
  padding: 4px 12px;
  border: 1px solid var(--primary-light);
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--font-size-xs);
  transition: var(--transition);
}

.edit-btn:hover,
.link-edit-btn:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.delete-btn:hover,
.link-delete-btn:hover {
  background: var(--error);
  color: white;
  border-color: var(--error);
}

/* Edit Mode */
.todo-item.edit-mode {
  gap: var(--sp-2);
  padding: var(--sp-2);
}

.edit-input {
  flex: 1;
  padding: var(--sp-2);
  border: 1px solid var(--accent);
  border-radius: 4px;
  font-size: var(--font-size-base);
}

.save-edit-btn,
.cancel-edit-btn,
.save-link-edit-btn,
.cancel-link-edit-btn {
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--font-size-xs);
  transition: var(--transition);
}

.save-edit-btn,
.save-link-edit-btn {
  background: var(--success);
  color: white;
}

.cancel-edit-btn,
.cancel-link-edit-btn {
  background: var(--primary-light);
  color: var(--text-primary);
}

/* ============================================
   6. QUICK LINKS SECTION
   ============================================ */
.quick-links-section {
  background: var(--bg-secondary);
  padding: var(--sp-5);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  grid-column: span 2;
}

.quick-links-header {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--sp-4);
  color: var(--text-primary);
}

.quick-links-input-area {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-3);
}

.quick-links-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--sp-3);
}

.quick-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3);
  background: white;
  border: 1px solid var(--primary-light);
  border-radius: var(--radius);
  text-decoration: none;
  color: var(--accent);
  font-weight: 500;
  transition: var(--transition);
  cursor: pointer;
}

.quick-link:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--accent);
}

.link-title {
  text-align: center;
  word-break: break-word;
}

/* Edit mode for quick links */
.quick-link.edit-mode {
  flex-direction: row;
  padding: var(--sp-2);
  gap: var(--sp-1);
}

.edit-link-title,
.edit-link-url {
  flex: 1;
  padding: var(--sp-2);
  border: 1px solid var(--accent);
  border-radius: 4px;
  font-size: var(--font-size-sm);
}

/* ============================================
   7. EMPTY STATES
   ============================================ */
.empty-message {
  padding: var(--sp-4);
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  display: none;
}

.empty-message.show {
  display: block;
}

/* ============================================
   8. RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
  
  .todo-list-section,
  .quick-links-section {
    grid-column: span 1;
  }
  
  .quick-links-container {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .todo-item {
    flex-wrap: wrap;
  }
  
  .edit-btn,
  .delete-btn,
  .link-edit-btn,
  .link-delete-btn {
    padding: 4px 8px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  body {
    padding: var(--sp-3);
  }
  
  .greeting-section,
  .focus-timer,
  .todo-list-section,
  .quick-links-section {
    padding: var(--sp-3);
  }
  
  .todo-input-area,
  .quick-links-input-area {
    flex-direction: column;
  }
  
  .timer-controls {
    flex-direction: column;
  }
  
  .quick-links-container {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}

/* ============================================
   9. ACCESSIBILITY
   ============================================ */
button:focus,
input:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

button:disabled {
  cursor: not-allowed;
}

label {
  display: inline-block;
  margin-bottom: var(--sp-1);
}
```

---

## UI Component Breakdown

### Layout Hierarchy

```
┌─ Dashboard Container ──────────────────────────┐
│                                                │
│  ┌─ Row 1 ────────────────────────────────┐  │
│  │  ┌─ Greeting ─┐  ┌─ Timer ──┐         │  │
│  │  │            │  │          │         │  │
│  │  └────────────┘  └──────────┘         │  │
│  └────────────────────────────────────────┘  │
│                                                │
│  ┌─ Row 2 ────────────────────────────────┐  │
│  │  To-Do List (Full Width)               │  │
│  └────────────────────────────────────────┘  │
│                                                │
│  ┌─ Row 3 ────────────────────────────────┐  │
│  │  Quick Links (Full Width)              │  │
│  └────────────────────────────────────────┘  │
│                                                │
└────────────────────────────────────────────────┘
```

### Responsive Breakpoints

- **Desktop (>768px)**: Greeting and Timer side-by-side, To-Do and Links full width
- **Tablet (480-768px)**: Stacked layout, adjusted spacing
- **Mobile (<480px)**: Single column, minimal padding, full-width inputs

---

## State Management Approach

### Principle: Single Source of Truth

All component state stored in `AppState` object. Components read from and update `AppState`.

### State Update Flow

```
User Action (click, keypress)
  ↓
Event Handler Triggered
  ↓
Validation (if needed)
  ↓
Update AppState
  ↓
Update Local Storage
  ↓
Trigger Component Re-render
  ↓
DOM Updated
```

### Example: Add Task

```javascript
function handleAddTodo() {
  const input = document.querySelector('.todo-input');
  const title = input.value.trim();
  
  // Validation
  if (!title) {
    showValidationMessage('Task cannot be empty');
    return;
  }
  
  // Create task
  const task = {
    id: generateUUID(),
    title,
    completed: false,
    createdAt: Date.now()
  };
  
  // Update state
  AppState.tasks.push(task);
  
  // Persist
  StorageManager.saveTodos(AppState.tasks);
  
  // Update UI
  TodoComponent.render();
  
  // Clear input
  input.value = '';
  input.focus();
}
```

### Advantages

- **Predictability**: Component behavior determined solely by state
- **Debuggability**: Inspect `AppState` at any time
- **Testability**: State changes isolated and verifiable
- **Simplicity**: No complex event bus or pub/sub system needed

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

These properties define the behavioral invariants that the To-Do Dashboard must satisfy at all times:

### Property 1: Task Uniqueness

*For any* two tasks in the task list at the same moment, their IDs SHALL be unique and distinct.

**Validates: Requirements 3.3**

**Rationale**: UUIDs are generated at creation time and never modified. The system must guarantee no two tasks share the same ID, as this is the basis for all task operations (edit, delete, toggle).

---

### Property 2: Task Immutability of Metadata

*For any* task that exists in the system, once created, its `id` and `createdAt` timestamp SHALL never change, regardless of subsequent edits or completion status changes.

**Validates: Requirements 3.3, 3.4**

**Rationale**: Task metadata provides the audit trail. Only `title` and `completed` fields should be mutable; `id` and `createdAt` are immutable anchors.

---

### Property 3: Exclusive Task State

*For any* task at any given moment, the task SHALL NOT be simultaneously in two mutually exclusive states: it cannot be both in edit mode AND displayed as a completed/incomplete item in the list.

**Validates: Requirements 4.2, 4.3, 4.4**

**Rationale**: A task is either in edit mode (text input visible, save/cancel buttons active) OR displayed as a list item (checkbox and action buttons visible), but never both.

---

### Property 4: Completion Status Independence

*For any* task, its completion status (completed: true/false) SHALL be independent of all other tasks. Marking one task complete or incomplete SHALL NOT affect any other task's completion status.

**Validates: Requirements 5.2, 5.3, 5.4**

**Rationale**: Task completion is isolated; bulk operations affecting all tasks are not supported, so each task's status is independent.

---

### Property 5: Timer Non-Negative

*For any* moment during timer operation, the timer's remaining seconds value SHALL be >= 0 and SHALL NOT exceed 1500 (25 minutes).

**Validates: Requirements 2.1, 2.2, 2.6**

**Rationale**: The timer displays MM:SS format from 25:00 down to 00:00. It must never display negative values or exceed initial duration.

---

### Property 6: Timer Exclusivity

*For any* moment, the timer SHALL NOT be simultaneously in two exclusive states: it cannot be both running AND paused at the same time.

**Validates: Requirements 2.3, 2.4, 2.5**

**Rationale**: `isRunning` is a boolean flag. At any given moment, the timer either counts down (running=true) or remains static (running=false), never both.

---

### Property 7: Storage Consistency - Tasks

*For any* set of tasks currently displayed in the UI, a query to Local Storage for the same data SHALL return an identical set with all properties (id, title, completed, createdAt) preserved exactly.

**Validates: Requirements 7.1, 7.2, 7.4, 7.5**

**Rationale**: After any task operation (create, edit, delete, toggle), storage must remain consistent with the in-memory state. Round-trip verification: save → load → compare.

---

### Property 8: Storage Consistency - Quick Links

*For any* set of quick links currently displayed in the UI, a query to Local Storage for the same data SHALL return an identical set with all properties (id, title, url) preserved exactly.

**Validates: Requirements 11.1, 11.2, 11.4, 11.5**

**Rationale**: After any link operation (create, edit, delete), storage must remain consistent with the in-memory state.

---

### Property 9: Link Exclusivity

*For any* two links in the quick links list at the same moment, their IDs SHALL be unique and distinct.

**Validates: Requirements 8.4**

**Rationale**: Like tasks, quick links use UUIDs as unique identifiers and must not have collisions.

---

### Property 10: URL Validity Enforcement

*For any* quick link stored in the system, its `url` field SHALL be a valid, parseable URL string that can be instantiated with the `URL()` constructor without throwing an error.

**Validates: Requirements 8.5, 9.6**

**Rationale**: Invalid URLs cannot be stored. The system must reject non-URLs at save time and never persist invalid URLs to storage.

---

### Property 11: Timer Completion Notification

IF the timer reaches 0 seconds, THEN the system SHALL trigger exactly one completion notification (audio, visual, or browser notification) during that session, and SHALL NOT trigger additional notifications until the user manually resets or starts a new session.

**Validates: Requirements 2.7, 2.9**

**Rationale**: When the timer expires, the user must be notified once. Repeated notifications for the same expiration are undesirable.

---

### Property 12: User Name Persistence

*For any* user name entered and saved, subsequent page loads SHALL restore that exact name to the input field, until the user changes it or clears their browser data.

**Validates: Requirements 1.7**

**Rationale**: The greeting section should retain the user's name across sessions via Local Storage.

---

### Property 13: Empty Input Rejection

*For any* input string that consists entirely of whitespace characters (spaces, tabs, newlines), the system SHALL reject it as invalid for both task titles and link titles, and SHALL NOT create or update an item with whitespace-only input.

**Validates: Requirements 3.5, 8.5, 9.6**

**Rationale**: Input validation must catch not only empty strings but also strings that look empty after trimming.

---

### Property 14: State Atomicity

*For any* user-initiated action (add task, delete task, edit link, etc.), the update to Local Storage SHALL occur atomically with the state update, such that if a page refresh occurs immediately after an action, the new state SHALL be recovered from storage.

**Validates: Requirements 7.1, 11.1**

**Rationale**: To prevent data loss, storage writes must be synchronous and coupled to state changes.

---

### Property 15: Display Consistency

*For any* collection of items (tasks or links) loaded from Local Storage, the visual display on the UI SHALL show all items and only those items, with correct completion/edit states rendered accurately.

**Validates: Requirements 3.7, 6.2, 10.2, 12.3**

**Rationale**: The UI is the source of truth for what the user sees. If it's inconsistent with stored data, the user perceives a broken system.

---

## Event Handling Strategy

### Event Delegation

All events handled via event delegation on `document` to minimize listeners:

```javascript
document.addEventListener('click', (e) => {
  const target = e.target;
  
  // Greeting events
  if (target.classList.contains('user-name-input')) {
    handleUserNameChange(target.value);
  }
  
  // Timer events
  if (target.classList.contains('start-btn')) {
    handleStartTimer();
  }
  
  // Todo events
  if (target.classList.contains('add-todo-btn')) {
    handleAddTodo();
  }
  
  // Link events
  if (target.classList.contains('add-link-btn')) {
    handleAddLink();
  }
  
  // ... more handlers
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (document.activeElement.classList.contains('todo-input')) {
      handleAddTodo();
    }
    if (document.activeElement.classList.contains('edit-input')) {
      handleSaveEdit();
    }
  }
  
  if (e.key === 'Escape') {
    if (document.activeElement.classList.contains('edit-input')) {
      handleCancelEdit();
    }
  }
});
```

### Advantages

- **Performance**: Single listener per event type
- **Maintainability**: Central event handler registry
- **Dynamic Content**: Handles dynamically added elements without re-attachment

### Timer Intervals

```javascript
let timeIntervalId = null;
let timerIntervalId = null;

function startTimeUpdates() {
  timeIntervalId = setInterval(() => {
    GreetingComponent.updateTime();
  }, CONFIG.TIME_UPDATE_INTERVAL);
}

function startTimerTick() {
  timerIntervalId = setInterval(() => {
    TimerComponent.decrement();
  }, CONFIG.TIMER_UPDATE_INTERVAL);
}

function stopAllIntervals() {
  clearInterval(timeIntervalId);
  clearInterval(timerIntervalId);
}

// On page unload
window.addEventListener('beforeunload', stopAllIntervals);
```

---

## Error Handling and Recovery

This section details error scenarios, recovery mechanisms, and edge cases to ensure the dashboard remains stable and user-friendly even when things go wrong.

### Classification of Errors

Errors fall into four categories:

1. **Input Validation Errors**: User-supplied data is invalid (empty, malformed)
2. **Storage Errors**: Local Storage operations fail (quota exceeded, access denied)
3. **State Errors**: Application state becomes inconsistent or corrupted
4. **Timer Edge Cases**: Timer logic encounters boundary conditions

---

### Error Category 1: Input Validation Errors

#### 1.1 Empty Task Input

**Scenario**: User clicks "Add" with an empty or whitespace-only task input field.

**Error Detection**:
```javascript
function validateTaskInput(title) {
  const trimmed = title.trim();
  if (!trimmed) {
    return { valid: false, error: 'Task cannot be empty' };
  }
  if (trimmed.length > 500) {
    return { valid: false, error: 'Task too long (max 500 characters)' };
  }
  return { valid: true };
}
```

**Recovery**:
- Display validation message in red near the input field
- Clear message after 3 seconds or when user starts typing
- Do NOT create task
- Keep focus in input field for user to correct and retry

**User Feedback**:
```
❌ Task cannot be empty
```

#### 1.2 Empty Quick Link Title

**Scenario**: User attempts to add a quick link with empty title or whitespace-only title.

**Error Detection**:
```javascript
function validateLinkInput(title, url) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return { valid: false, error: 'Link title cannot be empty' };
  }
  if (trimmedTitle.length > 100) {
    return { valid: false, error: 'Title too long (max 100 characters)' };
  }
  return { valid: true, error: null };
}
```

**Recovery**:
- Display validation message
- Do NOT create link
- Keep edit mode active so user can correct

#### 1.3 Invalid URL Format

**Scenario**: User attempts to save a quick link with an invalid or malformed URL.

**Error Detection**:
```javascript
function isValidURL(url) {
  try {
    new URL(url);  // Constructor throws if invalid
    return true;
  } catch (e) {
    return false;
  }
}

function validateLinkInput(title, url) {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return { valid: false, error: 'Link title cannot be empty' };
  }
  if (!isValidURL(url)) {
    return { valid: false, error: 'Invalid URL format. Example: https://google.com' };
  }
  return { valid: true };
}
```

**Recovery**:
- Display helpful error with example format
- Keep link in edit mode
- Do NOT save invalid URL to storage

**User Feedback**:
```
❌ Invalid URL format. Example: https://google.com
```

#### 1.4 Empty Link URL

**Scenario**: User attempts to save a link with empty URL field.

**Error Detection**: Caught by `isValidURL()` check above.

**Recovery**:
- Display validation message
- Prompt user to enter complete URL including protocol (http:// or https://)

---

### Error Category 2: Storage Errors

#### 2.1 Local Storage Quota Exceeded

**Scenario**: User has added many tasks/links and Local Storage quota is exhausted (~5-10 MB in most browsers).

**Error Detection**:
```javascript
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return { success: true };
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      return { 
        success: false, 
        error: 'Storage quota exceeded',
        details: 'Your browser storage is full. Please delete some tasks or links.'
      };
    } else if (e.name === 'SecurityError') {
      return {
        success: false,
        error: 'Storage access denied',
        details: 'Local Storage is disabled or in private browsing mode.'
      };
    } else {
      return { success: false, error: 'Storage error', details: e.message };
    }
  }
}
```

**Recovery**:
1. Display error alert with clear message
2. Offer suggestions:
   - Delete old/completed tasks
   - Remove unused quick links
   - Clear browser cache if possible
3. Do NOT lose data; the current operation is not applied, but existing data remains
4. Provide a "Disk Cleanup" UI (future enhancement) to help user manage storage

**User Feedback**:
```
⚠️ Storage quota exceeded
Your browser storage is full. 
Please delete some tasks or links to continue.
```

**Code Example**:
```javascript
function handleAddTodo() {
  // ... validation ...
  
  const newTask = { /* ... */ };
  AppState.tasks.push(newTask);
  
  const result = StorageManager.saveTodos(AppState.tasks);
  if (!result.success) {
    // Revert state change
    AppState.tasks.pop();
    
    showError(result.details, '.todo-validation-message');
    return false;
  }
  
  // Success: clear input, etc.
}
```

#### 2.2 Local Storage Access Denied (Private Mode)

**Scenario**: User is in private/incognito browsing mode where Local Storage is disabled or read-only.

**Error Detection**:
```javascript
function isLocalStorageAvailable() {
  const test = '__localStorage_test__';
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
```

**Recovery**:
1. Detect at app startup
2. Display banner: "Private browsing mode detected. Data will not persist after closing this window."
3. Allow app to function with in-memory storage only
4. Show warning when user attempts to add data

**User Feedback**:
```
⚠️ Private Browsing Mode
Data cannot be saved in private browsing mode. 
Your tasks and links will be lost when you close this window.
```

#### 2.3 Corrupted Local Storage Data

**Scenario**: Local Storage contains malformed JSON or data in unexpected format (e.g., manual browser console tampering, or from old app version).

**Error Detection**:
```javascript
function loadTodosFromStorage() {
  try {
    const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.TODOS);
    if (!stored) return [];
    
    const data = JSON.parse(stored);
    
    // Validate structure
    if (!Array.isArray(data.data)) {
      throw new Error('Invalid todo data structure');
    }
    
    // Validate each task has required fields
    data.data.forEach(task => {
      if (!task.id || !task.title) {
        throw new Error('Task missing required fields');
      }
    });
    
    return data.data;
  } catch (e) {
    console.error('Error loading todos:', e);
    return [];  // Return empty array, data is unrecoverable
  }
}
```

**Recovery**:
1. Catch JSON parse errors
2. Validate structure of loaded data
3. If invalid, discard and return empty collection
4. Log error to browser console for debugging
5. Notify user (optional): "Some saved data could not be recovered. Starting fresh."

**Rationale**: Data integrity is critical. Malformed data is silently discarded rather than attempting risky repairs that could corrupt further.

#### 2.4 Browser Data Clear

**Scenario**: User manually clears browser data/cache, which also clears Local Storage.

**Detection**: Not preventable. This is expected behavior.

**Recovery**:
- Next app load finds empty storage
- Display empty task list with helpful message: "No tasks yet. Add one to get started!"
- Display empty quick links with helpful message: "No quick links yet. Add one to get started!"
- This is the designed behavior per Requirement 17.5

**Rationale**: Users have full control over their data. No recovery mechanism is designed—data is intentionally stored locally only.

---

### Error Category 3: State Consistency Errors

#### 3.1 Concurrent Edit Mode Conflict

**Scenario**: User somehow enters edit mode for two tasks/links simultaneously (edge case, shouldn't happen with proper event handling).

**Prevention**:
```javascript
function enterEditMode(itemId, type) {
  // Prevent entering edit mode if already in edit mode for another item
  if (type === 'todo' && AppState.editingTodoId && AppState.editingTodoId !== itemId) {
    cancelEditMode('todo');
  }
  if (type === 'link' && AppState.editingLinkId && AppState.editingLinkId !== itemId) {
    cancelEditMode('link');
  }
  
  AppState.editingTodoId = itemId;
  TodoComponent.render();
}
```

**Recovery**:
- Only one item can be in edit mode at a time
- Entering edit mode for a new item auto-cancels edit mode for previous item
- User sees clean UI with only one item editable

#### 3.2 Deleted Item Still Referencing in Edit Mode

**Scenario**: Item is deleted but `editingTodoId` still references it.

**Prevention**:
```javascript
function deleteTodo(id) {
  AppState.tasks = AppState.tasks.filter(t => t.id !== id);
  
  // Clear edit mode if deleting the currently-edited item
  if (AppState.editingTodoId === id) {
    AppState.editingTodoId = null;
  }
  
  StorageManager.saveTodos(AppState.tasks);
  TodoComponent.render();
}
```

**Recovery**:
- Always check if referenced item still exists before rendering edit mode
- If not found, clear edit mode reference

#### 3.3 State-Storage Mismatch After Crash

**Scenario**: Page crashes after state update but before storage write. User loses that change (unavoidable).

**Mitigation**:
- Use synchronous `localStorage.setItem()` to ensure writes complete
- Keep saves tightly coupled to state changes
- Test with browser DevTools network throttling

---

### Error Category 4: Timer Edge Cases

#### 4.1 Timer Countdown Doesn't Stop at Zero

**Scenario**: Timer logic fails to halt at 00:00 and tries to go negative.

**Prevention**:
```javascript
function decrementTimer() {
  if (!AppState.timer.isRunning) return;
  
  if (AppState.timer.seconds > 0) {
    AppState.timer.seconds--;
  }
  
  // Trigger completion when reaching zero
  if (AppState.timer.seconds === 0 && !AppState.timer.isComplete) {
    AppState.timer.isRunning = false;
    AppState.timer.isComplete = true;
    playNotification();
    updateTimerUI();
  }
}
```

**Recovery**:
- Check boundary condition `seconds === 0` before decrementing further
- Mark timer as complete to prevent further countdown
- Stop interval automatically

#### 4.2 Multiple Timer Intervals Running

**Scenario**: Multiple `setInterval()` calls stack up, causing timer to decrement multiple times per second.

**Prevention**:
```javascript
let timerIntervalId = null;

function startTimer() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);  // Ensure clean start
  }
  
  AppState.timer.isRunning = true;
  timerIntervalId = setInterval(() => {
    decrementTimer();
  }, CONFIG.TIMER_UPDATE_INTERVAL);
}

function stopTimer() {
  AppState.timer.isRunning = false;
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

// On page unload, clean up intervals
window.addEventListener('beforeunload', () => {
  stopTimer();
  clearInterval(timeIntervalId);
});
```

**Recovery**:
- Always clear existing interval before starting new one
- Clean up all intervals on page unload
- Store interval IDs to enable cleanup

#### 4.3 Timer Continues After Page Unload

**Scenario**: Browser unloads page while timer is running. Timer state is lost.

**Behavior**: Expected. Timer does not persist across page reloads.

**Rationale**: Timer is session-only; it resets to 25:00 on every page load per Requirement 2.1.

#### 4.4 Timer Display Format Incorrect

**Scenario**: Timer shows "25:60" or "-5:00" due to formatting bug.

**Prevention**:
```javascript
function formatTimerDisplay(seconds) {
  // Ensure non-negative
  const safe = Math.max(0, Math.min(seconds, 1500));
  
  const minutes = Math.floor(safe / 60);
  const secs = safe % 60;
  
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
```

**Recovery**:
- Use strict bounds: clamp to [0, 1500]
- Use `padStart()` for consistent formatting
- Test formatting function with edge values (0, 1, 59, 60, 1499, 1500)

---

### Error Handling UI Patterns

#### Validation Message Display

```html
<div class="todo-validation-message"></div>

<style>
.validation-message {
  color: var(--error);
  font-size: var(--font-size-sm);
  margin-bottom: var(--sp-2);
  padding: var(--sp-2);
  background: #fee;
  border-left: 3px solid var(--error);
  display: none;
  animation: slideIn 0.3s ease;
}

.validation-message.show {
  display: block;
}
</style>
```

#### Error Recovery Function

```javascript
function showError(message, containerSelector, duration = 3000) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  const msgEl = container.querySelector('.validation-message') 
    || document.createElement('div');
  msgEl.classList.add('validation-message', 'show');
  msgEl.textContent = message;
  
  if (!container.contains(msgEl)) {
    container.insertBefore(msgEl, container.firstChild);
  }
  
  // Auto-clear after duration
  const timeoutId = setTimeout(() => {
    msgEl.classList.remove('show');
  }, duration);
  
  // Clear on next user action in this input
  const input = container.querySelector('input');
  if (input) {
    input.addEventListener('input', () => {
      clearTimeout(timeoutId);
      msgEl.classList.remove('show');
    }, { once: true });
  }
}
```

#### Storage Error Alert

```javascript
function showStorageError(error) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'storage-error-alert';
  alertDiv.innerHTML = `
    <div class="alert-header">⚠️ Storage Error</div>
    <div class="alert-message">${escapeHtml(error.details)}</div>
    <button class="alert-close">Dismiss</button>
  `;
  
  document.body.insertBefore(alertDiv, document.body.firstChild);
  
  alertDiv.querySelector('.alert-close').addEventListener('click', () => {
    alertDiv.remove();
  });
  
  // Auto-dismiss after 8 seconds
  setTimeout(() => alertDiv.remove(), 8000);
}
```

---

### Logging and Debugging

All errors logged to browser console for developer debugging:

```javascript
function logError(context, error, details) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ${context}:`, error, details);
  
  // Optionally send to monitoring service (future)
  // trackError({ context, error, details, timestamp });
}
```

**Example calls**:
```javascript
try {
  StorageManager.saveTodos(AppState.tasks);
} catch (e) {
  logError('saveTodos', e, { taskCount: AppState.tasks.length });
  showError('Failed to save tasks. Please try again.', '.todo-validation-message');
}
```

---

## Input Validation

```javascript
// Task validation
function validateTaskInput(title) {
  if (!title || !title.trim()) {
    return { valid: false, error: 'Task cannot be empty' };
  }
  if (title.length > 500) {
    return { valid: false, error: 'Task too long (max 500 characters)' };
  }
  return { valid: true };
}

// Link validation
function validateLinkInput(title, url) {
  if (!title || !title.trim()) {
    return { valid: false, error: 'Link title cannot be empty' };
  }
  if (!url || !isValidURL(url)) {
    return { valid: false, error: 'Invalid URL format' };
  }
  return { valid: true };
}

// Display validation messages
function showValidationMessage(message, container) {
  const msgEl = container.querySelector('.validation-message');
  msgEl.textContent = message;
  msgEl.classList.add('show');
  setTimeout(() => msgEl.classList.remove('show'), 3000);
}
```

### Storage Error Handling

```javascript
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      showError('Storage quota exceeded. Please delete some items.');
    } else {
      showError('Failed to save data. Please try again.');
    }
    return false;
  }
}

function loadFromStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
    return defaultValue;
  }
}
```

---

## Testing Strategy

This feature is primarily suited for **example-based unit tests and integration tests** rather than property-based testing, due to the following characteristics:

1. **UI rendering and layout** - Visual components best tested with example-based tests or snapshot tests
2. **DOM manipulation** - Easier to verify with concrete examples than universal properties
3. **Local Storage integration** - External dependency best tested with mocks or integration tests
4. **Pomodoro timer** - Time-dependent functionality suited to example tests with time mocking
5. **Simple CRUD operations** - Straightforward enough for unit tests without PBT

### Unit Testing Approach

**Framework**: Jest or Vitest (for mocking and assertions)

**Test Categories**:

1. **State Management Tests**
   - Adding/editing/deleting tasks
   - Adding/editing/deleting links
   - Updating timer state
   - Saving/loading user name

2. **Validation Tests**
   - Empty task input rejection
   - Invalid URL detection
   - Special character handling

3. **Storage Tests**
   - Saving tasks to localStorage
   - Loading tasks from localStorage
   - Handling quota exceeded errors
   - Handling corrupted data recovery

4. **Component Rendering Tests**
   - Task list renders correctly
   - Links display properly
   - Empty states show/hide appropriately
   - Timer display format correct (MM:SS)

5. **User Interaction Tests**
   - Task completion toggle
   - Edit mode activation/deactivation
   - Timer start/stop/reset
   - Link navigation behavior

### Example Unit Tests

```javascript
describe('Task Management', () => {
  test('Adding a task with valid input creates new task', () => {
    const initialCount = AppState.tasks.length;
    TodoComponent.add('Buy groceries');
    expect(AppState.tasks.length).toBe(initialCount + 1);
    expect(AppState.tasks[AppState.tasks.length - 1].title).toBe('Buy groceries');
    expect(AppState.tasks[AppState.tasks.length - 1].completed).toBe(false);
  });
  
  test('Adding empty task is rejected', () => {
    const result = validateTaskInput('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });
  
  test('Whitespace-only task is rejected', () => {
    const result = validateTaskInput('   ');
    expect(result.valid).toBe(false);
  });
  
  test('Task deletion removes from state and storage', () => {
    const taskId = AppState.tasks[0].id;
    TodoComponent.delete(taskId);
    expect(AppState.tasks.find(t => t.id === taskId)).toBeUndefined();
  });
});

describe('Link Validation', () => {
  test('Valid URL passes validation', () => {
    const result = validateLinkInput('Google', 'https://google.com');
    expect(result.valid).toBe(true);
  });
  
  test('Invalid URL fails validation', () => {
    const result = validateLinkInput('Bad', 'not a url');
    expect(result.valid).toBe(false);
  });
  
  test('Empty title fails validation', () => {
    const result = validateLinkInput('', 'https://google.com');
    expect(result.valid).toBe(false);
  });
});

describe('Local Storage', () => {
  test('Tasks save to localStorage correctly', () => {
    const tasks = [
      { id: '1', title: 'Task 1', completed: false, createdAt: Date.now() }
    ];
    StorageManager.saveTodos(tasks);
    const loaded = StorageManager.loadTodos();
    expect(loaded).toEqual(tasks);
  });
  
  test('Gracefully handles corrupted localStorage data', () => {
    localStorage.setItem('todos', 'invalid json');
    const loaded = StorageManager.loadTodos();
    expect(loaded).toEqual([]);
  });
});

describe('Timer Functionality', () => {
  test('Timer starts countdown from 25:00', () => {
    TimerComponent.reset();
    TimerComponent.start();
    expect(AppState.timer.isRunning).toBe(true);
    expect(AppState.timer.seconds).toBe(1500);
  });
  
  test('Stop pauses timer without resetting', () => {
    AppState.timer.seconds = 600;
    TimerComponent.start();
    TimerComponent.stop();
    expect(AppState.timer.isRunning).toBe(false);
    expect(AppState.timer.seconds).toBe(600);
  });
  
  test('Reset returns to 25:00', () => {
    AppState.timer.seconds = 100;
    TimerComponent.reset();
    expect(AppState.timer.seconds).toBe(1500);
    expect(AppState.timer.isRunning).toBe(false);
  });
});
```

### Integration Testing

Test full user flows:
- Create task → mark complete → delete
- Add link → edit link → navigate
- Load app → retrieve saved data from localStorage
- Timer countdown to completion with notification

---

## Performance Considerations

### Optimization Strategies

1. **Event Delegation**: Minimize DOM listeners
2. **Efficient DOM Updates**: Use element IDs for direct access vs. querySelectorAll
3. **CSS Animation Performance**: Use `transform` and `opacity` over `width`/`height`
4. **Debouncing**: User name input saves debounced to avoid excessive storage writes
5. **Lazy Rendering**: Only render visible/modified components

### Performance Targets

- Initial load: < 2 seconds (Req. 14.1)
- UI interaction response: < 100ms (Req. 14.2)
- Timer update: Smooth 1/second without stuttering

### Measurement Strategy

```javascript
// Performance marks
performance.mark('app-init-start');
// ... initialization code
performance.mark('app-init-end');
performance.measure('app-init', 'app-init-start', 'app-init-end');
console.log(performance.getEntriesByName('app-init')[0].duration);
```

---

## Browser Compatibility

### Target Browsers

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### Key Compatibility Considerations

1. **LocalStorage API**: Widely supported, fallback to in-memory store if unavailable
2. **fetch/URL constructor**: All modern browsers
3. **ES6 features**: Arrow functions, template literals, const/let
4. **CSS Grid/Flexbox**: Fully supported in target browsers
5. **Optional: Web Notifications API**: Graceful degradation if unavailable

### Polyfill Strategy

Minimal: Focus on vanilla JavaScript without external polyfills. Use feature detection:

```javascript
if ('Notification' in window) {
  // Use Notification API
} else {
  // Fallback to visual/audio alert
}

if (typeof localStorage === 'undefined') {
  // Implement in-memory storage fallback
}
```

---

## Accessibility

### WCAG 2.1 Compliance (Level AA)

1. **Keyboard Navigation**: All controls accessible via Tab, Enter, Escape
2. **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI components
3. **Focus Indicators**: Clear outline on focused elements
4. **Semantic HTML**: Proper use of `<button>`, `<input>`, `<label>`
5. **ARIA Labels**: Where needed for screen readers

### Implementation

```html
<!-- Semantic buttons -->
<button class="add-todo-btn" aria-label="Add new task">Add</button>

<!-- Labeled inputs -->
<label for="user-name">Your name (optional)</label>
<input id="user-name" type="text" class="user-name-input">

<!-- Accessible timer -->
<div class="timer-display" role="timer" aria-label="Pomodoro timer" aria-live="polite">
  25:00
</div>

<!-- Descriptive link -->
<a href="https://example.com" title="Opens in new tab">Example</a>
```

---

## Security Considerations

### Client-Side Security

1. **URL Validation**: Validate quick links to prevent XSS
2. **Input Sanitization**: Escape user input when rendering (though vanilla JS helps here)
3. **Content Security Policy**: Recommend CSP header: `default-src 'self' 'unsafe-inline'`
4. **HTTPS**: Recommend HTTPS only for deployment

### Data Privacy

- No data leaves the browser (all localStorage)
- No analytics or tracking (unless user opts-in)
- User has full control: clear browser data = delete all dashboard data

---

## Future Enhancements

1. **Export/Import**: Allow users to export tasks as JSON
2. **Task Categories**: Organize tasks by category
3. **Task Priorities**: Add priority levels (low/medium/high)
4. **Recurring Tasks**: Support daily/weekly recurring tasks
5. **Dark Mode**: Toggle dark theme
6. **Search**: Search tasks by title
7. **Cloud Sync**: Optional Firebase/Supabase sync (add backend)
8. **Mobile App**: PWA wrapper or mobile app wrapper

---

## Summary

This design provides a clean, maintainable, single-file architecture for the To-Do Dashboard. The separation of concerns via logical sections in one JavaScript file and one CSS file keeps the codebase simple and performant while maintaining scalability for future enhancements. The focus on vanilla JavaScript ensures broad compatibility and zero external dependencies (except optional icons/fonts).

Key design decisions prioritize **simplicity**, **performance**, and **user experience** over unnecessary abstraction.
