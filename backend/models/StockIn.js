const mongoose = require('mongoose');
const stockInSchema = new mongoose.Schema({
      sparePartId: {    type: mongoose.Schema.Types.ObjectId,    ref: 'SparePart',    required: true  }, 
       sparePartName: {    type: String,    required: true  },
         quantity: {    type: Number,    required: true,    min: 1  }, 
          date: {    type: Date,    default: Date.now  }, 
           createdBy: {    type: mongoose.Schema.Types.ObjectId,    ref: 'User',    required: true  }});
           module.exports = mongoose.model('StockIn', stockInSchema);