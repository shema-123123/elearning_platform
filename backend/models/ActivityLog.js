const mongoose = require('mongoose');
const activityLogSchema = new mongoose.Schema({ 
     userId: {    type: mongoose.Schema.Types.ObjectId,    ref: 'User',    required: true  },  userName: String,  userRole: String, 
      action: {    type: String,    required: true  },  
      entityType: {    type: String,    enum: ['spare_part', 'stock_in', 'stock_out', 'user'],    required: true  }, 
      entityId: mongoose.Schema.Types.ObjectId,  
      details: {    type: mongoose.Schema.Types.Mixed  }, 
      timestamp: {    type: Date,    default: Date.now  }});
      module.exports = mongoose.model('ActivityLog', activityLogSchema);