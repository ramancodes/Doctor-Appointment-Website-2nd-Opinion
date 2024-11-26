import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const DoctorsList = () => {

  const {doctors, aToken, getAllDoctors, changeAvailability, removeDoctor} = useContext(AdminContext)
  const {currency} = useContext(AppContext)

  useEffect(()=>{
    if(aToken){
      getAllDoctors()
    }
  },[aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
        <h1 className='text-lg font-medium'>All Doctors</h1>
        <div className=' w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
          {
            doctors.map((item, index)=>(
              <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
                <div className='p-4'>
                  <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                  <p className='text-zinc-600 text-sm'>{item.speciality}</p>
                  <p className='text-zinc-500 text-sm mb-2 font-medium'>{item.email}</p>
                  <p className='text-zinc-600 text-sm'>Degree:<span className='px-2 text-zinc-500'>{item.degree}</span></p>
                  <p className='text-zinc-600 text-sm'>Experience:<span className='px-2 text-zinc-500'>{item.experience}</span></p>
                  <p className='text-zinc-600 text-sm'>Fees:<span className='px-2 text-zinc-500'>{currency} {item.fees}</span></p>
                  <div className='flex'>
                    <p className='text-zinc-600 text-sm'>Address:</p>
                    <div className='px-2 text-zinc-500 text-xs py-1'>
                      <p>{item.address.line1}</p>
                      <p>{item.address.line2}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className='mt-2 flex items-center gap-1 text-sm cursor-pointer hover:text-primary' htmlFor={item.email}>
                      <input type="checkbox" checked={item.isAvailable} onChange={()=>changeAvailability(item._id)} id={item.email}/>
                      <p>Available</p>
                    </label>
                  </div>
                  <button onClick={()=>removeDoctor(item.email)} className='text-neutral-800 w-full px-10 py-3 mt-4 border border-gray-2 rounded-full hover:bg-red-600 hover:text-white transition-all'>Remove</button>
                </div>
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default DoctorsList