import express from 'express'
import { acceptReport, appointmentCancel, appointmentComplete, appointmentsDoctor, deleteReport, doctorDashboard, doctorProfile, doctorsList, individualDocReports, loginDoctor, reportCancel, reportComplete, showReport, updateDoctorProfile, uploadReport } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'
import upload from '../middlewares/multer.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorsList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)
doctorRouter.get('/all-reports', authDoctor, showReport)
doctorRouter.get('/doctor-reports', authDoctor, individualDocReports)
doctorRouter.post('/accept-report', authDoctor, acceptReport)
doctorRouter.post('/cancel-report', authDoctor, reportCancel)
doctorRouter.post('/complete-report', authDoctor, reportComplete)
doctorRouter.post('/upload-report', upload.single('file'), authDoctor, uploadReport)
doctorRouter.post('/delete-report', authDoctor, deleteReport)

export default doctorRouter