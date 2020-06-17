import React,{useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'


function Navbar() {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  const renderList = ()=>{
      if(state){
        return [
          <li><Link to="/myfollwingpost">My following post</Link></li>,
          <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/create">Create Post</Link></li>,
          
          <li>
            <button className="btn  #c62828 red darken-3"
              onClick={()=>{
                localStorage.clear()
                dispatch({type:"CLEAR"})
                history.push('/signin')
              }}>Log Out</button>
          </li>
        ]
        
      }else{
        return [
          <li><Link to="/signin">Login</Link></li>,
          <li><Link to="/signup">Singup</Link></li>
        ]
      }
  }
  return (
    <nav>
        <div className="nav-wrapper white">
            <Link to={state?"/":"/signin"} className="brand-logo left">PShare</Link>
            <ul id="nv-mobile" className="right hide-on-med-Linknd-down">
              
              {/* {state?[<li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/create">Create Post</Link></li>]:[  <li><Link to="/signin">Login</Link></li>,
          <li><Link to="/signup">Singup</Link></li>]} */}

          {renderList()}
                

            </ul>
        </div>  
    </nav>
  )
}

export default Navbar
