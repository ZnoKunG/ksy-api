const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.ObjectId,
        auto: true,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    nickName: {
        type: String
    },
    birthDay: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Employee', employeeSchema)