import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const info_icon = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732232006/info_icon_u0zxmb.svg'

  const {backendUrl, token, setToken} = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setState] = useState('Login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const [showInfo, setShowInfo] = useState(false)

  const onSubmitHandler = async (event)=>{
    event.preventDefault()

    try {
      if(state==='Sign Up'){
        const {data} = await axios.post(backendUrl+'/api/user/register', {name, password, email})
        if(data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)        
        }else{
          toast.error(data.message)
        }

      }else{

        const {data} = await axios.post(backendUrl+'/api/user/login', {password, email})
        if(data.success) {
          localStorage.setItem('token',data.token)
          setToken(data.token)        
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
     toast.error(error.message) 
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <form action="" className='min-h-[80vh] flex items-center' onSubmit={onSubmitHandler}>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'login'} to book appointment</p>
        {
          state === 'Sign Up' && 
          <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setName(e.target.value)} value={name} required />
          </div>
        }
        
        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e)=>setEmail(e.target.value)} value={email} required />
        </div>
        <div className='w-full'>
          <div className='flex py-1'>
            <p>Password</p>
            {state === 'Sign Up' && <img onClick={()=>setShowInfo(!showInfo)} className='ml-2' src={info_icon} alt="" />} 
            { showInfo && <p className='items-center text-xs text-gray-400 px-2'>Enter Strong Password</p>}
          </div>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e)=>setPassword(e.target.value)} value={password} required />
        </div>
        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</button>
        {
          state === 'Sign Up'
          ? <p>Already have an account? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Login')}>Login here</span></p>
          : <p>Create a new account? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Sign Up')}>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login