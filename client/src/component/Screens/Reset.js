import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

function Reset() {
    
    const history = useHistory()
    const [email, setEmail] = useState("")
    const PostData = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
           return M.toast({html: "invalid email",classes:"#f44336 red"})
        }
        fetch('/reset-password',{
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                    email
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
                  type='text'
                  placeholder='email'
                  value={email}
                  onChange={(e)=>{
                     setEmail(e.target.value)
                 }}

              />
              <button className="btn waves-effect waves-light #1e88e5 blue darken-1"
              onClick={PostData}>Reset password</button>

          </div>
      </div>
  )
}

export default Reset
