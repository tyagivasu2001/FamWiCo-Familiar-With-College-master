import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import './Popup.css';

let classCode='';

const PopupCreate = (props) => {
  const [user,loading,error]=useAuthState(auth);
  const [currentUser,setCurrentUser]=useState();
  const [helper,setHelper]=useState(false);

  const [isCreated,setIsCreated]=useState(false);
  const [classes,setClasses]=useState({
    subjectName:'',
    course:'',
    teacher:'',
    created:'',
  })

  
  useEffect(()=>{
      let ref = db.ref("/users");
      var arr=[];
      ref.on("value",(snapshot) => {
          snapshot.forEach((child)=>{
              console.log(child.val());
              arr.push(child.val());
              setHelper(true);
          })
      })

      for(let i=0; i<arr.length; i++){
          if(arr[i].email===user.email){
              setCurrentUser({...arr[i]});
              console.log("current user setted");
          }
      }
  },[helper]);

  const handleChange=(event)=>{
    setIsCreated(false)
    const {name,value}=event.target;
    setClasses({...classes,[name]:value});
    props.setC([]);
  }

  const handleCreate=()=>{
    console.log(currentUser);
    let date=new Date();
    const uniqueId=date.getDate()+date.getTime()+currentUser.email.split('@')[0];
    classCode=uniqueId;
    // const res=fetch(`https://famwico-default-rtdb.firebaseio.com/classes/${uniqueId}.json`,
    // {
    //     method:"POST",
    //     headers:{
    //         contentType:'application/json',
    //     },
    //     body:JSON.stringify({subjectName:classes.subjectName,course:classes.course,teacher:classes.teacher,teacherEmail:user.email,created:new Date().getFullYear,members:[user.email]}),
    // }
    // )
    let res=db.ref(`/classes/${uniqueId}`);
    res.set({subjectName:classes.subjectName,course:classes.course,teacher:classes.teacher,teacherEmail:user.email,created:date.getFullYear(),members:[user.email],assignments:[{assignmentMessage:'',assignmentLink:'',submittedBy:[{assignSolLink:'',studentName:''}]}],classwork:[""],classCode:uniqueId})
    setClasses({subjectName:'',course:'',teacher:'',created:''})
    console.log("class created...");
    setIsCreated(true);
    
  }

  if(currentUser===undefined){
    return <div>Still Loading...</div>
  }

  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClosec}>x</span>
        <div className="create-popup">
            <input type='text' name="teacher" placeholder='Enter Your Name' value={classes.teacher} onChange={handleChange}></input>
            <input type='text' name="subjectName" placeholder='Enter Subject' value={classes.subjectName} onChange={handleChange}></input>
            <input type='text' name="course" placeholder="Enter Course/Stream/Section" value={classes.course} onChange={handleChange}></input>
            <button onClick={handleCreate}>Create</button>
        </div>
        { isCreated && <div className="classcode">
                          <p>code to join the class (copy this):-</p>
                          <input type="text" readOnly value={classCode} style={{width:'fit-content'}}/>
                        </div>
        }
      </div>
    </div>
  );
};
 
export default PopupCreate;