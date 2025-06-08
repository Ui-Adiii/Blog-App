import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router'
import { useNavigate } from 'react-router'
const PrivateRoute = () => {
  const navigate = useNavigate()
  const {currentUser} = useSelector((state)=>state.user)
  return currentUser ? <Outlet/> : <Navigate to={'sign-in'}/>;
}

export default PrivateRoute