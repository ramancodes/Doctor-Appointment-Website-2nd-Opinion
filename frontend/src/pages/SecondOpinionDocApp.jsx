import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const SecondOpinionDocApp = () => {

    const appointment_img = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732230233/appointment_img_eryqsz.png'
    const arrow_icon = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732231523/arrow_icon_z237lb.svg'
    const info_icon = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732232006/info_icon_u0zxmb.svg'

    const navigate = useNavigate()
    const {token, backendUrl, departments, getAllDepartments} = useContext(AppContext)

    const [department, setDepartment] = useState('')
    const [filterSymptom, setFilterSymptom] = useState([])
    const [userSymptoms, setUserSymptoms] = useState([])
    const [reportFile, setReportFile] = useState(false)
    const [showInfo, setShowInfo] = useState(false)

    const ref = useRef([]);

    const Uncheck = () => {

        console.log(ref.current.length)
        for (let i = 0; i < ref.current.length; i++) {

            ref.current[i].checked = false;
        }
    }

    
    const setValue = async (value, selectedIndex)=>{
        setDepartment(value)
        if(selectedIndex===0){
            setFilterSymptom([])
        } else {
            setFilterSymptom(departments[selectedIndex-1].symptoms)
            setUserSymptoms([])
        }
        Uncheck()
    }
    
    const addUserSymptoms = (symptom)=>{
        let userSymptomsArray = userSymptoms
        if(userSymptomsArray.includes(symptom)){
            userSymptomsArray = userSymptomsArray.filter(s=>s!==symptom)
            setUserSymptoms(userSymptomsArray)
        } else {
            userSymptomsArray.push(symptom)
            setUserSymptoms(userSymptomsArray)
        }
    }

    const bookSecondAppointment = async (event)=>{
        event.preventDefault()

        if(!token){
          toast.warn('Login to Upload Report')
          return navigate('/login')
        }

        try {

            const formData = new FormData();
            formData.append('userSymptoms', userSymptoms);
            formData.append('department', department);

            reportFile && formData.append('file', reportFile)

            const {data} = await axios.post(backendUrl + '/api/user/book-second-opinion-appointment', formData, {headers:{token}})
            
            if(data.success){
                toast.success(data.message)
                navigate('/my-reports')
              } else {
                toast.error(data.message)
              }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
        
      }

      useEffect(()=>{
        getAllDepartments()
      },[])

  return (
    <div>
        <div className='flex bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
        {/* -------------------------Left Side ----------------------- */}
        <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
            <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                <p>Get A Second Opinion</p>
                <p className='mt-4'>On Your Reports With</p>
                <p className='mt-4'>Our Experienced Doctors</p>
            </div>
            <div className='mt-6'>
                <a href='#upload-report' className='flex rounded-full bg-white w-max px-6 py-3 gap-2 hover:scale-105 transition-all duration-200 text-gray-600 text-sm'>
                    Upload Your Report <img className='w-3' src={arrow_icon} alt="" />
                </a>
            </div>
        </div>

        {/* -------------------------Right Side ----------------------- */}
        <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
            <img className='w-full absolute bottom-0 right-0 max-w-md' src={appointment_img} alt="" />
        </div>
    </div>

    <div id='upload-report' className='py-2'>

    </div>
        {/* --------------------------Upload Section---------------------------------- */}
        <form className='m-5 w-full' onSubmit={bookSecondAppointment}>
        <p className='mb-4 text-2xl font-medium text-gray-600'>Upload Your Report</p>

        <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

            <div className='flex flex-col items-start gap-4 mb-8 text-gray-500'>
                <div className='flex items-center'>
                    <p className='text-lg'>Upload file</p> 
                    <img onClick={()=>setShowInfo(!showInfo)} className='ml-2' src={info_icon} alt="" />
                    { showInfo && <p className='items-center text-xs text-gray-400 px-2'>Only pdf file supported</p>}
                </div>
                
                <input onChange={(e)=>setReportFile(e.target.files[0])} type="file" required />
            </div>

            <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                <div className='w-full lg:flex-1 flex flex-col gap-4 text-gray-500'>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p className='text-lg py-2'>Select department</p>
                        <select onChange={(e)=>setValue(e.target.value, e.target.selectedIndex)} value={department} className='border rounded px-3 py-2 w-max' name="" id="">
                            <option value="">Not Selected</option>
                            {departments.map((item, index)=>(
                                <option key={index} value={item.speciality}>{item.speciality}</option>
                            ))}
                        </select>
                    </div>

                    <div className='flex-1 flex flex-col gap-1'>
                        <p className='text-lg py-2'>Select Symptoms</p>
                        <div className='flex flex-wrap gap-4'>
                            {
                                filterSymptom[0]
                                ? filterSymptom.map((item, index)=>(
                                    <label htmlFor={index} className='flex flex-wrap gap-2 border border-gray-2 rounded-full px-3 py-2 hover:scale-105 transition-all duration-200'>
                                        <input ref={(element) => { ref.current[index] = element }} onChange={(e)=>addUserSymptoms(e.target.value)} key={index} type="checkbox" className='px-3 py-2' value={item} class="symptoms-checkbox" id={index}/>
                                        <p>{item}</p>
                                    </label>
                                ))
                                : <p className='font-medium text-sm'>No Symptoms Available</p>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <button type='submit' className='bg-primary text-white px-10 py-3 mt-10 rounded-full'>Upload</button>
        </div>
        </form>
    </div>
  )
}

export default SecondOpinionDocApp