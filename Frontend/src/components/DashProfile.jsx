import { Button, TextInput } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const handleChange = () => {
    
  }
  return (
    <div className="mx-auto p-3 w-full">
      <h1 className="text-2xl text-center font-semibold mb-4">Profile</h1>
      <form className="flex w-full flex-col items-center justify-center">
        <div className="w-32 h-32 cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          />
        </div>
        <TextInput
          type='text'
          id='username'
          placeholder='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
           className="w-[300px] mt-2"
        />
        <TextInput
          type='email'
          id='email'
          placeholder='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="w-[300px] mt-2"
        />
        <TextInput
          type='password'
          id='password'
          placeholder='password'
          onChange={handleChange}
           className="w-[300px] mt-2"
        />
        <Button
          type='submit'
          gradientDuoTone='purpleToBlue'
          outline
          className="w-[300px] mt-2"
        >
          Update
        </Button>
      <div className='text-red-500 w-[300px] flex justify-between mt-5'>
        <span className='cursor-pointer'>
          Delete Account
        </span>
        <span className='cursor-pointer'>
          Sign Out
        </span>
      </div>
      </form>
    </div>
  );
};

export default DashProfile;
