import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')

    const [appointments, setAppointments] = useState([])

    const [dashData, setDashData] = useState(false)

    const [profileData, setProfileData] = useState(false)

    const [reports, setReports] = useState([])

    const [docReports, setDocReports] = useState([])

    const getAppointments = async ()=>{
        try {
            const {data} = await axios.get(backendUrl + '/api/doctor/appointments', {headers:{dToken}})
            if(data.success){
                setAppointments(data.appointments)
                // console.log(data.appointments);
                
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId)=>{
        try {
            
            const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment', {appointmentId}, {headers:{dToken}})
            
            if(data.success){
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId)=>{
        try {
            
            const {data} = await axios.post(backendUrl + '/api/doctor/cancel-appointment', {appointmentId}, {headers:{dToken}})
            
            if(data.success){
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getDashData = async ()=>{
        try {
            
            const {data} = await axios.get(backendUrl+'/api/doctor/dashboard', {headers:{dToken}})
            if(data.success){
                setDashData(data.dashData)
                // console.log(data.dashData);
                
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getProfileData = async ()=>{
        try {

            const {data} = await axios.get(backendUrl+'/api/doctor/profile', {headers:{dToken}})
            if(data.success){
                setProfileData(data.profileData)
                // console.log(data.profileData);   
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getAllReports = async ()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/all-reports', {headers:{dToken}})
            if(data.success){
                setReports(data.reports)
                // console.log(data.reports);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getDocReports = async ()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/doctor-reports', {headers:{dToken}})
            if(data.success){
                setDocReports(data.reports)
                console.log(data.reports)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const cancelReport = async (reportId)=>{
        try {
            
            const {data} = await axios.post(backendUrl + '/api/doctor/cancel-report', {reportId}, {headers:{dToken}})
            
            if(data.success){
                toast.success(data.message)
                getDocReports()
                getAllReports()
            } else {
                toast.error(data.message)
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const completeReport = async (reportId)=>{
        try {
            
            const {data} = await axios.post(backendUrl + '/api/doctor/complete-report', {reportId}, {headers:{dToken}})
            
            if(data.success){
                toast.success(data.message)
                getDocReports()
                getAllReports()
            } else {
                toast.error(data.message)
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }


    const value = {
        dToken, setDToken,
        backendUrl,
        appointments, setAppointments,
        getAppointments,
        completeAppointment,
        cancelAppointment,
        dashData, setDashData,
        getDashData,
        profileData, setProfileData,
        getProfileData,
        reports, setReports,
        getAllReports,
        docReports, setDocReports,
        getDocReports,
        cancelReport,
        completeReport
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
    
}

export default DoctorContextProvider