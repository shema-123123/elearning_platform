import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import api from '../../api/api'
const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)
export const AuthProvider = ({ children }) => {  
    const [user, setUser] = useState(null)  
    const [loading, setLoading] = useState(true)  
    const [token, setToken] = useState(localStorage.getItem('token'))  
    
 useEffect(() => {    
        if (token) {     
             axios.defaults.headers.common['Authorization'] = `Bearer ${token}`      
             fetchUser()    
            } else {      
                setLoading(false)    }  }, [token])  
const fetchUser = async () => {    
                    try {      
                        const response = await api.get('api/auth/me')      
                        setUser(response.data)    } 
                        catch (error) {      
                            console.error('Failed to fetch user:', error)      
                            logout()    
                        } 
                        finally 
                        {      
                            setLoading(false)    }  }  
    const login = async (email, password) => {    
        try {      
                                    const response = await api.post('api/auth/login', { email, password })      
                                    const { token, user } = response.data      
                                    localStorage.setItem('token', token)      
                                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`      
                                    setToken(token)      
                                    setUser(user)      
                                    toast.success('Login successful!')      
                                    return true    } 
    catch (error) {      
                                        toast.error(error.response?.data?.message || 'Login failed')      
                                        return false    }  }  
                                        const logout = () => {    
                                            localStorage.removeItem('token')    
                                            delete axios.defaults.headers.common['Authorization']    
                                            setToken(null)    
                                            setUser(null)    
                                            toast.success('Logged out successfully')  }  
                                            const value = {    user,    login,    logout,    loading,    isAdmin: user?.role === 'admin',    isManager: user?.role === 'manager' || user?.role === 'admin',    isViewer: user?.role === 'viewer'  }  
                            
                                            return (    


<AuthContext.Provider value={value}>      {children}    </AuthContext.Provider>  )}

export default AuthProvider;
