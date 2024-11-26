import { createContext, useState } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [reports, setReports] = useState([])
    const [dashData, setDashData] = useState(false)
    const [users, setUsers] = useState([])
    const [departments, setDepartments] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getAllDepartments = async ()=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/all-departments', {}, {headers:{aToken}})
            if(data.success){
                setDepartments(data.departments)
                console.log(data.departments)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllUsers = async ()=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/all-users', {}, {headers:{aToken}})
            if(data.success){
                setUsers(data.users)
                // console.log(data.users)
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllDoctors = async ()=>{
        try{
            const {data} = await axios.post(backendUrl+'/api/admin/all-doctors', {}, {headers:{aToken}})
            if(data.success){
                setDoctors(data.doctors)
                console.log(data.doctors)
                
            }else{
                toast.error(data.message)
            }
        } catch(error){
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId)=>{
        try{
            const {data} = await axios.post(backendUrl+'/api/admin/change-availability', {docId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        }catch(error){
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
            
            const {data} = await axios.get(backendUrl + '/api/admin/appointments', {headers:{aToken}})

            if(data.success){
                setAppointments(data.appointments)
                // console.log(data.appointments);
                
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllReports = async () => {
        try {
            
            const {data} = await axios.get(backendUrl + '/api/admin/reports', {headers:{aToken}})

            if(data.success){
                setReports(data.reports)
                console.log(data.reports);
                
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId)=>{

        try {
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment', {appointmentId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllAppointments()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    const cancelReport = async (reportId)=>{

        try {
            const {data} = await axios.post(backendUrl + '/api/admin/cancel-report', {reportId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllReports()
                getDashData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }

    }

    const getDashData = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/admin/dashboard', {headers:{aToken}})
            if(data.success){
                setDashData(data.dashData)
                // console.log(data.dashData);
                
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const removeUser = async (userId)=>{
        try {

            const {data} = await axios.post(backendUrl+'/api/admin/delete-user', {userId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllUsers()
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const removeDoctor = async (docId)=>{
        try {

            const {data} = await axios.post(backendUrl+'/api/admin/delete-doctor', {docId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const removeDepartment = async(depId)=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/delete-department', {depId}, {headers:{aToken}})
            if(data.success){
                toast.success(data.message)
                getAllDepartments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const removeSymptom = async(dep, symptom)=>{
        try {
            const formData = {
                dep: dep,
                symptom: symptom
            }

            const {data} = await axios.post(backendUrl+'/api/admin/delete-symptom', formData, {headers:{aToken}})
            
            if(data.success){
                toast.success(data.message)
                getAllDepartments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors, getAllDoctors,
        changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        dashData, getDashData,
        users, setUsers,
        getAllUsers,
        removeUser,
        removeDoctor,
        departments, setDepartments,
        getAllDepartments,
        removeDepartment,
        removeSymptom,
        reports, setReports,
        getAllReports,
        cancelReport
    }


    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
    
}

export default AdminContextProvider