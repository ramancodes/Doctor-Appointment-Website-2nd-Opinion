import React, { useState } from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from 'react-toastify'
import { assets } from '../../assets/assets'
import DoctorAcceptedReports from "../../components/DoctorAcceptedReports";
import axios from 'axios'


const DoctorReports = () => {

    const {dToken, backendUrl, reports, getAllReports, getDocReports} = useContext(DoctorContext)
    const {slotDateFormat, calculateAge} = useContext(AppContext)

    const acceptReport = async (reportId)=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/doctor/accept-report', {reportId}, {headers:{dToken}})
            if(data.success){
                toast.success(data.message)
                getAllReports()
                getDocReports()
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        getAllReports()
    }, [dToken])

    return (
        <div className='w-full max-w-6xl m-5'>
            <DoctorAcceptedReports />

            <p className='mt-3 mb-3 text-lg font-medium'>All Reports</p>

            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>

                <div className='max-sm:hidden grid grid-cols-[0.5fr_2.5fr_1fr_3fr_2.5fr_2.5fr_2.5fr_1fr] gap-1 py-3 px-6 border-b'>
                <p>#</p>
                <p>Patient</p>
                <p>Age</p>
                <p className="text-center">Symptoms</p>
                <p>Posted Date & Time</p>
                <p>Accepted Date & Time</p>
                <p>Completed Date & Time</p>
                <p>Accept</p>
                </div>

                {
                    reports.map((item, index)=>(
                        <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2.5fr_1fr_3fr_2.5fr_2.5fr_2.5fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
                            <p className='max-sm:hidden'>{index+1}</p>
                            <div className='flex items-center gap-2'>
                                <img className='w-8 rounded-full' src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
                            </div>
                            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
                            <div className='flex flex-wrap'>
                                {
                                    item.symptoms.map((itm, idx)=>(
                                    <p key={idx} className='text-sm text-gray-500 pr-1 py-1'>{itm},</p> 
                                    ))
                                }
                            </div>

                            <p>{item.appliedDate ? `${slotDateFormat(item.appliedDate)}, ${item.appliedTime}` : 'Not Available'}</p> 
                            <p>{item.acceptedDate ? `${slotDateFormat(item.acceptedDate)}, ${item.acceptedTime}` : 'Not Available'}</p> 
                            <p>{item.completedDate ? `${slotDateFormat(item.completedDate)}, ${item.completedTime}` : 'Not Completed'}</p>
                            {
                                item.cancelled
                                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                                : item.isCompleted 
                                ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                                : item.docId
                                ? <p className='text-gray-500 text-xs font-medium'>Accepted</p>
                                : <div className='flex'>
                                    <img onClick={()=>acceptReport(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                                    </div>
                            }
                        </div>
                    ))
                }
            </div>

        </div>
    )
}

export default DoctorReports