import React from "react";
import { useContext } from "react";
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify'
import { DoctorContext } from "../context/DoctorContext";
import { AppContext } from "../context/AppContext";
import { useEffect } from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import axios from 'axios'

const DoctorAcceptedReports = () => {

  const cross_icon = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732231731/cross_icon_fkqsbh.svg'

    const {dToken, docReports, getDocReports, cancelReport, completeReport, backendUrl} = useContext(DoctorContext)
    const {slotDateFormat, currency} = useContext(AppContext)

    const [doctorReport, setDoctorReport] = useState(false)

    const downloadFile = async (fileUrl) => {
        try {
          const response = await fetch(fileUrl)
          const blob = await response.blob()
          saveAs(blob, 'downloaded-file.pdf')
        } catch (error) {
          console.error(error);
          toast.error('Error downloading the file:', error)
        }
    }

    const uploadReport = async (reportId)=>{
      try {

        const formData = new FormData();
        formData.append('reportId', reportId);
        doctorReport && formData.append('file', doctorReport)

        const {data} = await axios.post(backendUrl + '/api/doctor/upload-report', formData, {headers:{dToken}})
            
        if(data.success){
          toast.success(data.message)
          getDocReports()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message)
      }
    }

    const deleteReport = async (reportId)=>{
      try {
        const {data} = await axios.post(backendUrl + '/api/doctor/delete-report', {reportId}, {headers:{dToken}})
            
        if(data.success){
          toast.success(data.message)
          getDocReports()
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message)
      }
    }

    useEffect(()=>{
      getDocReports()
    }, [dToken])

  return (
    <div>

      <p className='mb-3 text-lg font-medium'>Your Accepted Reports</p>

        <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>

            <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_2fr_1fr_5fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
            <p>#</p>
            <p>Patient</p>
            <p>User Report</p>
            <p>Payment</p>
            <p className="text-center">Doctor Report</p>
            <p>Completed Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
            </div>

            {
              docReports.map((item, index)=>(
                <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_2fr_1fr_5fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
                  <p className='max-sm:hidden'>{index+1}</p>
                  <div className='flex items-center gap-2'>
                    <img className='w-8 rounded-full' src={item.userData.image} alt="" /> <p>{item.userData.name}</p>
                  </div>
                  <div className='flex-1 text-sm text-zinc-600'>
                      <button className='text-xs border border-gray-2 rounded-full px-2 py-1 mt-2 hover:bg-primary hover:text-white' onClick={()=>downloadFile(item.report)}>Download</button>
                  </div>
                  <div>
                    <p className='text-xs inline border border-primary px-2 rounded-full'>{ item.payment ? 'Paid' : 'Pending' }</p>
                  </div>

                  
                  <div className='flex text-sm text-zinc-600 justify-center items-center'>
                      {
                        !item.doctorReport && item.payment &&
                        <div className="flex flex-col gap-2 items-center justify-center">
                          <input onChange={(e)=>setDoctorReport(e.target.files[0])} type="file" id="doctor-report" className="border border-gray-2 px-2 py-2 text-xs rounded cursor-pointer hover:bg-white" />
                          <button onClick={()=>uploadReport(item._id)} className="border border-gray-2 rounded-full px-2 py-1 text-xs hover:bg-primary hover:text-white">Upload</button>
                        </div> 
                        }
                      {!item.payment && <p>Payment Pending</p>}
                      <div className="flex items-center justify-center gap-2">
                        {item.doctorReport && <button className='text-xs border border-gray-2 rounded-full px-2 py-1 mt-2 hover:bg-primary hover:text-white' onClick={()=>downloadFile(item.doctorReport)}>Download</button>}
                        {item.doctorReport && !item.isCompleted && <img onClick={()=>deleteReport(item._id)} src={cross_icon} className="w-6 py-1 px-1 mt-2 hover:bg-red-500 rounded-full" alt="" />}
                      </div>
                  </div>

                  <p>{item.completedDate ? `${slotDateFormat(item.completedDate)}, ${item.completedTime}` : 'Not Completed'}</p>
                  <p>{currency} {item.amount}</p>
                  
                  {
                    item.cancelled
                    ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                    : item.isCompleted 
                      ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                      : <div className='flex items-center justify-center'>
                          <img onClick={()=>cancelReport(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                          {item.payment && item.doctorReport && <img onClick={()=>completeReport(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />}
                        </div>
                    }
                </div>
              ))
            }
            </div>
        </div>
  )
}

export default DoctorAcceptedReports