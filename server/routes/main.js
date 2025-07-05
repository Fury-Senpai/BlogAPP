const express = require('express')
const router = express.Router();
const postModel = require('../models/post');
const userModel = require('../models/user');
const isProtected = require('../../middleware/isProtected');

/* =============================== GET ROUTE =============================== */
//home page
router.get('/',async(req,res)=>{
    
    try { 
        const locals = {
            title: "DevShade"
        };
        //setting up pagination 
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page-1)*limit;
        const totalPost = await postModel.countDocuments();
        const totalPages = Math.ceil(totalPost/limit);
        const nextPage = parseInt(page) +1;
        const previousPage = parseInt(page) - 1;
        const hasNextPage = nextPage <= totalPages;
        const hasPreviousPage = previousPage > 0;

        const post = await postModel.find().sort({_id:-1}).skip(skip).limit(limit).exec();
        res.render("index",{post ,locals, nextPage: hasNextPage ? nextPage : null , previousPage:hasPreviousPage ? previousPage : null});
    } 
    catch (error) {
        console.log(error);
    } 
});  
//about
router.get('/about',(req,res)=>{
    res.render('about');
})

router.get('/contact',(req,res)=>{
    res.render('contact');
})
//post 
router.get('/posts/:id',isProtected,async (req,res)=>{
    try {
        const post = await postModel.findOne({_id : req.params.id});
        
        const user = await userModel.findOne({_id:req.user.userId});
        

        const locals = {
            title: post.title
        };
    
        res.render('posts',{post,locals,user});
    } catch (error) {
        console.log(error);
    }
})
//like feature
router.get('/like/:id',isProtected,async (req,res)=>{
    try {

        const post = await postModel.findOne({_id:req.params.id});
        
        if(post.likes.indexOf(req.user.userId) === -1){
            post.likes.push(req.user.userId);
        }
        else{
            post.likes.splice(post.likes.indexOf(req.user.userId),1);
        }
        await post.save();
        
        res.redirect(`/posts/${req.params.id}`)
    } catch (error) {
       console.log(error); 
    }


})
/* =============================== POST ROUTE =============================== */


//search query
router.post('/search',async (req,res)=>{
    try {
        let {query} = req.body;
        const noSpecialChar = query.replace(/[^a-zA-Z0-9]/g,"");
        const data = await postModel.find({
            $or:[
                { title:{$regex:RegExp(noSpecialChar,'i')}},
                { content:{$regex:RegExp(noSpecialChar,'i')}}
            ]
        })
        res.render("search",{data})
    } 
    catch (error) {
      console.log(error);  
    }
}) 





module.exports = router;  