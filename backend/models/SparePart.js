const mongoose = require('mongoose');
const sparePartSchema = new mongoose.Schema({ 
     name: {    type: String,    required: true,    unique: true,    trim: true  },
       category: {    type: String,    required: true,    trim: true  },
         quantity: {    type: Number,    required: true,    default: 0,    min: 0  },
           unitPrice: {    type: Number,    required: true,    min: 0  }, 
            createdAt: {    type: Date,    default: Date.now  }, 
             updatedAt: {    type: Date,    default: Date.now  }});
             // Update the updatedAt field on save
             sparePartSchema.pre('save', function () {
   this.updatedAt = Date.now();
});
                // Virtual for total price
                 sparePartSchema.virtual('totalPrice').get(function() {
                      return this.quantity * this.unitPrice;});
                      module.exports = mongoose.model('SparePart', sparePartSchema);