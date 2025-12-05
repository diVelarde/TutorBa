const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    },
    attachments: [{
        filename: { type: String },
        originalname: { type: String },
        path: { type: String },
        url: { type: String },
        mimetype: { type: String },
        size: { type: Number }
    }]
});

// Create indexes for faster querying of conversations
messageSchema.index({ sender_id: 1, receiver_id: 1 });
messageSchema.index({ timestamp: -1 });

// Virtual for getting message age
messageSchema.virtual('messageAge').get(function() {
    return Date.now() - this.timestamp;
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;