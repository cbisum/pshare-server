const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requirelog = require('../middleware/requirelog')

router.get('/',(req,res)=>{
    res.send('Hello from router')
})

router.get('/protected',requirelog,(req,res)=>{
    res.send('Hello user')
})

router.post('/signup',(req,res)=>{
    const {name, email, password,pic} = req.body
    console.log(req.body)
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