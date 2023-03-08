const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fname: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 3,
      maxlength: 255,
    },
    lname: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 2,
      maxlength: 255,
    },
    dni: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      minlength: 6,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 255,
    },
    admin: {
      type: Boolean,
      required: false,
      default: false,
    },
    operator: {
      type: Boolean,
      required: false,
      default: false,
    },
    phone: {
      type: String,
      required: false,
      lowercase: true,
      minlength: 7,
      maxlength: 25,
    },
    birthdate: {
      type: String,
      required: false,
      minlength: 8,
      maxlength: 12,
    },
    address: {
      type: String,
      require: false,
      lowercase: true,
      minlength: 8,
      maxlength: 255,
    },
    resetLink: {type: String, default: ""},//guarda el token de recupero de contraseña
    branchOffice: [{
      type: Schema.Types.ObjectId,
      ref: "BranchOffice",
    }],
    appointment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
},
  { timestamps: true }
);

module.exports = model("User", userSchema);

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();