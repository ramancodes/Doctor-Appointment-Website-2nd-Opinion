import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';

const Footer = () => {
    const logo = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732230244/logo_zeknik.svg'
    const navigate = useNavigate();
    const {phone, email, officeAddress} = useContext(AppContext)
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* -----------------------Left Section---------------------- */}
            <div>
                <img onClick={()=>navigate('/')} className='mb-5 w-40 cursor-pointer' src={logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>RM Care service enables patients to search for top doctors and book confirmed appointments. Whether it is a second opinion or a follow up question, why visit the doctor, when you can check with them online? </p>
            </div>

            {/* -----------------------Center Section---------------------- */}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li onClick={()=>{navigate('/'); scrollTo(0,0) }} className='cursor-pointer'>Home</li>
                    <li onClick={()=>{navigate('/about'); scrollTo(0,0) }} className='cursor-pointer'>About us</li>
                    <li onClick={()=>{navigate('/contact'); scrollTo(0,0) }} className='cursor-pointer'>Contact us</li>
                    <li onClick={()=>{navigate('/privacy-policy'); scrollTo(0,0) }} className='cursor-pointer'>Privacy policy</li>
                </ul>
            </div>

            {/* -----------------------Right Section---------------------- */}
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>{phone}</li>
                    <li>{email}</li>
                    <li>{officeAddress}</li>
                    <li onClick={()=>{navigate('/about-developer'); scrollTo(0,0) }} className='cursor-pointer'>About Developer</li>
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