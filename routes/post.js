const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requirelog = require('../middleware/requirelog')
const e = require('express')
const Post = mongoose.model('Post')



router.get('/allpost',requirelog,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>{
        res.json({
            posts
        })
    })
    .catch(error=>{
        console.log(error)
    })
})


router.post('/createpost',requirelog,(req,res)=>{
    const {title, body, pic} = req.body
    if(!title || !body || !pic){
       return res.status(422).json({
            error:'Please add all the fields'
        })
    }


    req.user.password= undefined

    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })

    post.save()
    .then(result=>{
        res.json({
            post:result
        })
    }).catch(error=>{
        console.log(error)
    })
    
})

router.get('/mypost',requirelog,(req,res)=>{

    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({
            mypost
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',requirelog,(req,res)=>{
        Post.findByIdAndUpdate(req.body.postId,{
            $push:{likes:req.user._id}
        },{
            new:true
        }).exec((err, result)=>{
            if(err){
                return res.status(422).json({
                    error:err
                })
            }else{
                res.json(result)
            }
        
        })
})

router.put('/unlike',requirelog,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({
                error:err
            })
        }else{
            res.json(result)
        }
    
    })
})

router.put('/comment',requirelog,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id, name")
    .populate("postedBy","_id, name")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({
                error:err
            })
        }else{
            res.json(result)
        }
    
    })
})

router.delete('/deletepost/:postId',requirelog,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((error, post)=>{
        console.log(post)
        if(error || !post){
           
            return res.status(422).json({
                error
            })
        }
        if(post.postedBy._id.toString()===req.user._id.toString()){
            post.remove()
            .then(result=>{
               
                res.json(result)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
})

router.delete('/deletecomment/:postId/:commentId',requirelog, (req,res)=>{

        Post.findOne({_id:req.params.postId})
        .populate("postedBy", "_id name")
        .exec((error, post)=>{
            if(error || !post){
                return res.status(404).json({error:"post not avilable"})
            }

            post.comments = post.comments.filter(comment => {
                return comment._id != req.params.commentId
            })

            post.save()
            .then(result=>{
                return res.json(result)
            }).catch(error=>{
                console.log(error)
            })
            
        })
})



module.exports = router