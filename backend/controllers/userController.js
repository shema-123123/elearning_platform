const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const getUsers = async (req, res) => {  
    try {    
        const users = await User.find().select('-password');    
        res.json(users);  } 
        catch (error) {    
            res.status(500).json({ message: 'Server error' });  }};
           
           
 const updateUserRole = async (req, res) => {  
                try {    
                    const { role } = req.body;    
                    const user = await User.findByIdAndUpdate(      req.params.id,      { role },      { new: true }    ).select('-password');        
                    if (!user) {      
                        return res.status(404).json({ message: 'User not found' });    }        
                        await ActivityLog.create({      userId: req.user.id,      userName: req.user.name,      userRole: req.user.role,      action: 'UPDATE_ROLE',      entityType: 'user',      entityId: user._id,      details: { newRole: role }    });        
                        res.json({ message: 'User role updated', user });  } 
                        catch (error) {    
                            res.status(500).json({ message: 'Server error' });  }};
                            
                            
const deleteUser = async (req, res) => {  
    try {    
        const user = await User.findByIdAndDelete(req.params.id);    
        if (!user) {      
            return res.status(404).json({ message: 'User not found' });    }    
            res.json({ message: 'User deleted successfully' });  } 
            catch (error) {    
                res.status(500).json({ message: 'Server error' });  }};


                
module.exports = { getUsers, updateUserRole, deleteUser };