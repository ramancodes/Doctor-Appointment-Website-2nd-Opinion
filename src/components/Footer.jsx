import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate();
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* -----------------------Left Section---------------------- */}
            <div>
                <img onClick={()=>navigate('/')} className='mb-5 w-40 cursor-pointer' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>RM Care service enables patients to search for top doctors and book confirmed appointments. Whether it is a second opinion or a follow up question, why visit the doctor, when you can check with them online? </p>
            </div>

            {/* -----------------------Center Section---------------------- */}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li onClick={()=>navigate('/')} className='cursor-pointer'>Home</li>
                    <li onClick={()=>navigate('/about')} className='cursor-pointer'>About us</li>
                    <li onClick={()=>navigate('/contact')} className='cursor-pointer'>Contact us</li>
                    <li onClick={()=>navigate('/privacy-policy')} className='cursor-pointer'>Privacy policy</li>
                </ul>
            </div>

            {/* -----------------------Right Section---------------------- */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91-6204239638</li>
                    <li>ramanmanjhi01@gmail.com</li>
                </ul>
            </div>
        </div>
        <div>
            {/* --------------------------Copyright text---------------- */}
            <p className='py-5 text-sm text-center'>Copyright © 2024, Raman - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer