"use client"; 
import React, { useState, useEffect } from 'react'; // Combine imports
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import Link from 'next/link'
import { Box,TextField } from "@mui/material"
import axios from "axios";
import Notiflix from "notiflix";

const Register = () => {
  
  const [firstname,setFirstname] = useState([]);
  const [lastname,setLastname] = useState([]);
  const [email,setEmail] = useState([]);
  const [password,setPassword] = useState([]);
  const [confirmPassword,setConfirmPassword] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('http://localhost:8080/api/auth/register',
      {
        firstname: firstname,
        lastname : lastname,
        email : email,
        password : password,
        confirm_password : confirmPassword
      }
    ).then(response => {
      Notiflix.Report.success(
        'Create account success!',
        response.data.message,
        'Okay',
        () => {
          window.location.href = '/auth/login'
        }
      )
    }).catch(error => {
      Notiflix.Report.failure(
        'Failed',
        error.response.data.message,
        'Okay'
      )
    })

  }

  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  const validateLoginExist = () => {
    const tokenExist = getCookieValue('jwt');
    
    if(tokenExist){
      window.location.href = '/home'
    }
  }

  useEffect(() => {
    validateLoginExist()
  },[])

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-[40rem] h-[45rem] p-12 rounded-xl bg-white shadow-2xl'>
        <div className='text-center'>
          <PersonAddAltRoundedIcon className='text-6xl text-center'/>
        </div>
        <h1 className='font-bold text-center text-2xl'>Get start</h1>
        <p className='text-center text-violet-400 mb-5'>Create your account now.</p>
          <form method='POST' onSubmit={handleSubmit} className='grid grid-cols-2 gap-x-5 gap-y-9 justify-center mb-10'>
            <div>
              <TextField 
                label="First name" 
                variant="standard" 
                type="text"
                className="w-full bg-none" 
                color="secondary" 
                InputProps={{
                  style: {
                      height: '50px'
                  },
                }}
                onChange={(e) => setFirstname(e.target.value)}
              required />
            </div>
            <div>
              <TextField 
                label="Last name" 
                variant="standard" 
                type="text"
                className="w-full bg-none" 
                color="secondary" 
                InputProps={{
                  style: {
                      height: '50px'
                  },
              }}
              onChange={(e) => setLastname(e.target.value)}
              required />
            </div>
            <div className='col-span-2'>
              <TextField 
                label="Email" 
                variant="standard" 
                type="email"
                className="w-full bg-none" 
                color="secondary" 
                InputProps={{
                  style: {
                      height: '50px' 
                  },
              }}
              onChange={(e) => setEmail(e.target.value)}
              required />
            </div>
            <div>
              <TextField 
                label="Password" 
                variant="standard" 
                type="password"
                className="w-full bg-none" 
                color="secondary" 
                InputProps={{
                  style: {
                      height: '50px' 
                  },
              }}
              onChange={(e) => setPassword(e.target.value)}
              required />
            </div>
            <div>
              <TextField 
                label="Confirm password" 
                variant="standard" 
                type="password"
                className="w-full bg-none" 
                color="secondary" 
                InputProps={{
                  style: {
                      height: '50px'  
                  },
              }}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required />
            </div>
          <div  className='flex justify-center col-span-2'>
            <button className=' w-full p-3 mb-3 rounded-full bg-violet-500 duration-300 ease-in-out hover:bg-indigo-600 text-white'>
              Create account
            </button>
          </div>
          </form>
          <div className='flex justify-center'>
          <p className='mr-1 font-semibold text-indigo-500'>You have account ?</p><Link href="/auth/login"><p className='font-semibold text-violet-600 duration-300 ease-in-out hover:text-indigo-300'>Login</p>
          </Link>
          </div>
      </div>
    </div>
)
}     

export default Register;
