const StockIn = require('../models/StockIn');
const SparePart = require('../models/SparePart');
const ActivityLog = require('../models/ActivityLog');
const addStockIn = async (req, res) => {  
    try {    
        const { sparePartId, quantity } = req.body;        
        // Find spare part    
        const sparePart = await SparePart.findById(sparePartId);    
        if (!sparePart) {      
            return res.status(404).json({ message: 'Spare part not found' });    }        
            // Update quantity atomically    
        const updatedSparePart = await SparePart.findByIdAndUpdate(      sparePartId,      { $inc: { quantity: quantity }, updatedAt: Date.now() },      { new: true }    );        
             // Create stock in record    
             const stockIn = new StockIn({      sparePartId,      sparePartName: sparePart.name,      quantity,      createdBy: req.user.id    });    
             await stockIn.save();        
             // Log activity    
             await ActivityLog.create({      userId: req.user.id,      userName: req.user.name,      userRole: req.user.role,      action: 'STOCK_IN',      entityType: 'stock_in',      entityId: stockIn._id,      details: { sparePartName: sparePart.name, quantity, newQuantity: updatedSparePart.quantity }    });        
             res.status(201).json({       message: 'Stock in added successfully',       stockIn,      newQuantity: updatedSparePart.quantity    });  } 
             catch (error) {    
                res.status(500).json({ message: 'Server error', error: error.message });  }};
const getStockInHistory = async (req, res) => {  
                    try {    
                        const stockIns = await StockIn.find()      
                        .populate('createdBy', 'name email')      
                        .sort({ date: -1 });    
                        res.json(stockIns);  } catch (error) {    
                            res.status(500).json({ message: 'Server error' });  }};
module.exports = { addStockIn, getStockInHistory };

