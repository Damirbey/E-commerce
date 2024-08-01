import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import express from 'express';
import User from '../models/usersModel.js';
import { generateToken, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.post('/signIn', expressAsyncHandler(async (req,res)=>{
    const user = await User.findOne({email:req.body.email});
    
    if(user){
        if(bcrypt.compareSync(req.body.password,user.password)){
            res.send({
                _id:user._id,
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin,
                token:generateToken(user)
            });
            return;
        }
    }
    res.status(401).send({message:'Invalid Email or Password'});
    })
);
userRouter.post('/signUp', expressAsyncHandler(async (req,res)=>{
        const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:bcrypt.hashSync(req.body.password)
        });
        const user = await newUser.save();
        res.send({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin,
            token:generateToken(user)
        });      
    })
);
userRouter.put('/updateProfile', isAuth, expressAsyncHandler(async (req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password){
            user.password = bcrypt.hashSync(req.body.password);
        }
        const updatedUser = await user.save();
        res.send({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email,
            isAdmin:updatedUser.isAdmin,
            token:generateToken(updatedUser)
        })
    }else{
        res.status(404).send({message:'User is not found!'});
    } 
})
);



export default userRouter;