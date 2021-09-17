//this is the simple schema of for the mongo database
const mongoose = require('mongoose');

const victim = new mongoose.Schema({
    name: {type:String},
    data: {type:Array}
})

module.exports = mongoose.model('Victim',victim);