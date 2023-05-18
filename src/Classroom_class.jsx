import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation } from 'react-router-dom';
import './Classroom_class.css';
import Assignment_section from './Classroom_Components/Assignment_section';
import Classwork_section from './Classroom_Components/Classwork_section';
import Member_section from './Classroom_Components/Member_section';
import db, { auth } from './firebase';
import { BallTriangle } from 'react-loader-spinner';

const Classroom_class=()=>{
    const location=useLocation();
    const {classes,classn,index}={...location.state};

    const [isAssignment,setAssignment]=useState(true);
    const [isClasswork,setClasswork]=useState(false);
    const [isMember,setMember]=useState(false);

    const [user,loading,error]=useAuthState(auth);
    const [currentUser,setCurrentUser]=useState();
    const [helper,setHelper]=useState(false);

    
    useEffect(()=>{
        let ref = db.ref("/users");
        var arr=[];
        ref.on("value",(snapshot) => {
            snapshot.forEach((child)=>{
                arr.push(child.val());
                setHelper(true);
            })
        })

        for(let i=0; i<arr.length; i++){
            if(arr[i].email===user.email){
                setCurrentUser({...arr[i]});
            }
        }
    },[helper]);

    const assignmentClick=()=>{
        setAssignment(true);
        setClasswork(false);
        setMember(false);
    }

    const classworkClick=()=>{
        setAssignment(false);
        setClasswork(true);
        setMember(false);
    }

    const memberClick=()=>{
        setAssignment(false);
        setClasswork(false);
        setMember(true);
    }

    if(currentUser===undefined){
        return (
            <div style={{height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <BallTriangle
                    heigth="100"
                    width="100"
                    color="grey"
                    ariaLabel="loading-indicator"
                    />
            </div>
        );
    }

    return (
        <>
        <div className='class_main'>
            <div className='classHeader'>
                <div className='class_info'>
                    <p className='subjectname'>{classn.subjectName}</p>
                    <div className='class_info_div_1'>
                        <p>{classn.course}</p>
                        <p>{classn.teacher}</p>
                    </div>
                </div>
                {
                    user.email===classn.teacherEmail && 
                    <div className='for_teacher'>
                        <input type='text' readOnly className='for_teacher_created' value={`created at: ${classn.created}`}></input>
                    <input type='text' readOnly className='for_teacher_classcode' value={`classCode: ${classn.classCode!==undefined?classn.classCode:"default"}`}></input>
                </div>
                }
                <div className='class_action'>
                    <input type='button' value='Assignments' style={isAssignment?{color:'red',textDecoration:'underline'}:null} onClick={assignmentClick}></input>
                    <input type='button' value='Classwork' style={isClasswork?{color:'red',textDecoration:'underline'}:null} onClick={classworkClick}></input>
                    <input type='button' value='Students' style={isMember?{color:'red',textDecoration:'underline'}:null} onClick={memberClick}></input>
                </div>
            </div>
            <div className='class_action_selected'>
                { isAssignment && <Assignment_section classCode={classn.classCode} currentUser={currentUser} teacherEmail={classn.teacherEmail}/> }
                { isClasswork && <Classwork_section classCode={classn.classCode} currentUser={currentUser}/> }
                { isMember && <Member_section classCode={classn.classCode} teacher={classn.teacher} currentUser={currentUser}/> }
            </div>
        </div>
        </>
    );
}

export default Classroom_class;