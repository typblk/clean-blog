const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AboutSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    image: {
        type:String
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    slogan: {
        type: String,
        required: true
    }
})


const About = mongoose.model('About', AboutSchema)
module.exports = About