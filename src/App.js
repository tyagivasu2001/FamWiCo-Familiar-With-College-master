import React, { useEffect, useLayoutEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';
import Classroom from './Classroom';
import NotePost from './NotePost';
import Post from './Post';
import PosterWinner from './PosterWinner';
import Note from './Note';
import AddPost from './AddPost';
import Login from './Login';
import Signin from './Signin';
import Classroom_class from './Classroom_class';
import SubmitSolution from './Classroom_Components/SubmitSolution';
import Profile from './Profile';
import ProfileEdit from './ProfileEdit';
import ProfileEditImage from './ProfileEditImage';
import ProfileUser from './ProfileUser';
import Comments from './Comments';

function App() {

  return (
    <>
    <div className='home'>
      <div className='menu'>

        <NavLink to='/post' className='nav' style={({isActive})=>({
          textDecoration : isActive ? 'underline' : 'none',
        })} >Post</NavLink>

        <NavLink to='/note' className='nav' style={({isActive})=>({
          textDecoration : isActive ? 'underline' : 'none',
        })} >Notes</NavLink>

        <NavLink to='/classroom' className='nav' style={({isActive})=>({
          textDecoration : isActive ? 'underline' : 'none',
        })} >Classroom</NavLink>

        <NavLink to='/profile' className='nav' style={({isActive})=>({
          textDecoration : isActive ? 'underline' : 'none',
        })} >Profile</NavLink>

      </div>
    </div>
    <Routes>
      <Route path='/' element={<Login/>} ></Route>
      <Route path='/posterwinner' element={<PosterWinner/>} ></Route>
      <Route path='/post' element={<Post/>} ></Route>
      <Route path='/post/comments' element={<Comments/>} ></Route>
      <Route path='/profile' element={<Profile/>} ></Route>
      <Route path='/profileuser' element={<ProfileUser/>} ></Route>
      <Route path='/profile/editprofile' element={<ProfileEdit/>} ></Route>
      <Route path='/profile/editprofileimage' element={<ProfileEditImage/>} ></Route>
      <Route path='/post/addpost' element={<AddPost/>} ></Route>
      <Route path='/note' element={<NotePost/>} ></Route>
      <Route path='/note/comments' element={<Comments/>} ></Route>
      <Route path='/classroom' element={<Classroom/>} ></Route>
      <Route path='/note/uploadNotes' element={<Note/>} ></Route>
      <Route path='/login' element={<Login/>} ></Route>
      <Route path='/signin' element={<Signin/>} ></Route>
      <Route path='/classroom/class' element={<Classroom_class/>} ></Route>
      <Route path='/classroom/class/assignmentsolution' element={<SubmitSolution/>} ></Route>
    </Routes>
    </>
  );
}

export default App;
