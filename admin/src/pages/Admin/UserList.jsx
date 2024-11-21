import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const UserList = () => {

    const {users, aToken, getAllUsers, removeUser} = useContext(AdminContext)

    useEffect(()=>{
        if(aToken){
          getAllUsers()
        }
      },[aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
        <h1 className='text-lg font-medium'>All Users</h1>
        <div className=' w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
          {
            users.map((item, index)=>(
              <div className='border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                <img className='bg-indigo-50 group-hover:bg-primary transition-all duration-500' src={item.image} alt="" />
                <div className='p-4'>
                  <p className='text-neutral-800 text-lg font-medium'>{item.name}</p>
                  <p className='text-zinc-600 text-sm font-medium'>{item.email}</p>
                  <p className='text-zinc-600 text-sm'>Contact:<span className='px-2 text-zinc-500'>{item.phone}</span></p>
                  <p className='text-zinc-600 text-sm'>DOB:<span className='px-2 text-zinc-500'>{item.dob}</span></p>
                  <p className='text-zinc-600 text-sm'>Gender:<span className='px-2 text-zinc-500'>{item.gender}</span></p>
                  <div className='flex text-zinc-600 text-sm'>
                    <p>Address:</p>
                    <div className='px-2 text-zinc-500 text-xs py-1'>
                      <p>{item.address.line1==='' ? 'Not Provided' : item.address.line1}</p>
                      <p>{item.address.line2==='' ? '' : item.address.line2}</p>
                    </div>
                  </div>
                  <button onClick={()=>removeUser(item.email)} className='text-neutral-800 w-full px-10 py-3 mt-4 border border-gray-2 rounded-full hover:bg-red-600 hover:text-white transition-all'>Remove</button>
                  
                </div>
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default UserList