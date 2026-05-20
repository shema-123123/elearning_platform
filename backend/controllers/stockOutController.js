const StockOut = require('../models/StockOut');
const SparePart = require('../models/SparePart');
const ActivityLog = require('../models/ActivityLog');
const addStockOut = async (req, res) => {  
    try {    
        const { sparePartId, quantity } = req.body;        
        // Find spare part    
        const sparePart = await SparePart.findById(sparePartId);    
        if (!sparePart) {      
            return res.status(404).json({ message: 'Spare part not found' });    }        
            // Check if enough quantity available    
            if (sparePart.quantity < quantity) {      
                return res.status(400).json({         
                    message: `Insufficient stock. Available: ${sparePart.quantity}, Requested: ${quantity}`       });    }        
                    // Calculate total price    
            const totalPrice = quantity * sparePart.unitPrice;        
            // Update quantity atomically    
            const updatedSparePart = await SparePart.findByIdAndUpdate(      sparePartId,      { $inc: { quantity: -quantity }, updatedAt: Date.now() },      { new: true }    );        
            // Create stock out record    
            const stockOut = new StockOut({      sparePartId,      sparePartName: sparePart.name,      quantity,      unitPrice: sparePart.unitPrice,      totalPrice,      createdBy: req.user.id    });    
            await stockOut.save();        
            // Log activity    
            await ActivityLog.create({      userId: req.user.id,      userName: req.user.name,      userRole: req.user.role,      action: 'STOCK_OUT',      entityType: 'stock_out',      entityId: stockOut._id,      details: { sparePartName: sparePart.name, quantity, totalPrice, newQuantity: updatedSparePart.quantity }    });        
            res.status(201).json({       message: 'Stock out recorded successfully',       stockOut,      newQuantity: updatedSparePart.quantity    });  } 
            catch (error) {    
                res.status(500).json({ message: 'Server error', error: error.message });  }};
                const getStockOutHistory = async (req, res) => {  
                    try {    
                        const stockOuts = await StockOut.find({ isDeleted: false })      
                        .populate('createdBy', 'name email')      
                        .sort({ date: -1 });    
                        res.json(stockOuts);  } 
                    catch (error) {    
                        res.status(500).json({ message: 'Server error' });  }};
const updateStockOut = async (req, res) => {  
                            try {    
                                const { quantity } = req.body;    
                                const stockOut = await StockOut.findById(req.params.id);        
                                if (!stockOut) {      
                                    return res.status(404).json({ message: 'Stock out record not found' });    }        
                                    const sparePart = await SparePart.findById(stockOut.sparePartId);    
                                    if (!sparePart) {      
                                        return res.status(404).json({ message: 'Spare part not found' });    }        
                                        const quantityDifference = quantity - stockOut.quantity;    
                                        const newSpareQuantity = sparePart.quantity - quantityDifference;        
                                        if (newSpareQuantity < 0) {      
                                            return res.status(400).json({ message: 'Insufficient stock for this update' });    }        
                                            
                                            // Update spare part quantity    
                                        await SparePart.findByIdAndUpdate(stockOut.sparePartId, {      quantity: newSpareQuantity,      updatedAt: Date.now()    });        
                                        // Update stock out record    
                                         stockOut.quantity = quantity;    
                                         stockOut.totalPrice = quantity * stockOut.unitPrice;    
                                         await stockOut.save();        
                                         res.json({ message: 'Stock out updated successfully', stockOut });  } 
                                         catch (error) {    res.status(500).json({ message: 'Server error' });  }};
 const deleteStockOut = async (req, res) => {  
                            try {    
                                const stockOut = await StockOut.findById(req.params.id);        
                                if (!stockOut) {      
                                    return res.status(404).json({ message: 'Stock out record not found' });    }        
                                    // Restore quantity to spare part    
                                    await SparePart.findByIdAndUpdate(stockOut.sparePartId, {      $inc: { quantity: stockOut.quantity },      updatedAt: Date.now()    });        
                                    // Soft delete    
                                    stockOut.isDeleted = true;    
                                    await stockOut.save();        
                                    res.json({ message: 'Stock out record deleted and quantity restored' });  } 
                                    catch (error) {    
                                    res.status(500).json({ message: 'Server error' });  }};
module.exports = { addStockOut, getStockOutHistory, updateStockOut, deleteStockOut };

