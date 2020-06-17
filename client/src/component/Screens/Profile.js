import React, { useEffect, useState, useContext } from 'react'
import {UserContext} from '../../App'

function Profile() {
    const [myPic, setMyPic] = useState([])
    const {state,dispatch}  =  useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState('')
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setMyPic(result.mypost)
        })
    },[])

useEffect(()=>{
    if(image){
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","pshare")
        data.append('cloud_name',"doxenz7xb")
        fetch("https://api.cloudinary.com/v1_1/doxenz7xb/image/upload",{
          method:"post",
          body:data
        })
        .then(res=>res.json())
        .then(data=>{
        //   localStorage.setItem('user',JSON.stringify({...state, pic:data.url}))
        //   dispatch({type:"UPDATEPIC", payload:data.url})
          fetch('/updatepic',{
              method:'put',
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+ localStorage.getItem('jwt')
              },
              body:JSON.stringify({
                  pic:data.url
              })
          }).then(res=>res.json())
          .then(result=>{
            console.log(result)
            localStorage.setItem('user',JSON.stringify({...state, pic:result.pic}))
            dispatch({type:"UPDATEPIC", payload:result.pic})
          })

        })
        .catch(error=>{
          console.log(error)
        })
    }

},[image])
    const updatePhoto=(file)=>{
        setImage(file)
    }

  return (
      <div className='profileparent'>
      <div className='btnChange'>
            
    
          <div className='profilesec'>
              <div>
                  <img style={{ width: '150px', height: '160px', borderRadius: '80px' }} src={state?state.pic:'loading'} />
                  
              </div>
              <div>
                  <h4>{state?state.name:"Loading"}</h4>
                  <h5>{state?state.email:"Loading"}</h5>
                  <div className='innersec'>
                      <h6>{myPic.length} post</h6>
                      <h6>{state?state.followers.length:0} Followers</h6>
                      <h6>{state?state.following.length:0} Following</h6>
                  </div>
              </div>
          </div>
        
            <div className='file-field input-field' style={{margin:'10px'}}>
                  <div  className="btn #1e88e5 blue darken-1">
                      <span>update Profile Pic</span>
                      <input
                          type="file"
                          onChange={(e) => {
                              updatePhoto(e.target.files[0])
                          }}
                      />
                  </div>
                  <div className="file-path-wrapper">
                      <input
                      style={{borderBottom:'none'}}
                          className=" file-path validate"
                          type="text"

                      />
                  </div>
              </div>
         
          </div>
          
          <div className='gallery'>
          {
            myPic.map(item=>{
                return(
                    <img key={item._id} className='item' alt='item.title' src={item.photo} />
                )
            })
          }
          
           

          </div>
      </div>
  )
}

export default Profile
