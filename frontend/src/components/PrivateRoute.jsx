import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Contexts/AuthContext'
const PrivateRoute = ({ children }) => {  
    const { user, loading } = useAuth()    
    if (loading) {    
        return (      
        <div className="min-h-screen flex items-center justify-center">        
        <div className="text-xl">Loading...</div>      
        </div>    )  }    
        return user ? children : 
        <Navigate to="/login" />}
        
export default PrivateRoute