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
    }]
})


module.exports = mongoose.model('User',userSchema);