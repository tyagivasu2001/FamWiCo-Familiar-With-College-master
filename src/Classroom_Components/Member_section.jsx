import React, { useEffect, useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import db from '../firebase';
import './ClassComp.css'

const Member_section=(props)=>{
    let [members,setmembers]=useState([]);
    const [helper,setHelper]=useState(false);
    const [loading,setloading]=useState(false);

    const classCode=props.classCode;
    const teacher=props.classCode;
    const currentUser=props.currentUser;

    useEffect(() => {
        setloading(true);
        members=[];
        let ref=db.ref(`/classes/${classCode}`);
        ref.once("value",(snapshot)=>{
            const students=snapshot.val().members;
            for(let student of students){
                let ref2=db.ref(`/users`);
                ref2.once("value",(snapshot)=>{
                    snapshot.forEach((child)=>{
                        let user=child.val();
                        if(student===user.email){
                            let arr=members;
                            arr.push({name:user.name,profileImageUrl:user.profileImageUrl});
                            setmembers(arr);
                            setHelper(true);
                        }
                    })
                })
            }
            setloading(false);
        })
    }, [helper]);

    if(members===[] || currentUser===undefined || loading){
        return (
            <BallTriangle
                heigth="100"
                width="100"
                color="grey"
                ariaLabel="loading-indicator"
                />
        );
    }

    return (
        <>
        <div className='members'>
            {
                members.map((member)=>{
                    return (
                        <div className='member'>
                            <img className='memberImage' src={member.profileImageUrl} alt="pic" />
                            <input type='text' readOnly className='membername' value={member.name}></input>
                        </div>
                    );
                })
            }
        </div>
        </>
    );
}

export default Member_section;