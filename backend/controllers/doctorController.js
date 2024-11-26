import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import reportModel from "../models/reportModel.js";
import path from "path";
import {v2 as cloudinary} from 'cloudinary'

const changeAvailability = async (req, res)=>{
    try{

        const {docId} = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, {isAvailable: !docData.isAvailable})
        res.json({success:true, message:"Availability Changed"})

    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to change date availability
const changeDateAvailability = async (req, res)=>{
    
}

const doctorsList = async (req, res)=>{
    try{
        const doctors = await doctorModel.find({}).select(['-password, -email'])
        res.json({success:true, doctors})
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API for doctor login
const loginDoctor = async (req, res)=>{
    try {
        const {email, password} = req.body
        const doctor = await doctorModel.findOne({email})
        
        if(!doctor){
            return res.json({success:false, message:"Invalid credentials"})
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if(isMatch){
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)

            res.json({success:true, token})
        } else {
            res.json({success:false, message:"Invalid password"})
        }

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res)=>{
    try {
        const { docId } = req.body
        const appointments = await appointmentModel.find({docId})

        res.json({success:true, appointments})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res)=>{
    try {
        
        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        const date = new Date()

        let am_pm = 'AM'
        let hour = date.getHours()
        if(hour>=12){
            am_pm = 'PM'
            hour = hour-12
        }

        const currentDate = date.getDate()+"_"+(date.getMonth()+1)+"_"+date.getFullYear()
        const currentTime = hour+":"+date.getMinutes()+" "+am_pm
        // console.log(currentDate, currentTime);

        if(appointmentData && appointmentData.docId === docId){

            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true, completedDate: currentDate, completedTime: currentTime})
            return res.json({success:true, message:"Appointment Completed"})
            
        } else {
            return res.json({success:false, message:"Mark Failed"})
        }


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to cancel appointment completed for doctor panel
const appointmentCancel = async (req, res)=>{
    try {
        
        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){

            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
            return res.json({success:true, message:"Appointment Cancelled"})
            
        } else {
            return res.json({success:false, message:"Cancellation Failed"})
        }


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res)=>{

    try {
        
        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})
        const reports = await reportModel.find({docId})
        let earnings = 0

        appointments.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings+=item.amount
            }
        })

        reports.map((item)=>{
            if(item.isCompleted || item.payment){
                earnings+=item.amount
            }
        })

        let patients = []

        appointments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        reports.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            reports: reports.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5),
            latestReports: reports.reverse().slice(0, 5)
        }

        res.json({success:true, dashData})


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }


}

// API to get profile for doctor panel
const doctorProfile = async (req, res)=>{

    try {

        const {docId} = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({success:true, profileData})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }

}

// API to update doctor profile data from doctor panel

const updateDoctorProfile = async (req, res)=>{
    try {

        const { docId, fees, address, isAvailable } = req.body

        await doctorModel.findByIdAndUpdate(docId, {fees, address, isAvailable})

        res.json({success:true, message:"Profile Updated"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to show user report
const showReport = async (req, res)=>{
    try {
        const { docId } = req.body
        const docData = await doctorModel.findById(docId).select('-password')

        const data =  await reportModel.find({speciality: docData.speciality})
        const reports = data.reverse()

        res.json({success:true, reports})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to accept user report
const acceptReport = async (req, res)=>{
    try {
        const { docId, reportId } = req.body
        const docData = await doctorModel.findById(docId).select('-password')

        const date = new Date()

        let am_pm = 'AM'
        let hour = date.getHours()
        if(hour>=12){
            am_pm = 'PM'
            hour = hour-12
        }

        const currentDate = date.getDate()+"_"+(date.getMonth()+1)+"_"+date.getFullYear()
        const currentTime = hour+":"+date.getMinutes()+" "+am_pm
        const amount = docData.fees

        await reportModel.findByIdAndUpdate(reportId, {docId, docData, amount, acceptedDate:currentDate, acceptedTime:currentTime})

        res.json({success:true, message:"Report Request Accepted"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get individual doctors accepted reports
const individualDocReports = async (req, res)=>{
    try {
        const { docId } = req.body

        const data = await reportModel.find({docId})
        const reports = data.reverse()

        res.json({success:true, reports})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to cancel appointment completed for doctor panel
const reportCancel = async (req, res)=>{
    try {
        
        const { docId, reportId } = req.body

        const reportData = await reportModel.findById(reportId)

        if(reportData && reportData.docId === docId){

            await reportModel.findByIdAndUpdate(reportId, {cancelled: true})
            return res.json({success:true, message:"Report Cancelled"})
            
        } else {
            return res.json({success:false, message:"Cancellation Failed"})
        }


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to mark appointment completed for doctor panel
const reportComplete = async (req, res)=>{
    try {
        
        const { docId, reportId } = req.body

        const reportData = await reportModel.findById(reportId)

        const date = new Date()

        let am_pm = 'AM'
        let hour = date.getHours()
        if(hour>=12){
            am_pm = 'PM'
            hour = hour-12
        }

        const currentDate = date.getDate()+"_"+(date.getMonth()+1)+"_"+date.getFullYear()
        const currentTime = hour+":"+date.getMinutes()+" "+am_pm
        // console.log(currentDate, currentTime);

        if(reportData && reportData.docId === docId){

            await reportModel.findByIdAndUpdate(reportId, {isCompleted: true, completedDate: currentDate, completedTime: currentTime})
            return res.json({success:true, message:"Report Completed"})
            
        } else {
            return res.json({success:false, message:"Complete Mark Failed"})
        }


    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to upload doctor report file
const uploadReport = async (req, res)=>{
    try {
        const {reportId} = req.body
        const doctorReport = req.file

        if(!doctorReport){
            return res.json({success:false, message:"Report Missing"})
        }
        

        // checking file size less than 4MB and file type '.pdf'
        if(doctorReport){
            const fileSizeInKB = (doctorReport.size/1024);
            if(fileSizeInKB>4100){
                return res.json({success:false, message:"File Size Too Large"})
            }
            
            let fileExtension = path.extname(doctorReport.originalname);
            if(fileExtension!=='.pdf'){
                return res.json({success:false, message:"Only Pdf Files Accepted"})
            }
        }

        let reportUrl;

        if(doctorReport){
            // upload report to cloudinary -> change to AWS S3
            const reportUpload = await cloudinary.uploader.upload(doctorReport.path, {resource_type:'raw'})
            reportUrl = reportUpload.secure_url
        }

        await reportModel.findByIdAndUpdate(reportId, {doctorReport: reportUrl})

        res.json({success:true, message:'File Uploaded'})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }

}

// API to delete uploaded file
const deleteReport = async (req, res)=>{
    try {
        const {reportId} = req.body

        await reportModel.findByIdAndUpdate(reportId, {doctorReport:''})

        res.json({success:true, message:'File Deleted'})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export {
    changeAvailability, 
    doctorsList, 
    loginDoctor, 
    appointmentsDoctor, 
    appointmentCancel, 
    appointmentComplete, 
    doctorDashboard, 
    doctorProfile, 
    updateDoctorProfile,
    showReport,
    acceptReport,
    individualDocReports,
    reportCancel,
    reportComplete,
    uploadReport,
    deleteReport
}