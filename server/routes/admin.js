const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const postModel = require('../models/post');
const cookieParser = require('cookie-parser');
//selecting layout
const loginLayout = '../views/layouts/login';
const adminLayout = '../views/layouts/admin';

/* =============================== GET ROUTE =============================== */
//login
 
router.get('/login',async(req,res)=>{
    try{
        res.render('admin/login',{layout:loginLayout})
    }
    catch(error){
        console.log(error);
    }
})

//signup
router.get('/signup',async(req,res)=>{
    try{
        res.render('admin/signup',{layout:loginLayout})
    }
    catch(error){
        console.log(error );
        
    }
})
//admin panel
router.get('/panel',isProtected,async(req,res)=>{
    try{
        const post = await postModel.find({user:req.user.userId}).sort({_id:-1})
        res.render('admin/panel',{layout:adminLayout , post:post})
    }
    catch(error){
        console.log(error);
    }
})

//delete post
router.get('/admin/delete/:id',isProtected,async (req,res)=>{
    try {
        const user = await postModel.deleteOne({_id:req.params.id});
        res.redirect('/panel');
    } catch (error) {
        console.log(error);
    }
})

//edit page
router.get('/admin/edit/:id',isProtected,async(req,res)=>{
    try {
        const post = await postModel.findOne({_id:req.params.id});
        res.render('admin/edit',{post})
    } catch (error) {
        console.log(error)
    }
})
/* =============================== POST ROUTE =============================== */
//login
router.post('/login',async(req,res)=>{
    try {
        let {email , password} = req.body;
        
        //checking user
        const user = await userModel.findOne({email:email});
        if(!user){
            return res.status(404).json({
                message:'Email is not registered'
            })
        }
        //checking password
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return res.status(404).json({
                message:'Email not found or password incorrect'
            })
        }
        //jwt setup
        const token = jwt.sign({userId:user._id , email:user.email},process.env.JWT_SECRET,{
            expiresIn:'1d',
            
        });
        //setting token
        res.cookie('token',token,{
            httpOnly:true,
        });
       
        //only admin signup
        if(user.email == 'admin@owner.com'){
            res.redirect('/panel');
        }
        else{
            res.redirect('/');
        }

        
    } catch (error) {
        console.log(error);
    }
})
//post create
router.post('/createPost',isProtected,async (req,res)=>{
    let {title,content} = req.body;
    
    const user = await userModel.findOne({_id:req.user.userId});

    const post = await postModel.create({
        title,
        content,
        user: user._id
    })
    

    user.posts.push(post._id);
    await user.save();

    res.redirect('/panel')
    res.status(201).json({
        message:'success',
        data:{post}
    })
})
//edit post 
router.post('/admin/edit/:id',isProtected,async (req,res)=>{
    try {
        let {title , content} = req.body;
         
        const post = await postModel.findOne({_id:req.params.id});
        
        await post.updateOne({$set:{
            title:req.body.title ,
            content:req.body.content,
            updatedAt:Date.now()
        }})
 
        res.redirect('/panel');
    } catch (error) {
        console.log(error);
    }
})
//signup
router.post('/signup',async (req,res)=>{
    try {
        let {email , password} = req.body;
        //hashing password
        const hashedPassword = await bcrypt.hash(password , 10);
        const createUser = await userModel.create({
            email,
            password:hashedPassword
        });
        //jwt implement
        const token = jwt.sign({email:createUser.email , userId:createUser._id},process.env.JWT_SECRET,{
            expiresIn:'1d'
        });

        res.cookie('token',token);
        
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
});

//logout
router.post('/logout',isProtected,(req,res)=>{
    res.clearCookie('token' );
    res.redirect('/login');
})
// protected route
function isProtected(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.redirect('/login');
    }
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        console.log(error);
        res.redirect('/login');
    }
}

module.exports = router;