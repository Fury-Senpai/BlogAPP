const express = require('express')
const router = express.Router();
const postModel = require('../models/post');

//home page
router.get('/',async(req,res)=>{
    try {
        const post = await postModel.find();
        res.render("index",{post});
    } catch (error) {
        console.log(error);
    }
});

router.get('/about',(req,res)=>{
    res.render('about')
})
module.exports = router;