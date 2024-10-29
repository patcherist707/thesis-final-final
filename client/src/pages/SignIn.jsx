import React from "react";
import {Button, Label, TextInput, Alert, Spinner} from 'flowbite-react';
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { HiMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen mt-20'>
      <div className="p-10 max-w-md gap-5 mx-auto rounded-3xl">
        <form className='flex flex-col gap-4 ' onSubmit={handleSubmit}>
          <div>
            <Label value='Enter email' className='text-base'/>
            <TextInput type='email' placeholder='Email' id='email' rightIcon={HiMail} onChange={handleChange}/>
          </div>
          <div>
            <Label value='Enter password' className='text-base'/>
            <TextInput type='password' placeholder='Password' id='password' rightIcon={RiLockPasswordLine} onChange={handleChange}/>
          </div>
          <Button gradientDuoTone={'greenToBlue'} className='mt-4' type='submit' disabled={loading}>
            {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </>
              ) : (
                'Sign In'
            )}
          </Button>
        </form>
        <div className='flex gap-2 text-sm mt-5'>
          <span>Don't have an account?</span>
          <Link to={'/sign-up'} className='text-blue-500'>
            Sign Up
          </Link>
        </div>
        <div className='mt-5'>
          {errorMessage && (
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
