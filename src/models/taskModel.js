const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now() },
  },
  { timestamps: true, versionKey: false }
);

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
