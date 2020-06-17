const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requirelog = require('../middleware/requirelog')
const nodemailer = require('nodemailer')
const sendgridtransport = require('nodemailer-sendgrid-transport')


const transporter  = nodemailer.createTransport(sendgridtransport({
    auth:{
        api_key:"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"
    }
}))

router.post('/signup',(req,res)=>{
    const {name, email, password,pic} = req.body
    if(!email || !password || !name){
      return res.status(422).json({error:'Please add all the fields'})
    }

    User.findOne({email:email})
    .then((savedemail)=>{
        if(savedemail){
            return res.status(422).json({
                message:'Email alredy exist'
            })
        }

        bcrypt.hash(password, 12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
    
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply@pshare.com",
                    subject:"Signup success",
                    html:'<h1>Welcome to pshare application</h1>'
                })
                res.json({
                    message:'Saved'
                })
            }).catch(error=>{
                console.log(error)
            })

        })
        
    }).catch(error=>{
        console.log(error)
    })
  
})

router.post('/signin',(req,res)=>{
    const {email, password} = req.body
  
    if(!email || !password){
        res.status(422).json({
            error:'Please  provide email or password'
        })
    }

    User.findOne({email:email})
    .then(savedUser=>{
        console.log(savedUser)
        if(!savedUser){
           return res.status(422).json({
                error:'Invalid email or Password'
            })
        }
        bcrypt.compare(password,savedUser.password)
        .then(domatch=>{
            if(domatch){
                // res.json({
                //     message:'Successfully signed in'
                // })
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const  {_id, name, email,followers, following,pic} = savedUser
                res.json({
                    token,
                    user:{
                        _id,
                        name,
                        email,
                        followers,
                        following,
                        pic
                    }

                })
            }else{
                return res.status(422).json({
                    error:'Invalid email or Password'
                })
            }
        })
        .catch(error=>{
            console.log(error)
        })

    })
})

module.exports = router