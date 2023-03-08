const { Schema, model } = require("mongoose");

const appointmentSchema = new Schema(
  {
    date: {
      // 01 - 31
      type: String,
      maxlength: 2,
    },
    month: {
      // 00 - 11
      type: String,
      maxlength: 2,
    },
    year: {
      // 2022
      type: String,
      maxlength: 4,
    },
    day: {
      // 0 a 6
      type: String,
      maxlength: 1,
    },
    time: {
      // 09:15
      type: String,
      maxlength: 5,
    },
    available: {
      type: Boolean,
      default: true,
    },
    state: {
      type: String,
      enum: ["reservado", "confirmado", "cancelado", "asistido"],
    },
    branchOffice: [
      {
        type: Schema.Types.ObjectId,
        ref: "BranchOffice",
      },
    ],
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Appointment", appointmentSchema);
