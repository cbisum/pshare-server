import React, { createContext, useReducer, useEffect, useContext } from 'react';
import './App.css';
import Navbar from './component/Navbar';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import Home from './component/Screens/Home'
import Login from './component/Screens/Login';
import Signup from './component/Screens/Signup';
import Profile from './component/Screens/Profile';
import CreatePost from './component/Screens/CreatePost';
import {initialState, reducer} from '../src/Reducers/userReducer'
import UserProfile from './component/Screens/UserProfile'
import SubPost from './component/Screens/SubscribedUserPost'
import Reset from './component/Screens/Reset'
import NewPassword from './component/Screens/NewPassword'

export const UserContext = createContext()

const Routing = ()=>{
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER", payload:user})
      
    }else{
      if(!history.location.pathname.startsWith('/reset')){
        history.push('/signin')
      }
          
    }
  },[])
  return (
    <Switch>
      <Route exact path='/' >
        <Home />
      </Route>
      <Route path='/signin'>
        <Login />
      </Route>
      <Route path='/signup'>
        <Signup />
      </Route>
      <Route exact path='/profile' >
        <Profile />
      </Route>
      <Route path='/create' >
        <CreatePost />
      </Route>
      <Route path='/profile/:userid' >
        <UserProfile />
      </Route>
      <Route path='/myfollwingpost' >
      <SubPost />
      </Route>
      <Route exact path='/reset' >
      <Reset />
      </Route>
      <Route path='/reset/:token' >
      <NewPassword />
      </Route>
    </Switch>

  )
}



function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value ={{state, dispatch}} >
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>

    </UserContext.Provider>

  
  );
}

export default App;
