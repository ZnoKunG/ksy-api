const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.ObjectId,
        auto: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    link: {
        type: String
    },
    viewCount: {
        type: Number,
        default: 0,
        immutable: true,
    },
    subject: {
        type: String,
        default: "",
    },
    articleOwner: {
        type: String,
        default: "",
    },
    image: {
        data: Buffer,
        contentType: String,
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

module.exports = mongoose.model('Article', articleSchema)