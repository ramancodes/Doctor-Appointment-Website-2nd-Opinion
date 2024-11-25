import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay'
import departmentModel from '../models/departmentModel.js';
import path from 'path';
import reportModel from '../models/reportModel.js';

const isStrongPassword = (password)=>{
    // Regular expressions for each condition
    const hasNumber = /[0-9]/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    
    
    // Check if all conditions are met
    return password.length >= 8 &&
           hasNumber.test(password) &&
           hasUpperCase.test(password) &&
           hasLowerCase.test(password) && 
           hasSpecialChar.test(password);
}

// api to register user
const registerUser = async (req, res)=>{
    try {
        const { name, email, password } = req.body
        if(!name || !email || !password){
            return res.json({success:false, message:"Missing Details"})
        }

        // validating email
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Enter a valid email"})
        }

        // validate strong password
        if(!isStrongPassword(password)){
            return res.json({success:false, message:"Please enter a strong password"})
        }


        // hashingh user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password : hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        // _id
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.json({success:true, token})


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

// API for user login
const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false, message:"User does not exists"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({success:true, token})
        } else {
            res.json({success:false, message:"Invalid Credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get all departments
const allDepartments = async (req, res)=>{
    try {
        const departments = await departmentModel.find({})
        res.json({success:true, departments})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get user profile data
const getProfile = async (req, res)=>{
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true, userData})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to update user profile
const updateProfile = async (req, res)=>{
    try {
        const { userId, name, phone, address, gender, dob } = req.body
        const imageFile = req.file
        
        if(!name || !phone || !address || !dob || !gender){
            return res.json({success:false, message:"Missing Details"})
        }

        await userModel.findByIdAndUpdate(userId, {name, phone, address:JSON.parse(address), dob, gender})
        if(imageFile){
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:'image'})
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, {image:imageUrl})
        }

        res.json({success:true, message:"Profile Updated"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to book appointment
const bookAppointment = async (req, res)=>{
    try {
        
        const {userId, docId, slotDate, slotTime} =  req.body

        const date = new Date()

        let am_pm = 'AM'
        let hour = date.getHours()
        if(hour>=12){
            am_pm = 'PM'
            hour = hour-12
        }

        const currentDate = date.getDate()+"_"+(date.getMonth()+1)+"_"+date.getFullYear()
        const currentTime = hour+":"+date.getMinutes()+" "+am_pm

        const docData = await doctorModel.findById(docId).select('-password')
        
        if(!docData.isAvailable){
            return res.json({success:false, message:"Doctor Not Available"})
        }

        let slots_booked = docData.slots_booked

        // Checking for slots availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false, message:"Slot Not Available"})
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            bookedDate: currentDate,
            bookedTime: currentTime,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in doctors data
        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true, message:"Appointment Booked"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get 2nd opinion report from user
const bookSecondOpinionAppointment = async (req, res)=>{
    try {
        const { userId, userSymptoms, department } =  req.body
        const reportFile = req.file
        // console.log(userId, userSymptoms, department, reportFile);
        

        if(!department || !userSymptoms){
            return res.json({success:false, message:"Missing Details"})
        }

        if(!reportFile){
            return res.json({success:false, message:"Report Missing"})
        }
        

        // checking file size less than 4MB and file type '.pdf'
        if(reportFile){
            const fileSizeInKB = (reportFile.size/1024);
            if(fileSizeInKB>4100){
                return res.json({success:false, message:"File Size Too Large"})
            }
            
            let fileExtension = path.extname(reportFile.originalname);
            if(fileExtension!=='.pdf'){
                return res.json({success:false, message:"Only Pdf Files Accepted"})
            }
        }

        let reportUrl;

        if(reportFile){
            // upload report to cloudinary
            const reportUpload = await cloudinary.uploader.upload(reportFile.path, {resource_type:'raw'})
            reportUrl = reportUpload.secure_url
        }
        

        const date = new Date()

        let am_pm = 'AM'
        let hour = date.getHours()
        if(hour>=12){
            am_pm = 'PM'
            hour = hour-12
        }

        const currentDate = date.getDate()+"_"+(date.getMonth()+1)+"_"+date.getFullYear()
        const currentTime = hour+":"+date.getMinutes()+" "+am_pm

        const userData = await userModel.findById(userId).select('-password')

        const reportData = {
            userId,
            report: reportUrl,
            userData,
            speciality: department,
            symptoms: userSymptoms,
            appliedDate: currentDate,
            appliedTime: currentTime,
            userData,
            date: Date.now(),
        }

        const newReportData = new reportModel(reportData)
        await newReportData.save()

        res.json({success:true, message:"Ticket Raised For Second Appointment"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }

}

// API to get user appointments for frontend my-appointment page
const listAppointment = async (req, res)=>{
    try {
        const { userId } = req.body
        const appointments = await appointmentModel.find({userId})

        res.json({success:true, appointments})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to cancel Appointment
const cancelAppointment = async (req, res)=>{
    try {
        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user
        if(appointmentData.userId !== userId){
            return res.json({success:false, message:"Unauthorized Action"})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        // releasing doctor slot
        const {docId, slotDate, slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true, message:"Appointment Cancelled"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get all the second opinion appointments
const listSecondOpinioReports = async (req, res)=>{
    try {
        const { userId } = req.body
        const reports = await reportModel.find({userId})

        res.json({success:true, reports})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to cancel second opinion Appointment
const cancelSecondOpinionReport = async (req, res)=>{
    try {
        const { userId, reportId } = req.body
        const reportData = await reportModel.findById(reportId)

        // verify appointment user
        if(reportData.userId !== userId){
            return res.json({success:false, message:"Unauthorized Action"})
        }

        await reportModel.findByIdAndUpdate(reportId, {cancelled:true})

        res.json({success:true, message:"Appointment Cancelled"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res)=>{

    try {
        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false, message:"Appointment Cancelled or Not Found"})
        }

        // Creating Options for razorpay payment
        const options = {
            amount: appointmentData.amount*100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        }


        // creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({success:true, order})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to verify payment of razerpay
const verifyRazorpay = async (req, res)=>{
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status==='paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment:true})
            res.json({success:true, message:"Payment Successful"})
        } else {
            res.json({success:false, message:"Payment Failed"})
        }
        

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export {
    registerUser, 
    loginUser, 
    getProfile, 
    updateProfile, 
    bookAppointment, 
    listAppointment, 
    cancelAppointment, 
    paymentRazorpay, 
    verifyRazorpay,
    allDepartments,
    bookSecondOpinionAppointment,
    listSecondOpinioReports,
    cancelSecondOpinionReport
}