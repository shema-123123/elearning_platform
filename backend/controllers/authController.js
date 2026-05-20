const User = require('../models/User');
const jwt = require('jsonwebtoken');
const generateToken = (user) => {
      return jwt.sign(    { id: user._id, email: user.email, role: user.role, name: user.name },   
         process.env.JWT_SECRET,    { expiresIn: '7d' }  );};
         const register = async (req, res) => {  
            try {   
                 const { name, email, password, role } = req.body;
                         // Check if user exists   
                 const existingUser = await User.findOne({ email }); 
                    if (existingUser) {   
                           return res.status(400).json({ message: 'User already exists' });    } 
                                  // Create user    
                    const user = new User({ name, email, password, role: role || 'viewer' });   
                     await user.save();   
                          const token = generateToken(user);    
                          res.status(201).json({      message: 'User created successfully',      token,      user: { id: user._id, name: user.name, email: user.email, role: user.role }    });  } 
                          catch (error) {    
                            res.status(500).json({ message: 'Server error', error: error.message });  }};
const login = async (req, res) => {
                                  try { 
                                       const { email, password } = req.body;   
                                            const user = await User.findOne({ email });   
                                             if (!user) {      
                                                return res.status(401).json({ message: 'Invalid credentials' });    }
                                                        const isMatch = await user.comparePassword(password);  
                                                          if (!isMatch) {    
                                                              return res.status(401).json({ message: 'Invalid credentials' });    }     
                                                                 const token = generateToken(user);  
                                                                   res.json({      message: 'Login successful',      token,      user: { id: user._id, name: user.name, email: user.email, role: user.role }    });
                                                                  } 
                                                                  catch (error) {    
                                                                    res.status(500).json({ message: 'Server error', error: error.message });  }};
const getMe = async (req, res) => {  
                                     try {    
                                             const user = await User.findById(req.user.id).select('-password');    
                                            res.json(user);  } 
                                             catch (error) {   
                                              res.status(500).json({ message: 'Server error' });  }};
module.exports = { register, login, getMe };