import React, { useState } from 'react';
import './App.css';
import { useNavigate,useLocation } from 'react-router-dom';
import db from './firebase';

const ProfileEdit=()=>{
    const navigate=useNavigate();
    const location=useLocation();
    const currentUser=location.state.currentUser;

    const [form,setForm] = useState({
        name:currentUser.name,
        email:currentUser.email,
        phone:currentUser.phone,
        course:currentUser.course,
        branch:currentUser.branch,
        password:currentUser.password,
    })

    const changeHandler=(event)=>{
        const {name,value}=event.target;

        setForm((preval)=>{
            return {
                ...preval,
                [name]:value,
            }
        });
    }

    const handleSubmit=()=>{
        let ref=db.ref('/users');
        ref.once("value",(snapshot)=>{
            snapshot.forEach((child)=>{
                if(child.val().email===currentUser.email){
                    const password=child.val().password;
                    const profileImageUrl=child.val().profileImageUrl;
                    ref.child(child._delegate.ref._path.pieces_[1]).set({...form,["password"]:password,["profileImageUrl"]:profileImageUrl});
                }
            })
        })
        navigate('/profile');
    }

    return (
        <div className='Signin_main'>
            <div className='Signin'>
                    <input type="text" minLength='3' maxLength='30' placeholder='Enter Name' className='SigninInput' onChange={changeHandler} name='name' value={form.name}/>
                    <input required type="email" placeholder='Enter Email' className='SigninInput' onChange={changeHandler} name='email' value={form.email}/>
                    <input required type="number" minLength='10' maxLength='10' placeholder='Enter Mobile no.' className='SigninInput' onChange={changeHandler} name='phone' value={form.phone}/>
                    <input type="text" placeholder='Enter Course' className='SigninInput' onChange={changeHandler} name='course' value={form.course}/>
                    <input type="text" placeholder='Enter Branch(if any)' className='SigninInput' onChange={changeHandler} name='branch' value={form.branch}/>
                    <button type='submit' className='SigninButton' value='Signin' onClick={handleSubmit}>Update Profile</button>
            </div>
        </div>
    );
}

export default ProfileEdit;