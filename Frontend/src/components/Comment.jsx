import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import {useSelector} from 'react-redux'
import { FaThumbsUp } from 'react-icons/fa'
import moment from 'moment'

const Comment = ({ comment }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setuser] = useState(null)
  const [isEditing, setisEditing] = useState(false)
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`/api/user/${comment.userId}`);
        if (response.data.success) {
          setuser(response.data.user);
        }        
        else {
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    getUser();
  }, [comment])
  
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user?.profilePicture}
          alt={user?.username}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className='text-gray-500 pb-2'>{comment.content}</p>
        {/* {isEditing ? (
          <>
            <Textarea
              className='mb-2'
            />
            <div className='flex justify-end gap-2 text-xs'>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
              >
                Save
              </Button>
              <Button
                type='button'
                size='sm'
                gradientDuoTone='purpleToBlue'
                outline
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
          
            <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
              <button
                type='button'
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  '!text-blue-500'
                }`}
              >
                <FaThumbsUp className='text-sm' />
              </button>
              <p className='text-gray-400'>
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    ' ' +
                    (comment.numberOfLikes === 1 ? 'like' : 'likes')}
              </p>
              {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                  <>
                    <button
                      type='button'
                      className='text-gray-400 hover:text-blue-500'
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                    
                      className='text-gray-400 hover:text-red-500'
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )} */}
      </div>
    </div>
  )
}

export default Comment