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
        required: true,
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
        filename: String,
        path: String,
        mimetype: String
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