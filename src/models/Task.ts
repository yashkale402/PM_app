import mongoose, { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    overview: { type: String },
    status: { type: String, default: "ToDo" }, // e.g. ToDo, InProgress, Completed
    dueDate: { type: Date },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Task || model("Task", TaskSchema);
