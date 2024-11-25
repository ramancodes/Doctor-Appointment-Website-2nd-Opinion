import React from 'react'
import { useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import {toast} from 'react-toastify'
import { useContext } from 'react'

const AddSymptom = () => {

    const [depId, setDepId] = useState('')
    const [symptom, setSymptom] = useState('')

    const {aToken, departments, getAllDepartments, backendUrl} = useContext(AdminContext)

    // Add new symptom
    const addNewSymptom = async (event)=>{
        event.preventDefault()

        try {
            // console.log(depId, symptom);
            const formData1 = {
                dep: depId,
                symptom: symptom
            }
            // console.log(formData1);
            

            const { data } = await axios.post(backendUrl + '/api/admin/add-symptom', formData1, { headers: { aToken } })

            if(data.success){
                getAllDepartments()
                toast.success(data.message)
                setDepId('')
                setSymptom('')
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }


  return (
    <div>
        {/* Add New Symptom */}
        <p className='mt-3 mb-3 text-lg font-medium'>Add New Symptom</p>
        <form onSubmit={addNewSymptom} className='border border-gray-2 rounded bg-white mr-10'>

            <div className='flex m-5 gap-4 justify-between items-center'>
                <div className='flex items-center gap-4 text-gray-500 px-4'>
                <p>Department Name</p>
                <select onChange={(e)=>setDepId(e.target.value)} value={depId} className='border rounded px-3 py-2' name="" id="">
                    <option value="">Not Selected</option>
                    {departments.map((item, index)=>(
                        <option key={index} value={item.speciality}>{item.speciality}</option>
                    ))}
                </select>
                </div>

                <div className='flex gap-4 items-center text-gray-500'>
                        <p>Symptom Name</p>
                        <input onChange={(e)=>setSymptom(e.target.value)} value={symptom} className='border rounded px-3 py-2' type="text" placeholder='Symptom' required />
                </div>

                <button type='submit' className='bg-primary text-white px-10 py-3 rounded-full'>Add Symptom</button>
            </div>
        </form>
    </div>
  )
}

export default AddSymptom