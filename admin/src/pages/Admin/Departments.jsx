import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import AddSymptom from '../../components/AddSymptom.jsx'

const Departments = () => {

  const cross_icon = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732231731/cross_icon_fkqsbh.svg'

    const [depImg, setDepImg] = useState(false)
    const [dep, setDep] = useState('')

    const {aToken, departments, getAllDepartments, backendUrl, removeDepartment, removeSymptom} = useContext(AdminContext)

    // Add new department
    const addDepartment = async (event)=>{
        event.preventDefault()

        try {
            if(!depImg){
                return toast.error("Image Not Selected")
            }

            const formData = new FormData()
            formData.append('image', depImg)
            formData.append('speciality', dep)

            const { data } = await axios.post(backendUrl + '/api/admin/add-department', formData, { headers: { aToken } })

            if(data.success){
                getAllDepartments()
                toast.success(data.message)
                setDepImg('')
                setDep('')
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    useEffect(()=>{
        if(aToken){
            getAllDepartments()
        }
    }, [aToken])

  return (
    <div className='m-5 w-full'>
        {/* Add New Department */}
        <p className='mb-3 text-lg font-medium'>Add New Department</p>
        <form onSubmit={addDepartment} className='border border-gray-2 rounded bg-white mr-10'>

            <div className='flex m-5 gap-4 justify-between items-center'>
                <div className='flex items-center gap-4 text-gray-500 px-4'>
                    <label htmlFor="dep-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={depImg? URL.createObjectURL(depImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e)=>setDepImg(e.target.files[0])} type="file" id='dep-img' hidden/>
                    <p>Upload Department <br /> icon</p>
                </div>

                <div className='flex gap-4 items-center text-gray-500'>
                        <p>Department Name</p>
                        <input onChange={(e)=>setDep(e.target.value)} value={dep} className='border rounded px-3 py-2' type="text" placeholder='Department' required />
                </div>

                <button type='submit' className='bg-primary text-white px-10 py-3 rounded-full'>Add Department</button>
            </div>
        </form>

        <AddSymptom />

        {/* All departments */}
        <p className='mt-3 mb-4 text-lg font-medium'>Departments</p>

        <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll mr-10'>
          <div className='hidden sm:grid grid-cols-[0.5fr_2fr_5fr_2fr] grid-flow-col py-3 px-6 border-b'>
            <p>#</p>
            <p>Department</p>
            <p>Symptoms</p>
            <p>Action</p>
          </div>
          {
            departments.map((item, index)=>(
              <div key={index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_5fr_2fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'>
                <p className='max-sm:hidden'>{index+1}</p>
                <div className='flex items-center gap-2'>
                  <img className='w-8 rounded-full bg-gray-200' src={item.image} alt="" /> <p>{item.speciality}</p>
                </div>
                <div className='flex gap-2 flex-wrap'>
                  {
                    item.symptoms.map((itm, idx)=>(
                      <div key={idx} className={`flex justify-center items-center px-2 py-1 border rounded-full text-start border-gray-2 hover:px-4`}>
                        <p className='text-xs'>{itm}</p>
                        <img onClick={()=>removeSymptom(item.speciality, itm)} className='w-4 ml-1 hover:bg-red-500 rounded-full' src={cross_icon} alt="" />
                      </div>
                    ))
                  }
                </div>
                <button onClick={()=>removeDepartment(item.speciality)} className='w-36 text-neutral-800 px-8 py-2 mt-4 border border-gray-2 rounded-full hover:bg-red-600 hover:text-white transition-all'>Remove</button>
                
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default Departments