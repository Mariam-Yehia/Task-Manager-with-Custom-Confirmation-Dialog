// Select elements
const taskInput = document.getElementById('new-task'); // Input field for new tasks
const addTaskBtn = document.getElementById('add-task'); // Button to add a new task
const taskList = document.getElementById('task-list'); // List container for tasks

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Event listener for adding a new task
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim(); // Get the task text and trim whitespace
  if (taskText) {
    addTask(taskText); // Add the task to the UI
    saveTask(taskText, false); // Save the task to localStorage
    showNotification('Task added successfully!', 'success'); // Show a success notification
    taskInput.value = ''; // Clear the input field
  }
});

/**
 * Adds a task to the UI.
 * @param {string} text - The task description.
 * @param {boolean} completed - Whether the task is marked as completed.
 */
function addTask(text, completed = false) {
  // Create a new list item for the task
  const li = document.createElement('li');
  li.className = `task ${completed ? 'completed' : ''}`;
  
  li.innerHTML = `
    <span class="text">${text}</span>
    <div class="button-container">
        <button class="complete">✔</button>
        <button class="edit">✎</button>
        <button class="delete">✖</button>
    </div>
  `;

  // Mark task as completed
  li.querySelector('.complete').addEventListener('click', () => {
    li.classList.toggle('completed'); // Toggle the completed class
    updateTask(text, li.classList.contains('completed')); // Update the task in localStorage
    showNotification('Task status updated!', 'success');
  });

  // Edit the task
  li.querySelector('.edit').addEventListener('click', () => {
    const newText = prompt('Edit your task:', text); // Prompt user for new task text
    if (newText && newText !== text) {
      updateTask(text, false, newText); // Update task in localStorage with new text
      li.querySelector('.text').textContent = newText; // Update the UI
      showNotification('Task edited successfully!', 'success');
    }
  });

  // Delete the task with confirmation
  li.querySelector('.delete').addEventListener('click', () => {
    showConfirmationDialog('Are you sure you want to delete this task?', () => {
      li.remove(); // Remove the task from the UI
      deleteTask(text); // Remove the task from localStorage
      showNotification('Task deleted successfully!', 'success');
    });
  });

  taskList.appendChild(li); // Add the task to the task list
}

/**
 * Displays a notification message.
 * @param {string} message - The message to display.
 * @param {string} type - The type of notification (e.g., success, error).
 */
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Add notification to the document body
  document.body.appendChild(notification);

  // Add the "show" class for animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  // Remove the notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 500); // Wait for transition to complete
  }, 3000);
}

/**
 * Displays a confirmation dialog.
 * @param {string} message - The confirmation message.
 * @param {function} onConfirm - Callback function to execute if confirmed.
 */
function showConfirmationDialog(message, onConfirm) {
  // Create the overlay
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  // Create the dialog container
  const dialog = document.createElement('div');
  dialog.className = 'dialog';

  // Add the message
  const dialogMessage = document.createElement('p');
  dialogMessage.textContent = message;

  // Add the buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'dialog-buttons';

  const confirmButton = document.createElement('button');
  confirmButton.textContent = 'Yes';
  confirmButton.className = 'confirm';
  confirmButton.addEventListener('click', () => {
    onConfirm(); // Execute the confirmation callback
    document.body.removeChild(overlay); // Remove the overlay
  });

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'No';
  cancelButton.className = 'cancel';
  cancelButton.addEventListener('click', () => {
    document.body.removeChild(overlay); // Remove the overlay on cancel
  });

  buttonContainer.append(confirmButton, cancelButton);
  dialog.append(dialogMessage, buttonContainer);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay); // Add the overlay to the document body
}

/**
 * Loads tasks from localStorage and adds them to the UI.
 */
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Get tasks from localStorage
  tasks.forEach(task => addTask(task.text, task.completed)); // Add each task to the UI
}

/**
 * Saves a new task to localStorage.
 * @param {string} text - The task description.
 * @param {boolean} completed - Whether the task is completed.
 */
function saveTask(text, completed) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Get existing tasks
  tasks.push({ text, completed }); // Add the new task
  localStorage.setItem('tasks', JSON.stringify(tasks)); // Save back to localStorage
}

/**
 * Updates a task in localStorage.
 * @param {string} oldText - The old task description.
 * @param {boolean} completed - Whether the task is completed.
 * @param {string} [newText] - The new task description (optional).
 */
function updateTask(oldText, completed, newText = oldText) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks.find(t => t.text === oldText);
  if (task) {
    task.text = newText;
    task.completed = completed;
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Deletes a task from localStorage.
 * @param {string} text - The task description to delete.
 */
function deleteTask(text) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task.text !== text); // Remove the task from the list
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
