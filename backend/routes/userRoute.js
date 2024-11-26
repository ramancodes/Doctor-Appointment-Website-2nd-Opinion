import express from 'express'
import { allDepartments, bookAppointment, bookSecondOpinionAppointment, cancelAppointment, cancelSecondOpinionReport, getProfile, listAppointment, listSecondOpinioReports, loginUser, paymentRazorpay, registerUser, updateProfile, verifyRazorpay } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/all-departments', allDepartments)
userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-razorpay', authUser, paymentRazorpay)
userRouter.post('/verify-razorpay', authUser, verifyRazorpay)
userRouter.post('/book-second-opinion-appointment', upload.single('file'), authUser, bookSecondOpinionAppointment)
userRouter.get('/reports', authUser, listSecondOpinioReports)
userRouter.post('/cancel-report', authUser, cancelSecondOpinionReport)


export default userRouter