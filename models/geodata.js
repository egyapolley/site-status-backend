const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    site_id:{
        type:String,
        unique:true,
        required:true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

module.exports =mongoose.model("Sites", siteSchema)
