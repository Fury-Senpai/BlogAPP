const express = require('express')
const router = express.Router();
const postModel = require('../models/post');
//home page
router.get('/',(req,res)=>{
    res.render("index");
});

router.get('/about',(req,res)=>{
    res.render('about')
})
module.exports = router;