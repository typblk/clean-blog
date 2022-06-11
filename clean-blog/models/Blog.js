const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema

const BlogSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

BlogSchema.pre('validate', function(next) {
    this.slug = slugify(this.name, {
        lower: true,
        strict: true
    })
    next()
})


const Blog = mongoose.model('Blog', BlogSchema)
module.exports = Blog