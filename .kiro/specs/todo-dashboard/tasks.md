# Implementation Plan: To-Do List Dashboard

## Overview

This implementation plan breaks down the vanilla JavaScript dashboard into discrete, executable tasks. Each task builds incrementally on previous steps, starting with project structure and HTML markup, followed by CSS styling, JavaScript functionality, and comprehensive testing. All work is done in single HTML, CSS, and JavaScript files to maintain simplicity and performance.

---

## Phase 1: Project Setup and Markup

- [x] 1. Set up project structure and create core files
  - Create `index.html` file with semantic HTML5 structure and boilerplate
  - Create `css/styles.css` file with initial CSS reset and variables
  - Create `js/app.js` file with initial configuration and comments marking logical sections
  - _Requirements: 15.1, 15.2, 15.3_

- [x] 2. Create HTML markup for greeting section
  - Add greeting section container with classes `greeting-section`
  - Add `greeting-text` div for time-based greeting display
  - Add `time-display` div for current time (format: HH:MM)
  - Add `date-display` div for current date (format: Day, Month Date, Year)
  - Add `user-name-input` input field with placeholder "Enter your name"
  - _Requirements: 1.1, 1.2, 1.7_

- [x] 3. Create HTML markup for focus timer section
  - Add focus timer container with class `focus-timer`
  - Add `timer-display` div to show MM:SS format (initially "25:00")
  - Add `timer-controls` div with buttons: Start, Stop, Reset (with classes `start-btn`, `stop-btn`, `reset-btn`)
  - Add `timer-status` div to show timer state ("Ready", "Running", "Complete")
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 4. Create HTML markup for to-do list section
  - Add `todo-list-section` container
  - Add `todo-input-area` with input field (class `todo-input`) and "Add" button (class `add-todo-btn`)
  - Add `todo-validation-message` div for error/validation messages
  - Add `todo-list` ul element to hold task items
  - Add `empty-message` div for empty state ("No tasks yet. Add one to get started!")
  - Create example `todo-item` structure with checkbox, title span, Edit and Delete buttons
  - _Requirements: 3.1, 4.1, 6.1_

- [x] 5. Create HTML markup for quick links section
  - Add `quick-links-section` container
  - Add `quick-links-header` with text "Quick Links"
  - Add `quick-links-input-area` with title input, URL input, and "Add" button
  - Add `link-validation-message` div for error/validation messages
  - Add `quick-links-container` div (grid layout) to hold link items
  - Add `empty-message` div for empty state ("No quick links yet. Add one to get started!")
  - Create example `quick-link` structure with title span, Edit and Delete buttons
  - _Requirements: 8.1, 8.2, 9.1_

- [x] 6. Create responsive dashboard grid layout
  - Create main `dashboard` container div
  - Organize sections: greeting and timer in row 1 (side-by-side on desktop), to-do list in row 2, quick links in row 3
  - Add viewport meta tag for responsive design
  - Link CSS and JavaScript files in HTML
  - _Requirements: 13.1, 13.4, 16.1_

---

## Phase 2: CSS Styling and Responsive Design

- [x] 7. Set up CSS variables and global styles
  - Define CSS custom properties (--primary, --accent, --success, --error, etc.)
  - Define spacing scale (--sp-1 through --sp-6)
  - Define typography scale (--font-size-xs through --font-size-2xl)
  - Set up base styles for body, buttons, inputs
  - Add CSS reset for margin and padding
  - _Requirements: 13.2, 13.3_

- [x] 8. Style greeting section
  - Add background gradient (indigo or accent color)
  - Style greeting text (large, bold, white)
  - Style time display (monospace font, large)
  - Style date display (small, light opacity)
  - Style user name input (full width, light background)
  - Add hover and focus states for input
  - _Requirements: 13.2, 13.3_

- [x] 9. Style focus timer section
  - Add light background and shadow
  - Style timer display (large, monospace, centered)
  - Style timer controls (flex row, center-aligned buttons)
  - Style timer buttons (colored, hover states, disabled states)
  - Style timer status text (secondary color)
  - Add color change when timer is complete (green)
  - _Requirements: 13.2, 13.3, 14.5_

- [x] 10. Style to-do list section
  - Add light background and shadow
  - Style input area (flex row with input and button)
  - Style validation message (red error color, hidden by default)
  - Style todo list (remove list styling, no bullets)
  - Style todo item (flex row, hover effect, border-bottom)
  - Style todo checkbox (with accent color)
  - Style todo title (flex-grow, word-break)
  - Style edit/delete buttons (small, hover effects)
  - Style strikethrough for completed tasks
  - _Requirements: 5.3, 6.2, 13.2, 13.3_

- [x] 11. Style quick links section
  - Add light background and shadow
  - Style input area (flex row)
  - Style validation message (red error, hidden by default)
  - Style quick links container (CSS grid, auto-fill with min-width 150px)
  - Style quick link items (centered, border, hover shadow effect)
  - Style link title (word-break, centered)
  - Style edit/delete buttons (small, positioned)
  - _Requirements: 13.2, 13.3_

- [x] 12. Style edit mode for tasks and links
  - Create edit-mode class styling
  - Style edit input fields (border highlight with accent color)
  - Style Save/Cancel buttons (green for save, gray for cancel)
  - Style todo-item.edit-mode layout (flex, gap between inputs and buttons)
  - Style quick-link.edit-mode layout (flex row)
  - _Requirements: 4.2, 9.2_

- [x] 13. Implement responsive design breakpoints
  - Desktop (>768px): Greeting and Timer side-by-side, full-width todo list and links
  - Tablet (480-768px): Stacked layout, adjusted spacing
  - Mobile (<480px): Single column, reduced padding, full-width inputs
  - Test grid layout transitions at breakpoints
  - Adjust button sizes for mobile
  - _Requirements: 13.4, 13.5, 14.2_

- [x] 14. Style empty states and messages
  - Style empty-message divs (center text, secondary color, hidden by default)
  - Add show class to display messages
  - Style validation messages (error color, padding, left border)
  - Ensure proper spacing and visibility
  - _Requirements: 3.5, 7.3, 11.3_

- [x] 15. Checkpoint - CSS review
  - Ensure all colors meet WCAG AA contrast requirements (4.5:1 for text)
  - Verify responsive layout at multiple breakpoints (320px, 768px, 1024px)
  - Check focus states for keyboard navigation (2px outline)
  - Ask the user if questions arise.

---

## Phase 3: JavaScript Configuration and Utilities

- [x] 16. Set up JavaScript configuration and constants
  - Define CONFIG object with TIMER_DURATION (1500 seconds), intervals (1000ms)
  - Define STORAGE_KEYS object (todos, quickLinks, dashboard)
  - Create AppState object with tasks, quickLinks, timer, userName, editingTodoId, editingLinkId
  - Add comments marking sections (1-10) per design document structure
  - _Requirements: 7.1, 11.1_

- [x] 17. Implement utility functions
  - Implement `generateUUID()` for unique IDs (using regex replacement method)
  - Implement `isValidURL(url)` using URL constructor validation
  - Implement `formatTime(date)` for HH:MM format (12/24 hour)
  - Implement `formatDate(date)` for "Day, Month Date, Year" format
  - Implement `escapeHtml(text)` for XSS prevention in dynamic content
  - _Requirements: 15.1_

- [x] 18. Implement Local Storage Manager
  - Create `StorageManager` object with methods for saving/loading
  - Implement `saveTodos(tasks)` with error handling (QuotaExceededError)
  - Implement `loadTodos()` with JSON parsing and error recovery
  - Implement `saveQuickLinks(links)` with error handling
  - Implement `loadQuickLinks()` with JSON parsing and error recovery
  - Implement `saveDashboard(data)` for userName and timer state
  - Implement `loadDashboard()` for retrieving user preferences
  - Add try-catch blocks for all localStorage operations
  - _Requirements: 7.1, 7.2, 11.1, 11.2_

- [x] 19. Implement validation functions
  - Implement `validateTaskInput(title)` returning `{ valid, error }`
  - Check for empty/whitespace-only input
  - Check for max length (500 chars)
  - Implement `validateLinkInput(title, url)` returning `{ valid, error }`
  - Check for empty title and valid URL format
  - Implement `showError(message, containerSelector, duration)` for error UI
  - _Requirements: 3.5, 8.5, 9.6_

- [x] 20. Implement error handling functions
  - Implement `showValidationMessage(message, element)` for inline errors
  - Implement `showStorageError(error)` for quota exceeded messages
  - Implement `logError(context, error, details)` for console logging
  - Add auto-clear timeout (3 seconds default) for validation messages
  - _Requirements: 7.4, 11.4_

---

## Phase 4: Greeting Component Implementation

- [x] 21. Implement greeting component initialization and time updates
  - Create `GreetingComponent` object with `init()` method
  - Implement `getGreeting(hour)` returning time-based greeting (Morning 5am-11:59am, Afternoon 12pm-4:59pm, Evening 5pm-4:59am)
  - Implement `updateTime()` to update time and date displays every second
  - Implement `formatTimeDisplay()` for HH:MM format with leading zeros
  - Call `init()` on DOMContentLoaded
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 22. Implement user name persistence in greeting
  - Implement `saveUserName(name)` to save to localStorage and AppState
  - Implement `loadUserName()` to restore from localStorage on page load
  - Add event listener to user name input (blur or keydown Enter)
  - Debounce save operations (500ms) to avoid excessive localStorage writes
  - Display user name in greeting if available
  - _Requirements: 1.7, 7.1_

- [x] 23.* Write unit tests for greeting component
  - **Property 12: User Name Persistence**
  - **Validates: Requirements 1.7**
  - Test time display updates every second
  - Test greeting changes based on hour (morning/afternoon/evening)
  - Test user name saves and loads from localStorage
  - Test date format matches "Day, Month Date, Year"

---

## Phase 5: Focus Timer Component Implementation

- [x] 24. Implement timer component initialization and state management
  - Create `TimerComponent` object
  - Implement `init()` to initialize timer to 25:00 (1500 seconds)
  - Store timerIntervalId globally for cleanup
  - Set initial AppState.timer to { seconds: 1500, isRunning: false, isComplete: false }
  - Render initial timer display
  - _Requirements: 2.1, 2.6_

- [x] 25. Implement timer countdown logic
  - Implement `startTimer()` to begin countdown (set isRunning=true, start interval)
  - Implement `decrementTimer()` to reduce seconds by 1 per interval
  - Implement `updateTimerUI()` to refresh display and buttons
  - Check boundary: stop at 0 seconds (never go negative)
  - Trigger completion state when reaching 0
  - Clear interval when timer reaches 0
  - _Requirements: 2.2, 2.3, 2.6_

- [x] 26. Implement timer pause and reset
  - Implement `stopTimer()` to pause countdown (set isRunning=false, clear interval)
  - Implement `resetTimer()` to return to 25:00 and stop countdown
  - Disable Reset button while timer is running
  - Implement `formatTimerDisplay(seconds)` for MM:SS format with padding
  - Update button states based on isRunning (Start/Stop toggling)
  - _Requirements: 2.4, 2.5, 2.6, 2.8_

- [x] 27. Implement timer completion notification
  - Implement `playNotification()` called when timer reaches 0
  - Play audio notification (beep sound or system notification)
  - Change timer display color to green
  - Display "Complete" message in timer-status
  - Prevent multiple notifications for same session (use isComplete flag)
  - Add visual indicator (color change or animation)
  - _Requirements: 2.7, 2.9_

- [x] 28. Implement timer button event handlers
  - Add click listeners to Start, Stop, Reset buttons via event delegation
  - Call appropriate TimerComponent methods
  - Update UI after each action
  - Ensure buttons are only enabled/disabled appropriately
  - _Requirements: 2.3, 2.4, 2.5, 2.8_

- [x] 29.* Write unit and property tests for timer component
  - **Property 5: Timer Non-Negative**
  - **Validates: Requirements 2.1, 2.2, 2.6**
  - **Property 6: Timer Exclusivity**
  - **Validates: Requirements 2.3, 2.4, 2.5**
  - **Property 11: Timer Completion Notification**
  - **Validates: Requirements 2.7, 2.9**
  - Test timer starts, stops, resets correctly
  - Test timer display never goes negative
  - Test timer cannot be both running and paused
  - Test completion notification fires exactly once per cycle
  - Test button states change appropriately

---

## Phase 6: To-Do List Component - Core CRUD

- [x] 30. Implement todo component initialization and rendering
  - Create `TodoComponent` object
  - Implement `init()` to load tasks from localStorage on startup
  - Implement `renderTodoList()` to clear list and re-render all tasks
  - Implement `renderTodoItem(task)` to create list item or edit mode UI
  - Handle empty state: show/hide empty-message based on task count
  - Call `init()` on DOMContentLoaded
  - _Requirements: 3.1, 7.1, 7.2_

- [x] 31. Implement add task functionality
  - Implement `addTodo(title)` to create new task with UUID and metadata
  - Set completed=false, createdAt=Date.now() automatically
  - Validate input before creating (use validateTaskInput)
  - Add task to AppState.tasks array
  - Save to localStorage
  - Clear input field and re-render list
  - Show validation message on invalid input
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

- [x] 32. Implement edit task functionality
  - Implement `enterEditMode(taskId)` to show edit UI for task
  - Set AppState.editingTodoId to track active edit
  - Exit previous edit if entering new edit (auto-cancel)
  - Implement `exitEditMode()` to return to normal display
  - Implement `saveTodoEdit(taskId, newTitle)` to update task title
  - Validate new title before saving
  - Prevent empty title saves
  - Update localStorage and re-render
  - Implement Cancel button to discard changes without saving
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 33. Implement task completion toggle
  - Implement `toggleComplete(taskId)` to flip completed flag
  - Apply strikethrough style to completed tasks
  - Reduce opacity for completed tasks
  - Save to localStorage after toggle
  - Re-render list item
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 34. Implement delete task functionality
  - Implement `deleteTodo(taskId)` to remove task from array
  - Clear editingTodoId if deleting currently-edited task
  - Remove from AppState.tasks array
  - Save to localStorage
  - Re-render list
  - Optional: Add confirmation dialog before delete
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 35. Implement todo event handlers and keyboard support
  - Add click listener for Add button (handleAddTodo)
  - Add keydown listener for Enter in input (add task)
  - Add click listeners for Edit, Delete buttons (event delegation)
  - Add keydown listener for Escape in edit mode (cancel edit)
  - Add keydown listener for Enter in edit input (save)
  - Add change listener for task checkboxes (toggle complete)
  - _Requirements: 3.6, 4.4, 4.5_

- [x] 36.* Write unit and property tests for todo CRUD
  - **Property 1: Task Uniqueness**
  - **Validates: Requirements 3.3**
  - **Property 2: Task Immutability of Metadata**
  - **Validates: Requirements 3.3, 3.4**
  - **Property 3: Exclusive Task State**
  - **Validates: Requirements 4.2, 4.3, 4.4**
  - **Property 4: Completion Status Independence**
  - **Validates: Requirements 5.2, 5.3, 5.4**
  - Test adding tasks creates unique IDs
  - Test editing preserves id and createdAt
  - Test task cannot be in edit mode and list display simultaneously
  - Test completion status is independent for each task
  - Test all CRUD operations persist to storage

---

## Phase 7: To-Do List Component - Storage and Validation

- [x] 37. Implement todo storage persistence
  - Implement `saveTodosToStorage()` to persist tasks array to localStorage
  - Implement `loadTodosFromStorage()` to retrieve and validate data
  - Handle corrupted data (parse errors) gracefully by returning empty array
  - Verify loaded tasks have required fields (id, title, completed, createdAt)
  - Call loadTodosFromStorage on app startup
  - Call saveTodosToStorage after each CRUD operation
  - _Requirements: 7.1, 7.2, 7.4, 7.5_

- [x] 38. Implement todo input validation and error display
  - Validate task title is non-empty and non-whitespace
  - Display validation message in .todo-validation-message
  - Auto-clear message after 3 seconds or on user input
  - Prevent task creation with invalid input
  - Trim whitespace from input before saving
  - Test max length (500 characters)
  - _Requirements: 3.5, 6.2_

- [x] 39.* Write property tests for todo storage consistency
  - **Property 7: Storage Consistency - Tasks**
  - **Validates: Requirements 7.1, 7.2, 7.4, 7.5**
  - **Property 13: Empty Input Rejection**
  - **Validates: Requirements 3.5, 8.5, 9.6**
  - **Property 14: State Atomicity**
  - **Validates: Requirements 7.1, 11.1**
  - **Property 15: Display Consistency**
  - **Validates: Requirements 3.7, 6.2, 10.2, 12.3**
  - Test save → load round trip preserves all task properties
  - Test whitespace-only input is rejected
  - Test storage write is atomic with state update
  - Test UI displays exactly the tasks from storage

---

## Phase 8: Quick Links Component - Core CRUD

- [x] 40. Implement quick links component initialization and rendering
  - Create `LinksComponent` object
  - Implement `init()` to load links from localStorage on startup
  - Implement `renderQuickLinks()` to clear links and re-render all
  - Implement `renderQuickLink(link)` to create link element or edit mode UI
  - Handle empty state: show/hide empty-message based on link count
  - Make links clickable to open URLs in new tab
  - Call `init()` on DOMContentLoaded
  - _Requirements: 8.2, 8.6, 11.1, 11.2, 12.1, 12.2_

- [x] 41. Implement add quick link functionality
  - Implement `addLink(title, url)` to create new link with UUID
  - Validate both title and URL before creating
  - Add link to AppState.quickLinks array
  - Save to localStorage
  - Clear input fields and re-render
  - Show validation message on invalid input
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 42. Implement edit quick link functionality
  - Implement `enterEditMode(linkId)` to show edit UI for link
  - Set AppState.editingLinkId to track active edit
  - Exit previous edit if entering new edit (auto-cancel)
  - Implement `saveLink(linkId, newTitle, newUrl)` to update link
  - Validate new title and URL before saving
  - Prevent empty title or invalid URL saves
  - Update localStorage and re-render
  - Implement Cancel button to discard changes
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 43. Implement delete quick link functionality
  - Implement `deleteLink(linkId)` to remove link from array
  - Clear editingLinkId if deleting currently-edited link
  - Remove from AppState.quickLinks array
  - Save to localStorage
  - Re-render links
  - Optional: Add confirmation dialog before delete
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [x] 44. Implement quick links event handlers
  - Add click listener for Add button (handleAddLink)
  - Add keydown listener for Enter in inputs (add link)
  - Add click listeners for Edit, Delete buttons (event delegation)
  - Add click listener for link itself to open URL in new tab
  - Add keydown listener for Escape in edit mode (cancel)
  - Add keydown listener for Enter in edit inputs (save)
  - _Requirements: 8.6, 9.4, 10.2, 12.2_

- [x] 45.* Write unit and property tests for link CRUD
  - **Property 9: Link Exclusivity**
  - **Validates: Requirements 8.4**
  - **Property 10: URL Validity Enforcement**
  - **Validates: Requirements 8.5, 9.6**
  - Test adding links creates unique IDs
  - Test URL validation catches invalid formats
  - Test edit mode and delete functionality
  - Test navigation behavior (opens in new tab)
  - Test all link CRUD operations persist to storage

---

## Phase 9: Quick Links Component - Storage and Validation

- [x] 46. Implement quick links storage persistence
  - Implement `saveLinksToStorage()` to persist links array to localStorage
  - Implement `loadLinksFromStorage()` to retrieve and validate data
  - Handle corrupted data gracefully by returning empty array
  - Verify loaded links have required fields (id, title, url)
  - Call loadLinksFromStorage on app startup
  - Call saveLinksToStorage after each CRUD operation
  - _Requirements: 11.1, 11.2, 11.4, 11.5_

- [x] 47. Implement quick link validation functions
  - Implement URL validation using URL() constructor
  - Validate title is non-empty and non-whitespace
  - Validate URL format before saving
  - Display validation messages in .link-validation-message
  - Auto-clear message after 3 seconds or on user input
  - Prevent link creation/update with invalid data
  - _Requirements: 8.5, 9.6, 11.1_

- [x] 48.* Write property tests for links storage consistency
  - **Property 8: Storage Consistency - Quick Links**
  - **Validates: Requirements 11.1, 11.2, 11.4, 11.5**
  - **Property 10: URL Validity Enforcement**
  - **Validates: Requirements 8.5, 9.6**
  - **Property 13: Empty Input Rejection**
  - **Validates: Requirements 3.5, 8.5, 9.6**
  - Test save → load round trip preserves all link properties
  - Test URL validation catches malformed URLs
  - Test whitespace-only input is rejected
  - Test UI displays exactly the links from storage

---

## Phase 10: Event Delegation and Global Initialization

- [x] 49. Implement global event delegation
  - Create central event dispatcher function
  - Add click listener on document for all button/link clicks
  - Add keydown listener on document for keyboard shortcuts
  - Use event.target.matches() or classList checks to route events
  - Handle all todo, link, timer, and greeting events
  - Minimize total event listeners (avoid listener bloat)
  - _Requirements: 13.6_

- [x] 50. Implement timer interval management
  - Create global timeIntervalId for time updates (1/second)
  - Create global timerIntervalId for timer countdown (1/second)
  - Implement `startTimeUpdates()` to begin time display updates
  - Implement `startTimerTick()` to begin countdown
  - Implement `stopAllIntervals()` to clean up on page unload
  - Add beforeunload listener to cleanup intervals
  - Ensure no duplicate intervals (check and clear before creating)
  - _Requirements: 1.3, 2.2_

- [x] 51. Implement app initialization on DOMContentLoaded
  - Check if localStorage is available (test with feature detection)
  - Load all data from storage (todos, links, dashboard settings)
  - Initialize all components (Greeting, Timer, Todo, Links)
  - Render all components to DOM
  - Start time and timer update intervals
  - Attach global event listeners
  - Handle private browsing mode gracefully
  - _Requirements: 7.1, 7.2, 11.1, 11.2_

- [x] 52. Implement app cleanup on beforeunload
  - Clear all intervals
  - Optional: Save any pending state
  - Ensure no memory leaks
  - _Requirements: 14.2_

---

## Phase 11: Accessibility and Polish

- [x] 53. Implement keyboard navigation and accessibility
  - Ensure all controls are keyboard accessible (Tab, Enter, Escape)
  - Add proper focus states with visible outlines
  - Use semantic HTML (button, input, label elements)
  - Add aria-labels where needed for screen readers
  - Add aria-live="polite" to timer for screen reader announcements
  - Add role="timer" to timer display
  - Test with keyboard-only navigation
  - _Requirements: 13.1, 14.2_

- [x] 54. Implement color contrast and accessibility standards
  - Verify all text meets WCAG AA contrast ratio (4.5:1)
  - Verify UI components meet 3:1 contrast ratio
  - Test focus indicators are visible (2px minimum)
  - Ensure focus outline has sufficient contrast
  - Review color choices for colorblind accessibility
  - _Requirements: 13.3_

- [x] 55. Implement responsive testing and refinements
  - Test layout on mobile (320px), tablet (768px), desktop (1024px)
  - Ensure inputs are touch-friendly (minimum 44px height)
  - Test timer display accuracy at different screen sizes
  - Verify no horizontal scroll on mobile
  - Test quick links grid wraps properly
  - _Requirements: 13.4, 14.2, 14.3_

---

## Phase 12: Testing and Validation

- [x] 56. Implement comprehensive unit tests
  - Test all validation functions
  - Test UUID generation uniqueness
  - Test all CRUD operations for todos and links
  - Test timer logic and state transitions
  - Test localStorage save/load cycle
  - Test error handling (quota exceeded, invalid data)
  - _Requirements: 7.1, 11.1_

- [x] 57.* Write integration tests
  - Test complete user flow: add task → mark complete → delete
  - Test add link → edit → navigate
  - Test data persistence across page reload
  - Test timer cycle from start to completion
  - Test greeting changes by time of day
  - Test keyboard shortcuts work end-to-end

- [x] 58.* Write end-to-end validation tests
  - Test all requirements are met (requirement-by-requirement)
  - Test browser compatibility (Chrome, Firefox, Edge, Safari)
  - Test performance: load time < 2 seconds
  - Test performance: UI response < 100ms
  - Test no external network requests
  - Test local storage persistence

- [x] 59. Final checkpoint - All tests passing
  - Ensure all unit tests pass
  - Ensure all property-based tests pass
  - Ensure all integration tests pass
  - Run performance profiling
  - Verify no console errors or warnings
  - Ask the user if questions arise.

---

## Notes

- All tasks marked with `*` are optional testing sub-tasks and can be deferred for MVP
- Core implementation tasks (unmarked) must be completed
- Each task builds on previous tasks; execute in order for best results
- Property-based tests validate universal correctness properties from design
- All code follows vanilla JavaScript patterns (no frameworks)
- All data persists only to localStorage; no backend required
- Tests can use Jest, Vitest, or similar testing frameworks
- Manual testing recommended for browser compatibility across Chrome, Firefox, Edge, Safari

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6"] },
    { "id": 2, "tasks": ["7.1", "8.1", "8.2", "9.1", "9.2", "10.1", "10.2"] },
    { "id": 3, "tasks": ["11.1", "12.1", "13.1", "14.1", "15.1"] },
    { "id": 4, "tasks": ["16.1", "17.1", "18.1", "19.1", "20.1"] },
    { "id": 5, "tasks": ["21.1", "22.1", "23.1"] },
    { "id": 6, "tasks": ["24.1", "25.1", "26.1", "27.1", "28.1", "29.1"] },
    { "id": 7, "tasks": ["30.1", "31.1", "32.1", "33.1", "34.1", "35.1", "36.1"] },
    { "id": 8, "tasks": ["37.1", "38.1", "39.1"] },
    { "id": 9, "tasks": ["40.1", "41.1", "42.1", "43.1", "44.1", "45.1"] },
    { "id": 10, "tasks": ["46.1", "47.1", "48.1"] },
    { "id": 11, "tasks": ["49.1", "50.1", "51.1", "52.1"] },
    { "id": 12, "tasks": ["53.1", "54.1", "55.1"] },
    { "id": 13, "tasks": ["56.1", "57.1", "58.1", "59.1"] }
  ]
}
```
