import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true 
    },

    date: {
        type: Date,
        default: Date.now
    }
});

const Log = mongoose.model('Log', LogSchema);

export { Log };