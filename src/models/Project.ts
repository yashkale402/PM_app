import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    overview: { type: String ,require:true},
    status: {
      type: String,
      enum: ["active", "done", "rest"],
      default: "active",
    },
    timeline: { type: String ,default:"" },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // NEW FIELDS
    githubLink: { type: String, default: "" },
    liveSite: { type: String, default: "" },
    
  },
  { timestamps: true }
);

export default models.Project || model("Project", ProjectSchema);
