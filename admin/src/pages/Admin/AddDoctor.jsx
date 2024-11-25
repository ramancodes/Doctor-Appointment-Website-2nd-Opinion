import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import {toast} from 'react-toastify'
import axios from 'axios'

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const [showInfo, setShowInfo] = useState(false)
  // const [showPassword, setShowPassword] = useState(false)

  const { backendUrl, aToken, getAllDepartments, departments} = useContext(AdminContext)

  const onSubmitHandler = async (event)=>{
    event.preventDefault()

    try{
      if(!docImg){
        return toast.error("Image Not Selected")
      }

      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', Number(fees))
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({line1:address1, line2:address2}))

      // // console log
      // formData.forEach((value, key) => {
      //   console.log(`${key}: ${value}`);      
      // });

      const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
      
      if(data.success){
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setPassword('')
        setEmail('')
        setAbout('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setFees('')
        setExperience('1 Year')
      } else {
        toast.error(data.message)
      }
      
    } catch(error){
      toast.error(error.message)
      console.log(error);
    }
  }

  useEffect(()=>{
    if(aToken){
      getAllDepartments()
    }
  },[aToken])

  return (
    <form className='m-5 w-full' onSubmit={onSubmitHandler}>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>

      <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>

        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id='doc-img' hidden/>
          <p>Upload doctor <br /> picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Name</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <div className='flex'>
                <p>Doctor Password</p> 
                <img onClick={()=>setShowInfo(!showInfo)} className='ml-2' src={assets.info_icon} alt="" /> 
                { showInfo && <p className='items-center text-xs text-gray-400 px-2 py-1'>Enter Strong Password</p>}

                  {/* { 
                    !showPassword
                      ? <img src={assets.show_password_icon} onClick={()=>setShowPassword(true)} className='px-2 py-1' alt="" />
                      : <img src={assets.hide_password_icon} onClick={()=>setShowPassword(false)} alt="" />
                  } */}

              </div>
                <input className='border px-3 py-2 rounded' type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password' required />
              <div className='flex justify-between'>
                
              </div>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2' name="" id="">
                <option value="">Not Selected</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10+ Years">10+ Years</option>
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='Fees' required />
            </div>

          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2' name="" id="">
              <option value="">Not Selected</option>
              {departments.map((item, index)=>(
                <option key={index} value={item.speciality}>{item.speciality}</option>
              ))}
              </select>
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input onChange={(e)=>setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Education' required />
            </div>

            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='Address 1' required />
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='Address 2' required />
            </div>

          </div>

        </div>

        <div>
              <p className='mt-4 mb-2'>About Doctor</p>
              <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' type="text" placeholder='Write about doctor' rows={5} required />
        </div>
        <button type='submit' className='bg-primary text-white px-10 py-3 mt-4 rounded-full'>Add Doctor</button>
      </div>
    </form>
  )
}

export default AddDoctor