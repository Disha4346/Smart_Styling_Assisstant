const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    profile: {
      body_type: {
        type: String,
        enum: ["hourglass", "pear", "apple", "rectangle", "inverted_triangle", ""],
        default: "",
      },
      height: {
        type: Number, // in cm
      },
      weight: {
        type: Number, // in kg
      },
      skin_tone: {
        type: String,
        enum: ["fair", "light", "medium", "olive", "tan", "dark", ""],
        default: "",
      },
      style_preference: {
        type: [String], // ["casual", "formal", "sporty", "bohemian", etc.]
        default: [],
      },
    },
    savedDesigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Design",
      },
    ],
    preferences: {
      colors: [String],
      brands: [String],
      budget: {
        min: Number,
        max: Number,
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);