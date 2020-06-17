import React,{useState, useEffect} from 'react'
import { useHistory} from 'react-router-dom'
import M from 'materialize-css'


function CreatePost() {
    const history = useHistory()
    const [title, setTitle]  = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect(()=>{
      if(url){
        fetch('/createpost',{
          method:'post',
          headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
              title,
              body,
              pic:url
              })
          
      }).then(res=>res.json())
      .then(data=>{
         
          if(data.error){
              M.toast({html: data.error,classes:"#f44336 red"})
          }else{
              M.toast({html:"Post Created successfully", classes:"#4caf50 green"})
              history.push('/')
          }
      })
      .catch(error=>{
          console.log(error)
      })
      }
      
    },[url])

    const postDetails =()=>{
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
        setUrl(data.url)
      })
      .catch(error=>{
        console.log(error)
      })

      

    }

  return (
    <div className="card input-filed">
    <input 
    type='text' 
    placeholder='title'
    onChange={(e)=>{
      setTitle(e.target.value)
    }}
    value={title}
     />
    <input 
    type='text' 
    placeholder='Body'
    onChange={(e)=>{
      setBody(e.target.value)
    }}
    value={body}
     />

    <div className='file-field input-field'>
    <div className="btn #1e88e5 blue darken-1">
        <span>Upload Image</span>
        <input 
        type="file"
        onChange={(e)=>{
          setImage(e.target.files[0])
        }}
         />
      </div>
      <div className="file-path-wrapper">
          <input 
          className = " file-path validate"  
          type="text"

          />
      </div>
    </div>
    <button 
    className="btn waves-effect waves-light #1e88e5 blue darken-1"
    onClick={postDetails}
    >Submit Post</button>
      
    </div>
  )
}

export default CreatePost
