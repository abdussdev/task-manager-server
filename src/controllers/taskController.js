const Task = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskData = req.body;

    // Set the userId in the taskData
    taskData.userId = userId;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in the request" });
    }

    const createdTask = await Task.create(taskData);

    res.status(201).json({
      message: "Task created successfully",
      task: createdTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.taskId;
    const taskData = req.body;

    // Set the userId in the taskData
    taskData.userId = userId;

    const updatedTask = await Task.findOneAndUpdate({ userId, _id: taskId }, taskData, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.taskId;
    const { status } = req.body;

    // Find the task by taskId and userId to ensure the user has permission
    const task = await Task.findOne({ userId, _id: taskId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task's status
    task.status = status;
    await task.save();

    res.json({
      message: 'Task status updated successfully',
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.readAllTask = async (req, res) => {
  try {
    const userId = req.user.userId;

    const allTask = await Task.find({ userId });

    if (!allTask || allTask.length === 0) {
      return res.status(404).json({ error: "No tasks found for the user" });
    }

    res.status(200).json(allTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.readSingleTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.taskId;

    const task = await Task.findOne({ userId, _id: taskId });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.listTaskByStatus = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    // Find tasks with the specified status for the authenticated user
    const tasks = await Task.find({ userId, status });

    res.json({
      message: 'Tasks retrieved successfully',
      tasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.userId;
    const taskId = req.params.taskId;

    const deletedTask = await Task.findByIdAndRemove({ userId, _id: taskId });

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).json(); // Use 204 No Content status code to indicate successful deletion
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
