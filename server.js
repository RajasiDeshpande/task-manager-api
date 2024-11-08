const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
app.listen(port,()=>{
    console.log(`server is listening through port ${port}`);
})
app.use(express.json());
async function main() {
  await mongoose.connect("mongodb+srv://rajasi:R%40jasi04@cluster0.pjlgq.mongodb.net/bookcollection?retryWrites=true&w=majority&appName=Cluster0");
}
main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
})
const taskSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true 
    },
    completed: { 
        type: Boolean, 
        default: false 
    }
});
const Task = mongoose.model('Task', taskSchema);

// POST: Create a new task
app.post('/tasks', async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({ title, description });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ message: 'Error creating task', error: err });
    }
});

// GET: Fetch all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks', error: err });
    }
});

// GET: Fetch a task by ID
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching task', error: err });
    }
});

// PUT: Update a task by ID
app.put('/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (updatedTask) {
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err });
    }
});

// DELETE: Remove a task by ID
app.delete('/tasks/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (deletedTask) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err });
    }
});