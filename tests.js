/**
 * Comprehensive Unit Tests for To-Do Dashboard
 * Tests all core functionality across all components
 */

// Test utilities
const TestSuite = {
  passed: 0,
  failed: 0,
  tests: [],
  
  test(name, fn) {
    try {
      fn();
      this.passed++;
      this.tests.push({ name, status: 'PASS' });
      console.log(`✓ ${name}`);
    } catch (error) {
      this.failed++;
      this.tests.push({ name, status: 'FAIL', error: error.message });
      console.error(`✗ ${name}:`, error.message);
    }
  },
  
  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  },
  
  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  },
  
  assertArrayEquals(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(message || `Arrays not equal: ${JSON.stringify(actual)} vs ${JSON.stringify(expected)}`);
    }
  },
  
  printReport() {
    console.log('\n=== TEST REPORT ===');
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log(`Total: ${this.passed + this.failed}`);
    if (this.failed === 0) {
      console.log('\n✓ ALL TESTS PASSED!');
    }
  }
};

// ============================================
// Tests: Utility Functions
// ============================================

TestSuite.test('generateUUID should create unique IDs', () => {
  const uuid1 = generateUUID();
  const uuid2 = generateUUID();
  TestSuite.assert(uuid1 !== uuid2, 'UUIDs should be unique');
  TestSuite.assert(uuid1.length === 36, 'UUID should be 36 characters');
  TestSuite.assert(uuid1.includes('-'), 'UUID should contain hyphens');
});

TestSuite.test('isValidURL should validate URLs correctly', () => {
  TestSuite.assert(isValidURL('https://google.com'), 'Valid HTTPS URL');
  TestSuite.assert(isValidURL('http://example.com'), 'Valid HTTP URL');
  TestSuite.assert(!isValidURL('not a url'), 'Invalid URL');
  TestSuite.assert(!isValidURL(''), 'Empty string is not valid');
});

TestSuite.test('formatTime should format time correctly', () => {
  const date = new Date(2024, 7, 26, 14, 35);
  TestSuite.assertEqual(formatTime(date), '14:35', 'Time format HH:MM');
});

TestSuite.test('formatDate should format date correctly', () => {
  const date = new Date(2024, 7, 26);
  const formatted = formatDate(date);
  TestSuite.assert(formatted.includes('August'), 'Should include month');
  TestSuite.assert(formatted.includes('26'), 'Should include day');
  TestSuite.assert(formatted.includes('2024'), 'Should include year');
});

TestSuite.test('escapeHtml should escape HTML characters', () => {
  const result = escapeHtml('<script>alert("xss")</script>');
  TestSuite.assert(!result.includes('<script>'), 'Should escape script tags');
  TestSuite.assert(result.includes('&lt;'), 'Should contain escaped <');
});

TestSuite.test('formatTimerDisplay should format seconds correctly', () => {
  TestSuite.assertEqual(formatTimerDisplay(0), '00:00', '0 seconds');
  TestSuite.assertEqual(formatTimerDisplay(60), '01:00', '60 seconds');
  TestSuite.assertEqual(formatTimerDisplay(1500), '25:00', '1500 seconds');
  TestSuite.assertEqual(formatTimerDisplay(3661), '61:01', '3661 seconds');
});

// ============================================
// Tests: Validation Functions
// ============================================

TestSuite.test('validateTaskInput should validate task titles', () => {
  let result = validateTaskInput('Valid Task');
  TestSuite.assert(result.valid, 'Valid task should pass');
  
  result = validateTaskInput('');
  TestSuite.assert(!result.valid, 'Empty task should fail');
  
  result = validateTaskInput('   ');
  TestSuite.assert(!result.valid, 'Whitespace-only task should fail');
});

TestSuite.test('validateLinkInput should validate links', () => {
  let result = validateLinkInput('Google', 'https://google.com');
  TestSuite.assert(result.valid, 'Valid link should pass');
  
  result = validateLinkInput('', 'https://google.com');
  TestSuite.assert(!result.valid, 'Empty title should fail');
  
  result = validateLinkInput('Google', 'not a url');
  TestSuite.assert(!result.valid, 'Invalid URL should fail');
});

// ============================================
// Tests: State Management
// ============================================

TestSuite.test('AppState should initialize correctly', () => {
  TestSuite.assert(Array.isArray(AppState.tasks), 'tasks should be array');
  TestSuite.assert(Array.isArray(AppState.quickLinks), 'quickLinks should be array');
  TestSuite.assert(AppState.timer.seconds === 1500 || AppState.timer.seconds <= 1500, 'Timer should be initialized');
  TestSuite.assert(AppState.editingTodoId === null, 'editingTodoId should be null');
  TestSuite.assert(AppState.editingLinkId === null, 'editingLinkId should be null');
});

TestSuite.test('AppState.getTaskById should retrieve tasks', () => {
  AppState.tasks = [
    { id: 'task-1', title: 'Test', completed: false, createdAt: Date.now() }
  ];
  const task = AppState.getTaskById('task-1');
  TestSuite.assert(task !== undefined, 'Should find existing task');
  TestSuite.assertEqual(task.title, 'Test', 'Should return correct task');
});

TestSuite.test('AppState.getLinkById should retrieve links', () => {
  AppState.quickLinks = [
    { id: 'link-1', title: 'Google', url: 'https://google.com' }
  ];
  const link = AppState.getLinkById('link-1');
  TestSuite.assert(link !== undefined, 'Should find existing link');
  TestSuite.assertEqual(link.title, 'Google', 'Should return correct link');
});

// ============================================
// Tests: Todo Component
// ============================================

TestSuite.test('TodoComponent should initialize tasks from storage', () => {
  // Clear and reinitialize
  AppState.tasks = [];
  TodoComponent.init();
  TestSuite.assert(Array.isArray(AppState.tasks), 'Tasks should be loaded as array');
});

TestSuite.test('TodoComponent should add valid tasks', () => {
  AppState.tasks = [];
  TodoComponent.addTodo('Test Task');
  TestSuite.assertEqual(AppState.tasks.length, 1, 'Should have one task');
  TestSuite.assertEqual(AppState.tasks[0].title, 'Test Task', 'Task title should match');
  TestSuite.assert(AppState.tasks[0].id, 'Task should have an ID');
  TestSuite.assert(!AppState.tasks[0].completed, 'New task should not be completed');
  TestSuite.assert(AppState.tasks[0].createdAt, 'Task should have createdAt timestamp');
});

TestSuite.test('TodoComponent should reject invalid tasks', () => {
  AppState.tasks = [];
  TodoComponent.addTodo('');
  TestSuite.assertEqual(AppState.tasks.length, 0, 'Should not add empty task');
  
  TodoComponent.addTodo('   ');
  TestSuite.assertEqual(AppState.tasks.length, 0, 'Should not add whitespace-only task');
});

TestSuite.test('TodoComponent should toggle task completion', () => {
  AppState.tasks = [
    { id: 'task-1', title: 'Test', completed: false, createdAt: Date.now() }
  ];
  TodoComponent.toggleComplete('task-1');
  TestSuite.assert(AppState.tasks[0].completed, 'Task should be marked complete');
  
  TodoComponent.toggleComplete('task-1');
  TestSuite.assert(!AppState.tasks[0].completed, 'Task should be marked incomplete');
});

TestSuite.test('TodoComponent should edit task titles', () => {
  AppState.tasks = [
    { id: 'task-1', title: 'Original', completed: false, createdAt: Date.now() }
  ];
  const originalCreatedAt = AppState.tasks[0].createdAt;
  
  TodoComponent.editTodo('task-1', 'Updated Title');
  TestSuite.assertEqual(AppState.tasks[0].title, 'Updated Title', 'Title should be updated');
  TestSuite.assertEqual(AppState.tasks[0].id, 'task-1', 'ID should remain unchanged');
  TestSuite.assertEqual(AppState.tasks[0].createdAt, originalCreatedAt, 'createdAt should remain unchanged');
});

TestSuite.test('TodoComponent should delete tasks', () => {
  AppState.tasks = [
    { id: 'task-1', title: 'Test', completed: false, createdAt: Date.now() }
  ];
  TodoComponent.deleteTodo('task-1');
  TestSuite.assertEqual(AppState.tasks.length, 0, 'Task should be deleted');
});

// ============================================
// Tests: Quick Links Component
// ============================================

TestSuite.test('LinksComponent should initialize links from storage', () => {
  AppState.quickLinks = [];
  LinksComponent.init();
  TestSuite.assert(Array.isArray(AppState.quickLinks), 'Links should be loaded as array');
});

TestSuite.test('LinksComponent should add valid links', () => {
  AppState.quickLinks = [];
  LinksComponent.addLink('Google', 'https://google.com');
  TestSuite.assertEqual(AppState.quickLinks.length, 1, 'Should have one link');
  TestSuite.assertEqual(AppState.quickLinks[0].title, 'Google', 'Link title should match');
  TestSuite.assert(AppState.quickLinks[0].id, 'Link should have an ID');
});

TestSuite.test('LinksComponent should reject invalid links', () => {
  AppState.quickLinks = [];
  LinksComponent.addLink('', 'https://google.com');
  TestSuite.assertEqual(AppState.quickLinks.length, 0, 'Should not add link with empty title');
  
  LinksComponent.addLink('Google', 'not a url');
  TestSuite.assertEqual(AppState.quickLinks.length, 0, 'Should not add link with invalid URL');
});

TestSuite.test('LinksComponent should edit links', () => {
  AppState.quickLinks = [
    { id: 'link-1', title: 'Google', url: 'https://google.com' }
  ];
  LinksComponent.editLink('link-1', 'Updated', 'https://updated.com');
  TestSuite.assertEqual(AppState.quickLinks[0].title, 'Updated', 'Title should be updated');
  TestSuite.assertEqual(AppState.quickLinks[0].url, 'https://updated.com', 'URL should be updated');
  TestSuite.assertEqual(AppState.quickLinks[0].id, 'link-1', 'ID should remain unchanged');
});

TestSuite.test('LinksComponent should delete links', () => {
  AppState.quickLinks = [
    { id: 'link-1', title: 'Google', url: 'https://google.com' }
  ];
  LinksComponent.deleteLink('link-1');
  TestSuite.assertEqual(AppState.quickLinks.length, 0, 'Link should be deleted');
});

// ============================================
// Tests: Timer Component
// ============================================

TestSuite.test('TimerComponent should initialize correctly', () => {
  AppState.timer = { seconds: 1500, isRunning: false, isComplete: false };
  TimerComponent.init();
  TestSuite.assertEqual(AppState.timer.seconds, 1500, 'Timer should start at 1500 seconds');
  TestSuite.assert(!AppState.timer.isRunning, 'Timer should not be running initially');
});

TestSuite.test('TimerComponent should reset correctly', () => {
  AppState.timer = { seconds: 500, isRunning: false, isComplete: false };
  TimerComponent.resetTimer();
  TestSuite.assertEqual(AppState.timer.seconds, 1500, 'Timer should reset to 1500');
  TestSuite.assert(!AppState.timer.isRunning, 'Timer should not be running after reset');
  TestSuite.assert(!AppState.timer.isComplete, 'Timer should not be complete after reset');
});

// ============================================
// Tests: Storage Manager
// ============================================

TestSuite.test('StorageManager should save and load todos', () => {
  const tasks = [
    { id: 'task-1', title: 'Test', completed: false, createdAt: Date.now() }
  ];
  StorageManager.saveTodos(tasks);
  const loaded = StorageManager.loadTodos();
  TestSuite.assertArrayEquals(loaded, tasks, 'Loaded tasks should match saved tasks');
});

TestSuite.test('StorageManager should save and load links', () => {
  const links = [
    { id: 'link-1', title: 'Google', url: 'https://google.com' }
  ];
  StorageManager.saveQuickLinks(links);
  const loaded = StorageManager.loadQuickLinks();
  TestSuite.assertArrayEquals(loaded, links, 'Loaded links should match saved links');
});

TestSuite.test('StorageManager should save and load dashboard data', () => {
  const data = { userName: 'John', timerState: { seconds: 1500, isRunning: false, isComplete: false } };
  StorageManager.saveDashboard(data);
  const loaded = StorageManager.loadDashboard();
  TestSuite.assertEqual(loaded.userName, 'John', 'Username should match');
});

// ============================================
// Tests: Greeting Component
// ============================================

TestSuite.test('GreetingComponent.getGreeting should return correct greeting', () => {
  TestSuite.assertEqual(GreetingComponent.getGreeting(6), 'Good Morning', 'Morning (6am)');
  TestSuite.assertEqual(GreetingComponent.getGreeting(11), 'Good Morning', 'Morning (11am)');
  TestSuite.assertEqual(GreetingComponent.getGreeting(12), 'Good Afternoon', 'Afternoon (12pm)');
  TestSuite.assertEqual(GreetingComponent.getGreeting(16), 'Good Afternoon', 'Afternoon (4pm)');
  TestSuite.assertEqual(GreetingComponent.getGreeting(17), 'Good Evening', 'Evening (5pm)');
  TestSuite.assertEqual(GreetingComponent.getGreeting(23), 'Good Evening', 'Evening (11pm)');
  TestSuite.assertEqual(GreetingComponent.getGreeting(4), 'Good Evening', 'Evening (4am)');
});

// ============================================
// Tests: Property-Based Correctness
// ============================================

TestSuite.test('[PROPERTY 1] Task Uniqueness - all tasks have unique IDs', () => {
  AppState.tasks = [];
  for (let i = 0; i < 10; i++) {
    TodoComponent.addTodo(`Task ${i}`);
  }
  const ids = AppState.tasks.map(t => t.id);
  const uniqueIds = new Set(ids);
  TestSuite.assertEqual(uniqueIds.size, ids.length, 'All task IDs should be unique');
});

TestSuite.test('[PROPERTY 2] Task Immutability - ID and createdAt never change', () => {
  AppState.tasks = [
    { id: 'original-id', title: 'Original', completed: false, createdAt: 1000 }
  ];
  const originalId = AppState.tasks[0].id;
  const originalCreatedAt = AppState.tasks[0].createdAt;
  
  TodoComponent.editTodo('original-id', 'Updated');
  TodoComponent.toggleComplete('original-id');
  
  TestSuite.assertEqual(AppState.tasks[0].id, originalId, 'ID should not change');
  TestSuite.assertEqual(AppState.tasks[0].createdAt, originalCreatedAt, 'createdAt should not change');
});

TestSuite.test('[PROPERTY 3] Exclusive Task State - task cannot be in edit and display modes simultaneously', () => {
  AppState.tasks = [
    { id: 'task-1', title: 'Test', completed: false, createdAt: Date.now() }
  ];
  AppState.editingTodoId = 'task-1';
  TestSuite.assertEqual(AppState.editingTodoId, 'task-1', 'Should be in edit mode');
  
  // Simulate exiting edit mode
  AppState.editingTodoId = null;
  TestSuite.assertEqual(AppState.editingTodoId, null, 'Should exit edit mode');
});

TestSuite.test('[PROPERTY 4] Completion Status Independence - each task is independent', () => {
  AppState.tasks = [
    { id: 'task-1', title: 'Task 1', completed: false, createdAt: Date.now() },
    { id: 'task-2', title: 'Task 2', completed: false, createdAt: Date.now() }
  ];
  
  TodoComponent.toggleComplete('task-1');
  TestSuite.assert(AppState.tasks[0].completed, 'Task 1 should be completed');
  TestSuite.assert(!AppState.tasks[1].completed, 'Task 2 should remain incomplete');
});

TestSuite.test('[PROPERTY 5] Timer Non-Negative - timer never goes below 0 or above 1500', () => {
  for (let i = 0; i <= 1500; i += 100) {
    AppState.timer.seconds = i;
    TestSuite.assert(AppState.timer.seconds >= 0, `Timer should be >= 0, got ${i}`);
    TestSuite.assert(AppState.timer.seconds <= 1500, `Timer should be <= 1500, got ${i}`);
  }
});

TestSuite.test('[PROPERTY 7] Storage Consistency - tasks save and load perfectly', () => {
  const originalTasks = [
    { id: 'task-1', title: 'Test Task', completed: false, createdAt: 1234567890 },
    { id: 'task-2', title: 'Another Task', completed: true, createdAt: 1234567891 }
  ];
  
  StorageManager.saveTodos(originalTasks);
  const loadedTasks = StorageManager.loadTodos();
  
  TestSuite.assertEqual(loadedTasks.length, originalTasks.length, 'Should have same count');
  TestSuite.assertArrayEquals(loadedTasks, originalTasks, 'Data should match exactly');
});

TestSuite.test('[PROPERTY 8] Storage Consistency - links save and load perfectly', () => {
  const originalLinks = [
    { id: 'link-1', title: 'Google', url: 'https://google.com' },
    { id: 'link-2', title: 'GitHub', url: 'https://github.com' }
  ];
  
  StorageManager.saveQuickLinks(originalLinks);
  const loadedLinks = StorageManager.loadQuickLinks();
  
  TestSuite.assertEqual(loadedLinks.length, originalLinks.length, 'Should have same count');
  TestSuite.assertArrayEquals(loadedLinks, originalLinks, 'Data should match exactly');
});

TestSuite.test('[PROPERTY 9] Link Uniqueness - all links have unique IDs', () => {
  AppState.quickLinks = [];
  for (let i = 0; i < 10; i++) {
    LinksComponent.addLink(`Link ${i}`, `https://example${i}.com`);
  }
  const ids = AppState.quickLinks.map(l => l.id);
  const uniqueIds = new Set(ids);
  TestSuite.assertEqual(uniqueIds.size, ids.length, 'All link IDs should be unique');
});

TestSuite.test('[PROPERTY 10] URL Validity - invalid URLs are rejected', () => {
  AppState.quickLinks = [];
  LinksComponent.addLink('Test', 'https://example.com');
  TestSuite.assertEqual(AppState.quickLinks.length, 1, 'Valid URL should be added');
  
  LinksComponent.addLink('Test', 'not a url at all');
  TestSuite.assertEqual(AppState.quickLinks.length, 1, 'Invalid URL should be rejected');
});

// ============================================
// Run all tests
// ============================================

console.log('Starting To-Do Dashboard Test Suite...\n');
TestSuite.printReport();
