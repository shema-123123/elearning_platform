const SparePart = require('../models/SparePart');
const ActivityLog = require('../models/ActivityLog');
const createSparePart = async (req, res) => {
      try {    
        const { name, category, quantity, unitPrice } = req.body;     
           const sparePart = new SparePart({  
                name,   
                   category,      
                   quantity: quantity || 0,      
                   unitPrice    }); 
                      await sparePart.save();     
                         // Log activity  
                           await ActivityLog.create({   
                               userId: req.user.id,    
                                 userName: req.user.name,  
                                     userRole: req.user.role,  
                                         action: 'CREATE',    
                                           entityType: 'spare_part',     
                                            entityId: sparePart._id,      
                                            details: { name, category, quantity, unitPrice }    });   
                                                 res.status(201).json({ message: 'Spare part created', sparePart });  } 
                                                 catch (error) {    
                                                    res.status(500).json({ message: 'Server error', error: error.message });  }};
const getSpareParts = async (req, res) => {  
    try {    
        const spareParts = await SparePart.find().sort({ createdAt: -1 });    
        const sparePartsWithTotal = spareParts.map(sp => ({      
            ...sp.toObject(),      
            totalPrice: sp.quantity * sp.unitPrice    }));    
            res.json(sparePartsWithTotal);  } catch (error) {    
                res.status(500).json({ message: 'Server error' });  }};
const getSparePartById = async (req, res) => {  try {    
                    const sparePart = await SparePart.findById(req.params.id);    
                    if (!sparePart) {      
                        return res.status(404).json({ message: 'Spare part not found' });    }    
                        res.json({ ...sparePart.toObject(), totalPrice: sparePart.quantity * sparePart.unitPrice });  } 
                        catch (error) {    
                            res.status(500).json({ message: 'Server error' });  }};
 const updateSparePart = async (req, res) => {  
                                try {    
                                    const { name, category, unitPrice } = req.body;    
                                    const sparePart = await SparePart.findByIdAndUpdate(      req.params.id,      { name, category, unitPrice, updatedAt: Date.now() },      { new: true }    );    
                                    if (!sparePart) {      return res.status(404).json({ message: 'Spare part not found' });    }    
                                    res.json({ message: 'Spare part updated', sparePart });  } 
                                catch (error) {    res.status(500).json({ message: 'Server error' });  }};
const deleteSparePart = async (req, res) => {  
                                        try {    
                                            const sparePart = await SparePart.findByIdAndDelete(req.params.id);    
                                            if (!sparePart) {      return res.status(404).json({ message: 'Spare part not found' });    }    
                                            res.json({ message: 'Spare part deleted' });  } 
                                            catch (error) {    
                                                res.status(500).json({ message: 'Server error' });  }};
module.exports = { createSparePart, getSpareParts, getSparePartById, updateSparePart, deleteSparePart };