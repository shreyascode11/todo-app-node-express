// 1. Import Express
const express = require('express');
const path = require('path');
// --- New Code: Import cors ---
const cors = require('cors');

// 2. Create an instance of an Express app
const app = express();
const port = 3000;

// --- New Code: Use cors ---
// This allows requests from other origins (like the preview window)
app.use(cors());

// This is middleware. It tells Express to automatically parse
// any JSON data that comes in with a request (like from our 'Add Task' button).
app.use(express.json());

// This line tells Express to make the current folder ('__dirname')
// publicly accessible. This is how the browser can find your index.html.
app.use(express.static(__dirname));

// --- "Fake Database" ---
let tasks = [
  { id: 1, text: "Learn Node.js" },
  { id: 2, text: "Build a To-Do App" }
];
let nextTaskId = 3;

// 3. Define our Routes

// --- Main Homepage Route ---
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'index.html'));
});

// --- API Route 1: GET All Tasks ---
app.get('/api/tasks', (request, response) => {
  response.json(tasks);
});

// --- API Route 2: POST a New Task ---
app.post('/api/tasks', (request, response) => {
  // Check if the request body or text is missing
  if (!request.body || !request.body.text) {
    return response.status(400).json({ error: 'Task text is required' });
  }

  const taskText = request.body.text;
  const newTask = {
    id: nextTaskId,
    text: taskText
  };
  tasks.push(newTask);
  nextTaskId++;
  response.status(201).json(newTask);
});

// --- API Route 3: DELETE a Task ---
// We use a "route parameter" (/:id) to capture the id from the URL
app.delete('/api/tasks/:id', (request, response) => {
  // 1. Get the ID from the URL. It comes in as a string, so we use parseInt()
  //    to turn it into a number.
  const idToDelete = parseInt(request.params.id);

  // 2. Find the index (position) of the task in the array
  const taskIndex = tasks.findIndex(task => task.id === idToDelete);

  // 3. If the task wasn't found, taskIndex will be -1.
  if (taskIndex === -1) {
    return response.status(404).json({ error: 'Task not found' });
  }

  // 4. If we found it, remove 1 item at that index from the array
  tasks.splice(taskIndex, 1);

  // 5. Send a "No Content" response, which is standard for a successful DELETE
  response.status(204).send();
});


// 4. Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

