const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requirelog')
const requirelog = require('../middleware/requirelog')
const Post = mongoose.model('Post')
const User = mongoose.model("User")

router.get('/user/:id',requirelog,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((error, post)=>{
            if(error){
                return res.status(422).json({error:error})
            }
            res.json({user, post})

        })
    })
    .catch(error=>{
        return res.status(404).json({error:"User not found"})
    })
})



router.put('/follow',requirelog,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(error,result)=>{
        if(error){
            return res.status(422).json({error:error})
        }

        User.findByIdAndUpdate(req.user._id,{
            
            $push:{following:req.body.followId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>{
            res.json(result)
        })
        .catch(error=>{
            return res.status(422).json({error:error})
        })

    })
})



router.put('/unfollow',requirelog,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(error,result)=>{
        if(error){
            return res.status(422).json({error:error})
        }

        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        })
        .select("-password")
        .then(result=>{
            res.json(result)
        })
        .catch(error=>{
            return res.status(422).json({error:error})
        })

    })
})

router.put('/updatepic',requirelog, (req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},(error,result)=>{
        if(error){
            return res.status(422).json({error:'pic can not post'})
        }

        res.json(result)
    })
})


router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp('^'+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router