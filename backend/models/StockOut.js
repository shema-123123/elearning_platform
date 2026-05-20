const mongoose = require('mongoose');
const stockOutSchema = new mongoose.Schema({
      sparePartId: {    type: mongoose.Schema.Types.ObjectId,    ref: 'SparePart',    required: true  },  
      sparePartName: {    type: String,    required: true  }, 
       quantity: {    type: Number,    required: true,    min: 1  }, 
        unitPrice: {    type: Number,    required: true  },
          totalPrice: {    type: Number,    required: true  },
            date: {    type: Date,    default: Date.now  },
              createdBy: {    type: mongoose.Schema.Types.ObjectId,    ref: 'User',    required: true  },
             isDeleted: {    type: Boolean,    default: false  }});
module.exports = mongoose.model('StockOut', stockOutSchema);