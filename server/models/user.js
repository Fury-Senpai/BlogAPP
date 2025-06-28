const mongoose = require('mongoose');
    

const userSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required: true,
        trim: true
    },
    password:{
        type:String,
        required: true
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    role:{
        type:String,
        enum:['client','admin'],
        default:'client'
    }
})


module.exports = mongoose.model('User',userSchema);