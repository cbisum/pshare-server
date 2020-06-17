import React, { useEffect, useState, useContext } from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

function Profile() {
    const [userProfile, setProfile] = useState(null)
    
    const {state,dispatch}  =  useContext(UserContext)
    const {userid} = useParams()
    const [showfollow, setShowfollow] = useState(state?!state.following.includes(userid):true)

    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        })
        .then(res=>res.json())
        .then(result=>{
            
            // console.log(result)
            setProfile(result)
        })
    },[])

    const followUser =()=>{
        fetch('/follow',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:'UPDATE', payload:{following:data.following, followers:data.followers}})
          localStorage.setItem('user',JSON.stringify(data))
          setProfile((prestate)=>{
              return {
                ...prestate,
                user:{
                    ...prestate.user,
                    followers:[...prestate.user.followers, data._id]
                }
              }

          })
          setShowfollow(false)
        })
    }

    const unFollowUser =()=>{
        fetch('/unfollow',{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:'UPDATE', payload:{following:data.following, followers:data.followers}})
          localStorage.setItem('user',JSON.stringify(data))
        
          setProfile((prestate)=>{
            const newFollower = prestate.user.followers.filter(item=>item!=data._id)
              return {
                ...prestate,
                user:{
                    ...prestate.user,
                    followers:newFollower
                }
              }

          })
          setShowfollow(true)
      
        })
    }

  return (
      <>
      {userProfile?
        <div className='profileparent'>
          <div className='profilesec'>
              <div>
                  <img style={{ width: '150px', height: '160px', borderRadius: '80px' }} src={userProfile.user.pic} />
              </div>
              <div>
                  <h4> {userProfile.user.name}</h4>
                  <h5>{userProfile.user.email}</h5>
                  <div className='innersec'>
                      <h6>{userProfile.post.length} posts</h6>
                      <h6>{userProfile.user.followers.length} Followers</h6>
                      <h6>{userProfile.user.following.length} Following</h6>
                  </div>
                          {showfollow ? <button
                          style={{margin:'10px'}} className="btn waves-effect waves-light #1e88e5 blue darken-1"
                              onClick={() => followUser()}>Follow</button> : <button
                              style={{margin:'10px'}} 
                               className="btn waves-effect waves-light #1e88e5 blue darken-1"
                                  onClick={() => unFollowUser()}>unfollow</button>}
                          
                         
              </div>
          </div>
          <div className='gallery'>
            {
                userProfile.post.map(item=>{
                    return(
                        <img key ={item._id} className='item' src={item.photo}
                        alt ={item.title} />
                    )
                })
            }
          
           

          </div>
      </div>
      
      :<h2>loading</h2>}
      
      </>
  )
}

export default Profile
