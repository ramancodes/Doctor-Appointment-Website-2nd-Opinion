import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'

const Departments = () => {

    const [depImg, setDepImg] = useState(false)
    const [dep, setDep] = useState('')

    const {aToken, departments, getAllDepartments, backendUrl, removeDepartment} = useContext(AdminContext)

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
                setDepImg(false)
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
        <form onSubmit={addDepartment} className='border border-gray-2 rounded bg-white mr-8'>

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

        {/* All departments */}
        <p className='mt-3 mb-3 text-lg font-medium'>Departments</p>
        <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
          {
            departments.map((item, index)=>(
              <div className='flex flex-col justify-center border border-indigo-200 rounded-xl max-w-40 overflow-hidden cursor-pointer group' key={index}>
                <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500 px-2 py-2' src={item.image} alt="" />
                <div className='p-4'>
                  <p className='text-neutral-800 text-sm font-medium text-center'>{item.speciality}</p>
                  <button onClick={()=>removeDepartment(item.speciality)} className='text-neutral-800 w-full px-8 py-2 mt-4 border border-gray-2 rounded-full hover:bg-red-600 hover:text-white transition-all'>Remove</button>
                </div>
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default Departments