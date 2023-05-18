import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './App.css';
import './loader.css';
import { login } from './Auth';
import {auth} from './firebase';
import {useNavigate} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

const Login=()=>{
    const [user,loading,error]=useAuthState(auth);

    useEffect(()=>{
        if(loading){
            <div className='loader'></div>;
        }
        if(user){
            navigate('/posterwinner');
        }
    },[user,loading]);

    const [form,setForm]=useState({
        email:'',
        password:'',
    })

    let navigate=useNavigate();

    const changeHandler=(event)=>{
        const {name,value}=event.target;

        setForm((preval)=>{
            return {
                ...preval,
                [name]:value,
            }
        })
    }

    const handleSubmit= async(e)=>{
        try{
            await login(form);
            navigate("/posterwinner", { replace: true });
        }
        catch(error){
            console.log(error);
            alert(error);
        }
    }
    return (
        <>
            <div className='login_main'>
                <div className='login'>
                    <input type="text" placeholder='Enter Email' className='loginInput' name='email' onChange={changeHandler}/>
                    <input type="text" placeholder='Enter Password' className='loginInput' name='password' onChange={changeHandler}/>
                    <button type='submit' className='loginButton' onClick={handleSubmit}>Login</button>
                    <div className='toSignIn'>
                        <p>New User?</p>
                        <NavLink to='/signin' className='signInNav'>Create Account</NavLink>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;