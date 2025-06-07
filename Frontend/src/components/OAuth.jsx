import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import {app} from '../../firebase'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {signInSuccess} from '../redux/user/userSlice'
import { useNavigate } from 'react-router';

const OAuth = () => {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const auth=getAuth(app)
  const handleGoogleClick = async () => {
    const provider= new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      
      const resultFromGoogle = await signInWithPopup(auth, provider);
      
      const response = await axios.post('/api/auth/google', {
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoUrl: resultFromGoogle.user.photoURL,
      })
      console.log(response);
      
      if (response.data.success) {
        dispath(signInSuccess(response.data));
        navigate('/')
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Button
      onClick={handleGoogleClick}
      type="button" className='text-black bg-gradient-to-l from-pink-400 to-orange-400'  ><AiFillGoogleCircle className='w-6 h-6 mr-2' /> Continue with Google</Button>
  )
}

export default OAuth