import express from "express";
import { adminLogin, addDoctor, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard } from "../controllers/adminControllers.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailability } from "../controllers/doctorControllers.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/add-doctor", authAdmin, upload.single("docImg"), addDoctor);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;