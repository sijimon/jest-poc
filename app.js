const express = require('express');
const app = express();
const port = 3000;

// Sample data (in-memory)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// Middleware
app.use(express.json());

// Create (POST)
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Read all (GET)
app.get('/users', (req, res) => {
  res.json(users);
});

// Read by ID (GET)
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update (PUT)
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  const user = users.find(user => user.id === id);
  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Delete (DELETE)
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    const deletedUser = users.splice(index, 1)[0];
    res.json(deletedUser);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
  module.exports = { app, server };