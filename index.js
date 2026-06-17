const fs = require('fs');

const args = process.argv.slice(2);
const command = args[0];
const taskText = args[1];
const filter = args[1];

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

// Mark a task as done
function completeTask(id) {
  const tasks = loadTasks();
  const task = tasks.find(task => task.id === parseInt(id));
  if (!task) {
    console.log(`Task ${id} not found!`);
    return;
  }
  task.done = true;
  saveTasks(tasks);
  console.log(`✅ Task ${id} marked as done: "${task.text}"`);
}

// List all tasks (with optional filter)
function listTasks(filter) {
  let tasks = loadTasks();

  if (filter === '--done') {
    tasks = tasks.filter(task => task.done);
  } else if (filter === '--pending') {
    tasks = tasks.filter(task => !task.done);
  }

  if (tasks.length === 0) {
    console.log('No tasks found!');
    return;
  }
  tasks.forEach(task => {
    console.log(`${task.id}. [${task.done ? 'x' : ' '}] ${task.text}`);
  });
}

// Run the right function based on command
if (command === 'add') {
  addTask(taskText);
} else if (command === 'complete') {
  completeTask(args[1]);
} else if (command === 'list') {
  listTasks(filter);
} else {
  console.log('Usage: node index.js add "task" | list [--done|--pending] | complete <id>');
}