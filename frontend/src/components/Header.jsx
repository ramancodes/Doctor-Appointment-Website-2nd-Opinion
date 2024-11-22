import React from 'react'

const Header = () => {

    const header_img = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732230243/header_img_vslvkc.png'
    const group_profiles = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732230242/group_profiles_pt6bum.png'
    const arrow_icon = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732231523/arrow_icon_z237lb.svg'

  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
        {/*---------------Left Side--------------*/}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
            <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                Book Appointment <br /> With Trusted Doctors
            </p>
            <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                <img className='w-28' src={group_profiles} alt="" />
                <p>Whether it is an appointment, a second opinion or a follow up <br className='hidden sm:block'/> question, simply browse through our extensive list of trusted <br className='hidden sm:block'/> doctors, schdule your appointment hassle-free.</p>
            </div>
            <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
                Book Appointment  <img className='w-3' src={arrow_icon} alt="" />
            </a>
        </div>
        {/*---------------Right Side--------------*/}
        <div className='md:w-1/2 relative'>
            <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={header_img} alt="" />
        </div>
    </div>
  )
}

export default Header