import React from 'react';
import './Profile.css';
import {useLocation} from 'react-router-dom';

const ProfileUser=()=>{
    const location=useLocation();
    const user=location.state.user;

    return (
        <>
            <div className='profile'>
                <div className='profile_main'>
                    <div className='name_img'>
                        <img src={user.profileImageUrl} alt="pic" />
                        <input type="text" readOnly value={user.name} />
                    </div>
                    <div className='other_info'>
                        <p>Email: <span style={{fontSize:'18px',backgroundColor:'transparent'}}>{user.email}</span></p>
                        <p>Course: <span style={{fontSize:'18px',backgroundColor:'transparent'}}>{user.course}</span></p>
                        <p>Branch: <span style={{fontSize:'18px',backgroundColor:'transparent'}}>{user.branch}</span></p>
                        <p>Phone: <span style={{fontSize:'18px',backgroundColor:'transparent'}}>{user.phone}</span></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileUser;