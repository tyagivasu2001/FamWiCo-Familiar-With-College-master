import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import db, { auth } from './firebase';
import EditIcon from '@mui/icons-material/Edit';
import './Profile.css';

const Profile=()=>{
    const navigate=useNavigate();
    const [user,loading,error]=useAuthState(auth);
    const [currentUser,setCurrentUser]=useState();
    const [password,setPassword]=useState();
    let hider="**********************************************";

    useEffect(() => {
        let ref = db.ref("/users");
        ref.on("value", snapshot => {
            snapshot.forEach((child)=>{
                if(child.val().email==user.email){
                    setCurrentUser(child.val());
                }
            })
        })
        
    },[]);

    const editImage=()=>{
        navigate('/profile/editprofileimage',{state:{currentUser:currentUser}});
    }

    if(currentUser===undefined){
        return <p>loading...</p>
    }
    
    if(currentUser!==undefined && password===undefined){
        let len=currentUser.password.length;
        let pass=currentUser.password.slice(0,len/4)+hider.slice(len/4,len);
        setPassword(pass);
    }

    return (
        <>
            <div className='profile'>
                <div className='profile_main'>
                    <div className='name_img'>
                        <img src={currentUser.profileImageUrl} alt="pic" />
                        <div className='editImage' ><EditIcon style={{backgroundColor:'aliceblue'}} onClick={editImage}></EditIcon></div>
                        <input type="text" readOnly value={currentUser.name} />
                    </div>
                    <div className='other_info'>
                        <p>Email: <span style={{fontSize:'18px',backgroundColor:'transparent'}}>{currentUser.email}</span></p>
                        <p>Course: <span style={{fontSize:'18px',backgroundColor:'transparent'}}>{currentUser.course}</span></p>
                        <p>Branch: <span style={{fontSize:'18px',backgroundColor:'transparent'}}>{currentUser.branch}</span></p>
                        <p>Phone: <span style={{fontSize:'18px',backgroundColor:'transparent'}}>{currentUser.phone}</span></p>
                        <p>Password: <span style={{fontSize:'18px',backgroundColor:'transparent'}}>{password}</span></p>
                        <input type="button" value="Edit Profile"  onClick={()=>{
                            navigate('/profile/editprofile', {state:{currentUser:currentUser}});
                        }}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;