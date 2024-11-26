import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

const MyReports = () => {

  const question_icon = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732553552/question-mark-circle-svgrepo-com_p1hfro.svg'

  const {backendUrl, token, currencySymbol} = useContext(AppContext)

  const navigate = useNavigate()

  const [reports, setReports] = useState([])

  const months = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const slotDateFormat = (sloatDate)=>{
    const dateArray = sloatDate.split("_")
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2]
  }

  const getUserReports = async ()=>{
    try {
        const {data} = await axios.get(backendUrl + '/api/user/reports', {headers:{token}})
        if(data.success){
            setReports(data.reports)
            console.log(data.reports);
            
        } else {
            toast.error(data.message)
        }
        
    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }
}

const cancelAppointment = async (reportId) => {
  try {
    
    const {data} = await axios.post(backendUrl+'/api/user/cancel-report', {reportId}, {headers:{token}})
    if(data.success){
      toast.success(data.message)
      getUserReports()
    } else {
      toast.error(data.message)
    }
    
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}

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

const initPay = (order) => {
  const type = 'report'
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'Report Payment',
    description:'Report Payment',
    order_id: order.id,
    receipt: order.receipt,
    handler: async (response)=>{
      console.log(response)

      try {
        const {data} = await axios.post(backendUrl+'/api/user/verify-razorpay', {response, type}, {headers:{token}})
        if(data.success){
          getUserReports()
          navigate('/my-reports')
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
        
      }
      
    }
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}

const appointmentRazorpay = async (appointmentId) => {
  try {
    const type = 'report'
    const {data} = await axios.post(backendUrl+'/api/user/payment-razorpay', {appointmentId, type}, {headers:{token}})
    if(data.success){
      console.log(data.order)
      initPay(data.order)
      
    }
  } catch (error) {
    
  }
}

useEffect(()=>{
  getUserReports()
},[])

  return (
    <div>
        <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Reports</p>
      <div>
        {
          reports.map((item, index)=>(
            item.docId
            ? <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                <div>
                  <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
                </div>
                <div className='flex gap-2 w-full items-start'>
                  <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                    <p className='text-sm'>{item.docData.speciality}</p>
                    <p className='text-zinc-700 font-medium mt-1 '>Address:</p>
                    <p className='text-sm'>{item.docData.address.line1}</p>
                    <p className='text-sm'>{item.docData.address.line2}</p>
                    <p className='text-zinc-700 font-medium mt-1'>User Symptoms</p>
                    <div className='flex flex-wrap'>
                      {
                        item.symptoms.map((itm, idx)=>(
                          <p key={idx} className='text-sm text-gray-500 pr-1 py-1 border-b'>{itm},</p> 
                        ))
                      }
                    </div>
                    <p className='text-zinc-700 font-medium mt-1 text-sm'>Fees: {currencySymbol} {item.amount}</p>
                  </div>
                  <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-zinc-700 font-medium mt-1'>Download Report</p>
                    <button className='text-xs border border-gray-2 rounded-full px-2 py-1 mt-2 hover:bg-primary hover:text-white' onClick={()=>downloadFile(item.report)}>Download</button>
                    {item.doctorReport && item.payment && <p className='text-zinc-700 font-medium mt-1'>Download Doctor Report</p>}
                    {item.doctorReport && item.payment &&  <button className='text-xs border border-gray-2 rounded-full px-2 py-1 mt-2 hover:bg-primary hover:text-white' onClick={()=>downloadFile(item.doctorReport)}>Download</button>}
                  </div>
                  <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-zinc-700 font-medium mt-2'>Applied Date & Time:</p>
                    <p className='text-sm'>{item.appliedDate ? `${slotDateFormat(item.appliedDate)} | ${item.appliedTime}` : 'Not Available'}</p> 
                    <p className='text-zinc-700 font-medium mt-2'>Accepted Date & Time:</p>
                    <p className='text-sm'>{item.acceptedDate ? `${slotDateFormat(item.acceptedDate)} | ${item.acceptedTime}` : 'Not Accepted'}</p> 
                    <p className='text-zinc-700 font-medium mt-2'>Completed Date & Time:</p>
                    <p className='text-sm'>{item.completedDate ? `${slotDateFormat(item.completedDate)} | ${item.completedTime}` : 'Not Completed'}</p>
                  </div>
                </div>
                <div></div>
                <div className='flex flex-col gap-2 justify-end'>
                  { !item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button> }
                  { !item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
                  { !item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel</button>} 
                  { item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-300 rounded text-red-500'>Cancelled</button>}
                  { item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-300 rounded text-green-500'>Completed</button>}
                </div>
              </div>

            : <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
                <div>
                  <img className='w-32 bg-indigo-50' src={question_icon} alt="" />
                </div>
                <div className='flex gap-2 w-full items-start'>
                  <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-neutral-800 font-semibold'>'Not Accepted'</p>
                    <p className='text-zinc-700 font-medium mt-1'>Department</p>
                    <p className='w-max text-sm text-gray-500 pr-2 py-1'>{item.speciality}</p>
                    <p className='text-zinc-700 font-medium mt-1'>Symptoms</p>
                    <div className='flex flex-wrap'>
                      {
                        item.symptoms.map((itm, idx)=>(
                          <p key={idx} className='text-sm text-gray-500 pr-1 py-1 border-b'>{itm},</p> 
                        ))
                      }
                    </div>
                    
                  </div>
                  <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-zinc-700 font-medium mt-1'>Download Report</p>
                    <button className='text-xs border border-gray-2 rounded-full px-2 py-1 mt-2 hover:bg-primary hover:text-white' onClick={()=>downloadFile(item.report)}>Download</button>
                  </div>
                  <div className='flex-1 text-sm text-zinc-600'>
                    <p className='text-zinc-700 font-medium mt-2'>Applied Date & Time:</p>
                    <p className='text-sm'>{item.appliedDate ? `${slotDateFormat(item.appliedDate)} | ${item.appliedTime}` : 'Not Available'}</p> 
                    <p className='text-zinc-700 font-medium mt-2'>Accepted Date & Time:</p>
                    <p className='text-sm'>{item.acceptedDate ? `${slotDateFormat(item.acceptedDate)} | ${item.acceptedTime}` : 'Not Accepted'}</p> 
                    <p className='text-zinc-700 font-medium mt-2'>Completed Date & Time:</p>
                    <p className='text-sm'>{item.completedDate ? `${slotDateFormat(item.completedDate)} | ${item.completedTime}` : 'Not Completed'}</p>
                  </div>
                </div>
                <div></div>
                <div className='flex flex-col gap-2 justify-end'>
                  { !item.cancelled && !item.isCompleted && <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel</button>} 
                  { item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-300 rounded text-red-500'>Cancelled</button>}
                </div>
              </div>
          ))
        }

      </div>
    </div>
  )
}

export default MyReports