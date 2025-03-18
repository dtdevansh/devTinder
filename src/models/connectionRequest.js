const mongoose = require("mongoose");
const { isLowercase } = require("validator");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      lowercase: true,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  {
    timestamps: true,
  }
);
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
