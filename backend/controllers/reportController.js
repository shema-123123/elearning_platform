const SparePart = require('../models/SparePart');
const StockOut = require('../models/StockOut');
const getDailyStockStatus = async (req, res) => {  
    try {    
        const spareParts = await SparePart.find().sort({ name: 1 });        
        
        const today = new Date();    
        today.setHours(0, 0, 0, 0);    
        const tomorrow = new Date(today);    
        tomorrow.setDate(tomorrow.getDate() + 1);        
        const todayStockOuts = await StockOut.find({      date: { $gte: today, $lt: tomorrow },      isDeleted: false    });        
           
        const stockOutMap = new Map();    
        todayStockOuts.forEach(so => {      
            const current = stockOutMap.get(so.sparePartId.toString()) || 0;      
            stockOutMap.set(so.sparePartId.toString(), current + so.quantity);    });        
            const report = spareParts.map(sp => ({      
                sparePartName: sp.name,      
                category: sp.category,      
                storedQuantity: sp.quantity,      
                stockOutQuantity: stockOutMap.get(sp._id.toString()) || 0,      
                remainingQuantity: sp.quantity - (stockOutMap.get(sp._id.toString()) || 0),      
                unitPrice: sp.unitPrice,      totalValue: sp.quantity * sp.unitPrice    }));        
                res.json({      date: today,      report,      summary: {        
                    totalParts: spareParts.length,        totalStockValue: spareParts.reduce((sum, sp) => sum + (sp.quantity * sp.unitPrice), 0),        
                    totalStockOutToday: Array.from(stockOutMap.values()).reduce((a, b) => a + b, 0)      }    });  } 
                    catch (error) {    
                        res.status(500).json({ message: 'Server error', error: error.message });  }};
const getDailyStockOut = async (req, res) => {  
    try {    
        const { date } = req.query;    
        let queryDate = date ? new Date(date) : new Date();    
        queryDate.setHours(0, 0, 0, 0);    
        const nextDay = new Date(queryDate);    
        nextDay.setDate(nextDay.getDate() + 1);        
        const stockOuts = await StockOut.find({      date: { $gte: queryDate, $lt: nextDay },      isDeleted: false    }).populate('createdBy', 'name');        
        res.json({      date: queryDate,      stockOuts,      totalQuantity: stockOuts.reduce((sum, so) => sum + so.quantity, 0),      totalValue: stockOuts.reduce((sum, so) => sum + so.totalPrice, 0)    });  } 
        catch (error) {    
            res.status(500).json({ message: 'Server error' });  }};
const getLowStockAlert = async (req, res) => {  
    try {    
        const lowStockParts = await SparePart.find({ quantity: { $lt: 10 } }).sort({ quantity: 1 });    
        res.json(lowStockParts);  } 
        catch (error) {    
            res.status(500).json({ message: 'Server error' });  }};


module.exports = { 
    getDailyStockStatus, 
    getDailyStockOut, 
    getLowStockAlert 
};