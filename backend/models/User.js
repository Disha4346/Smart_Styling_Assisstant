// models/User.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name:  { type: String, required: [true, "Name is required"], trim: true, maxlength: 50 },
    email: {
      type: String, required: [true, "Email is required"], unique: true, lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: { type: String, required: [true, "Password is required"], minlength: 6, select: false },

    // Body measurements (spec §6)
    height:         { type: Number, default: null },   // cm
    weight:         { type: Number, default: null },   // kg
    chest:          { type: Number, default: null },   // cm
    waist:          { type: Number, default: null },   // cm
    hip:            { type: Number, default: null },   // cm
    shoulderWidth:  { type: Number, default: null },   // cm
    bodyShape:      { type: String, default: "", trim: true },   // hourglass, pear, etc.
    skinTone:       { type: String, default: "", trim: true },

    // Style preferences
    gender:         { type: String, default: "", trim: true },
    stylePreference:{ type: [String], default: [] },   // ["minimal","classic"]
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", UserSchema);