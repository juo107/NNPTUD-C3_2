let mongoose = require('mongoose');
let inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: [true, "product khong duoc rong"],
        unique: [true, "product khong duoc trung"]
    },
    stock: {
        type: Number,
        min: [0, "stock khong duoc nho hon 0"],
        default: 0,
        required: [true, "stock khong duoc rong"]
    },
    reserved: {
        type: Number,
        min: [0, "reserved khong duoc nho hon 0"],
        default: 0,
        required: [true, "reserved khong duoc rong"]
    },
    soldCount: {
        type: Number,
        min: [0, "soldCount khong duoc nho hon 0"],
        default: 0,
        required: [true, "soldCount khong duoc rong"]
    }
}, {
    timestamps: true
});
module.exports = new mongoose.model('inventory', inventorySchema);
