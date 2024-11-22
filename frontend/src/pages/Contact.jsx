import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Contact = () => {
  const contact_image = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732230233/contact_image_pc94an.png'

  const {phone, email, officeAddress} = useContext(AppContext)
  const navigate = useNavigate()
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500'>
          <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
        </div>

        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
          <img className='w-full md:max-w-[360px]' src={contact_image} alt="" />

          <div className='flex flex-col justify-center items-start gap-6'>
            <p className='font-semibold text-lg text-gray-600'>Our OFFICE</p>
            <p className='text-gray-500'>{officeAddress}</p>
            <p className='font-semibold text-lg text-gray-600'>Contact</p>
            <p className='text-gray-500'>Tel: {phone} <br /> Email: {email}</p>
            <p className='font-semibold text-lg text-gray-600'>Learn More About Us</p>
            <button onClick={()=>navigate('/about')} className='border border-black px-10 py-4 text-sm font-semibold hover:bg-black hover:text-white transition-all duration-500'>About Us</button>
          </div>
        </div>

        <div className='text-xl my-4 text-center'>
          <p>LEAVE US A <span className='text-gray-700 font-semibold'>MESSAGE</span></p>
        </div>

        <div className='flex justify-center'>
          <p>Message Form: Under Construction</p>
        </div>
    </div>
  )
}

export default Contact;