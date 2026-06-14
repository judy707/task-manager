const fs = require('fs');

const args = process.argv.slice(2);
const command = args[0];
const taskText = args[1];

const tasksFile = 'tasks.json';

// Read existing tasks
function loadTasks() {
  const data = fs.readFileSync(tasksFile, 'utf-8');
  return JSON.parse(data);
}

// Save tasks back to file
function saveTasks(tasks) {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

// Add a new task
function addTask(text) {
  const tasks = loadTasks();
  tasks.push({ id: tasks.length + 1, text: text, done: false });
  saveTasks(tasks);
  console.log(`✅ Task added: "${text}"`);
}

// List all tasks
function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks yet!');
    return;
  }
  tasks.forEach(task => {
    console.log(`${task.id}. [${task.done ? 'x' : ' '}] ${task.text}`);
  });
}

// Run the right function based on command
if (command === 'add') {
  addTask(taskText);
} else if (command === 'list') {
  listTasks();
} else {
  console.log('Usage: node index.js add "task text"  OR  node index.js list');
}