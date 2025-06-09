import { Button, TextInput } from "flowbite-react";
import React, { useState, useRef, useEffect } from "react";
import { useSelector ,useDispatch} from "react-redux";
import axios from 'axios'
import {toast} from 'react-toastify'
import { updateStart,updateFailure,updateSuccess } from "../redux/user/userSlice";

const DashProfile = () => {
  const dispatch = useDispatch();
  const { currentUser,error } = useSelector((state) => state.user);
  const [imageFile, setimageFile] = useState(null);
  const [imageFileUrl, setimageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [formData, setformData] = useState({})
  

  const handleChange = (e) => {
    setformData(prev => ({ ...prev, [e.target.id]: e.target.value })) 
    // setformData({...formData,[e.target.id]:e.target.value})
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setimageFile(file);
      setimageFileUrl(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && Object.keys(formData).length === 0) return;
  
    try {
      dispatch(updateStart());
  
      const data = new FormData();
      if (imageFile) data.append("profilePicture", imageFile); 
      for (const key in formData) {
        data.append(key, formData[key]);
      }
  
      const response = await axios.put(`/api/user/update/${currentUser._id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (!response.data.success) {
        dispatch(updateFailure(response.data.message));
        toast.error(response.data.message);
      } else {
        dispatch(updateSuccess(response.data.rest));
        toast.success(response.data.message);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error(error.message);
    }
  };
  
  
  const uploadImage = async () => {
    localStorage.setItem("imageFileUrl", imageFileUrl);
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);
  useEffect(() => {
    const imageUrlFromLocalStorage = localStorage.getItem("imageFileUrl");
    if (imageUrlFromLocalStorage) {
      setimageFileUrl(imageUrlFromLocalStorage);
    }
  }, []);


  return (
    <div className="mx-auto p-3 w-full">
      <h1 className="text-2xl text-center font-semibold mb-4">Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center justify-center">
        <input
          hidden
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          name="image"
          
        />

        <div
          onClick={() => filePickerRef.current.click()}
          className="w-32 h-32 cursor-pointer shadow-md overflow-hidden rounded-full relative"
        >
         
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          className="w-[300px] mt-2"
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="w-[300px] mt-2"
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
          className="w-[300px] mt-2"
        />
        <Button type="submit" outline className="w-[300px] mt-2">
          Update
        </Button>
        <div className="text-red-500 w-[300px] flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
};

export default DashProfile;
