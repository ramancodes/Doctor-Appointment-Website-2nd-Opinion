import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
import departmentModel from '../models/departmentModel.js'


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

// api for adding doctor
const addDoctor = async (req, res)=> {
    try{
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file
        
        // checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.json({success:false, message:"Missing Details"})
        }
        

        // validate email format
        if(!validator.isEmail(email)){
            return res.json({success:false, message:"Please enter a valid email"})
        }

        // validate strong password
        if(!isStrongPassword(password)){
            return res.json({success:false, message:"Please enter a valid password"})
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudnary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resourse_type:"image"})
        const imageUrl = imageUpload.secure_url


        // addd to database
        const doctorData = {
            name,
            email,
            image:imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success:true, message:"Doctor Added"})
    } catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

// api for admin login
const loginAdmin = async (req, res)=>{
    try{
        const {email, password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true, token})

        }else {
            res.json({success:false, message:"Invalid Credentials"})
        }
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// api to get all doctors list
const allDoctors = async (req, res)=>{
    try{
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true, doctors})
    }catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get all users
const allUsers = async (req, res)=>{
    try {
        const users = await userModel.find({}).select('-password')
        res.json({success:true, users})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get all appointment list
const appointmentsAdmin = async (req, res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true, appointments})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to cancel appointment
const cancelAppointmentAdmin = async (req, res)=>{
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

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

// API to get dashboard data for admin panel
const adminDashboard = async (req, res)=>{
    try {
        
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        const departments = await departmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            departments: departments.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({success:true, dashData})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to remove user
const removeUser = async (req, res)=>{
    try {

        const { userId } = req.body
        await userModel.deleteOne({email:userId})

        res.json({success:true, message:"Deleted Successfully"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to remove doctor
const removeDoctor = async (req, res)=>{
    try {
        const { docId } = req.body
        await doctorModel.deleteOne({email:docId})

        res.json({success:true, message:"Deleted Successfully"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get all the departments
const addDepartment = async (req, res)=>{
    try {

        const {speciality} = req.body
        const imageFile = req.file
        
        // checking for all data to add department
        if(!speciality){
            return res.json({success:false, message:"Missing Details"})
        }

        // upload image to cloudnary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resourse_type:"image"})
        const imageUrl = imageUpload.secure_url

        // addd to database
        const departmentData = {
            image:imageUrl,
            speciality,
        }

        const newDepartment = new departmentModel(departmentData)
        await newDepartment.save()

        res.json({success:true, message:"New Department Added"})
        
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

// API to delete department
const removeDepartment = async (req, res)=>{
    try {
        const { depId } = req.body
        await departmentModel.deleteOne({speciality:depId})

        res.json({success:true, message:"Deleted Successfully"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to add symptopms to department
const addSymptom = async (req, res)=>{
    try {
        const {dep, symptom} = req.body
        // console.log(dep, symptom);
        
        // checking for all data to add symptom
        if(!symptom){
            return res.json({success:false, message:"Missing Details"})
        }

        const data = await departmentModel.find({speciality: dep})
        // console.log(data);
        
        // Checking if symptom already added
        const depId = data[0]._id
        let symptoms = data[0].symptoms
        // console.log(depId, symptoms);

        if(symptoms){
            if(symptoms.includes(symptom)){
                return res.json({success:false, message:"Symptom already available"})
            } else {
                symptoms.push(symptom)
            }
        } else {
            symptoms.push(symptom)
        }

        await departmentModel.findByIdAndUpdate(depId, {symptoms})

        res.json({success:true, message:"Symptom Added"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get symptoms from department
const getSymptoms = async (req, res)=>{
    try {
        const {depId} = req.body

        const data = await departmentModel.findById(depId)
        let symptoms = data.symptoms
        if(symptoms){
            res.json({success:true, symptoms})
        } else {
            res.json({success:false, message:"No Symptoms Available"})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }

}

// API to remove symptoms
const removeSymptom = async (req, res)=>{
    try {
        const {dep, symptom} = req.body
        // console.log(dep, symptom)

        const data = await departmentModel.find({speciality: dep})
        // console.log(data);
        
        // Checking if symptom already added
        const depId = data[0]._id
        let symptoms = data[0].symptoms
        // console.log(depId, symptoms);

        symptoms = symptoms.filter(e => e!==symptom)

        await departmentModel.findByIdAndUpdate(depId, {symptoms})

        res.json({success:true, message:"Symptom Deleted"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export {
    addDoctor, 
    loginAdmin, 
    allDoctors, 
    appointmentsAdmin, 
    cancelAppointmentAdmin, 
    adminDashboard, 
    allUsers,
    removeUser,
    removeDoctor,
    addDepartment,
    allDepartments,
    removeDepartment,
    addSymptom,
    getSymptoms,
    removeSymptom
}