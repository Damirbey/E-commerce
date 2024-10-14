import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import express from 'express';
import User from '../models/usersModel.js';
import { generateToken, isAdmin, isAuth, baseURL } from '../utils.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const userRouter = express.Router();


userRouter.get('/',isAuth, isAdmin,
    expressAsyncHandler(async (req,res)=>{
    const users = await User.find({});
    res.send(users);
    })
);


userRouter.get('/:id',isAuth, isAdmin,
    expressAsyncHandler(async (req,res)=>{
        const user = await User.findById(req.params.id);
        if(user){
            res.send(user);
        }else{
            res.status(404).send({message:"User not found."})
        }
    })
);


userRouter.delete('/:id',isAuth, isAdmin,
    expressAsyncHandler(async (req,res)=>{
        const user = await User.findByIdAndDelete(req.params.id);
        if(user){
            res.send({message:"User deleted successfully."});
        }else{
            res.status(404).send({message:"Something is off."});
        }
    })
);


userRouter.put('/:id',isAuth, isAdmin,
    expressAsyncHandler(async (req,res)=>{
        const user = await User.findById(req.params.id);
        if(user){
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdmin = Boolean(req.body.isAdmin);
            const updatedUser = await user.save();
            res.send({message:"User updated successfully."});
        }else{
            res.status(404).send({message:"Something is off."});
        }
    })
);


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


userRouter.post('/forgot-password', expressAsyncHandler(async (req,res)=>{
        const user = await User.findOne({email:req.body.email});
        if(user){
            const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET, {
                expiresIn:'3h',
            });
            user.resetToken = token;
            await user.save();

            // Create a transporter object with Gmail
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: process.env.GMAIL_EMAIL, // Your Gmail email address
                pass: process.env.GMAIL_PASSWORD        // Your Gmail password or app-specific password
                }
            });
            
            // Define email options with a URL
            let mailOptions = {
                from: process.env.GMAIL_EMAIL,                // Sender address
                to: req.body.email,                 // Recipient
                subject: 'Amazona Password Reset',             // Subject
                html: `<p>Please use the following link to reset your password: <a href="${baseURL()}/resetPassword/${token}">Reset Password</a>.</p>`
            };
            
            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                return console.log(error);
                }
                res.send({message:"Password reset link was sent to your email"})
            });
        }

    })
);

userRouter.post('/reset-password', expressAsyncHandler(async (req,res)=>{

    jwt.verify(
        req.body.token,
        process.env.JWT_SECRET,
        async(err,decode) => {
            if(err){
                res.status(404).send({message:'Invalid Token!'});
            }else{
                const user = await User.findOne({resetToken:req.body.token});
                if(user){
                    if(req.body.password){
                        user.password = bcrypt.hashSync(req.body.password, 8);
                        await user.save();
                        res.send({message:'Password reset is successful'});
                    }
                }else{
                    res.status(404).send({message:'User not found!'});
                }
            }
        }
    )
    
}));


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