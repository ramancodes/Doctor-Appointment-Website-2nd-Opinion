import express from 'express'
import { addDepartment, addDoctor, adminDashboard, allDepartments, allDoctors, allUsers, appointmentsAdmin, cancelAppointmentAdmin, loginAdmin, removeDepartment, removeDoctor, removeUser } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment', authAdmin, cancelAppointmentAdmin)
adminRouter.get('/dashboard', authAdmin, adminDashboard)
adminRouter.post('/all-users', authAdmin, allUsers)
adminRouter.post('/delete-user', authAdmin, removeUser)
adminRouter.post('/delete-doctor', authAdmin, removeDoctor)
adminRouter.post('/add-department', authAdmin, upload.single('image'), addDepartment)
adminRouter.post('/all-departments', authAdmin, allDepartments)
adminRouter.post('/delete-department', authAdmin, removeDepartment)

export default adminRouter