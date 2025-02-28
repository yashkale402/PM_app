import mongoose, { Schema, model, models } from "mongoose";

const TodoSchema = new Schema(
  {
    task: { type: String, required: true },
    description: { type: String },
    note: { type: String },
    priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
    status: { type: String, enum: ["active", "done", "rest"], default: "active" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Todo || model("Todo", TodoSchema);
