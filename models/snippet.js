const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const snippetSchema = new Schema({
    title: {
        type: String,
        required: [true],
        maxLength: 255
    },
    content: String,
    url: String,
    tags: Array,
},
    { timestamps: true }
)

module.exports = mongoose.model('snippet', snippetSchema)