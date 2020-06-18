import React, {useState, useContext} from 'react'
import {Link, useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'

function NewPassword() {

    const history = useHistory()
    const [password, setPassword] = useState("")
    const {token} = useParams()
   

    const PostData = ()=>{
     
        fetch('/new-password',{
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                    password,
                    token
                })
            
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes:"#f44336 red"})
            }else{
                M.toast({html:data.message, classes:"#4caf50 green"})
                history.push('/signin')
            }
        })
        .catch(error=>{
            console.log(error)
        })
    }
  return (
      <div className="mycard ">
          <div className="card auth-card input-field">
              <h2>Pshare</h2>
             
              <input
                  type='password'
                  placeholder='Enter a new password'
                  value={password}
                  onChange={(e)=>{
                     setPassword(e.target.value)
                 }}
              />
              <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
              onClick={PostData}>Update Password</button>
             

          </div>
      </div>
  )
}

export default NewPassword
