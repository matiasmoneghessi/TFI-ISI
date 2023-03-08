const express = require("express")
const router = express.Router()
const userRoutes = require("./users")
const appointmentRoutes = require("./appointment")
const branchOfficeRoutes = require("./branchOffice")
const availableAppointment = require("./availableAppointment")

router.use("/users", userRoutes)
router.use("/appointment", appointmentRoutes)
router.use("/branchOffice", branchOfficeRoutes)
router.use("/availableAppointment", availableAppointment)

module.exports = router;

