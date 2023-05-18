import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth } from "./firebase";
import './Popup.css';

const PopupJoin = (props) => {
  const [user,loading,error]=useAuthState(auth);
  const [currentUser,setCurrentUser]=useState();
  const [helper,setHelper]=useState(false);

  const [classCode,setClassCode]=useState();
  const [isAdded,setIsAdded]=useState(false);

  //getting current user
  useEffect(()=>{
    props.setCJ([]);
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

  const handleJoin=()=>{
    let ref = db.ref(`/classes`);
    ref.on("value",(snapshot)=>{
      snapshot.forEach((child)=>{
        if(child._delegate.ref._path.pieces_[1]===classCode){
          let members=child.val().members;
          console.log(typeof(members));
          if(!members.includes(currentUser.email)){
            members.push(currentUser.email);
          }
          let classInfo={...child.val(),["members"]:members};
          ref.child(child._delegate.ref._path.pieces_[1]).set(classInfo);
        }
      })
    })
    alert("class joined");
    setClassCode("");
    setIsAdded(false);
    props.setCJ([]);
  }

  if(currentUser===undefined){
    return <div>Still Loading...</div>
  }

  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClosej}>x</span>
        <div className="join-popup">
          <text>Enter the classCode</text>
          <input type='text' onChange={(event)=>{setClassCode(event.target.value)}}></input>
          <button onClick={handleJoin}>Join</button>
        </div>
      </div>
    </div>
  );
};
 
export default PopupJoin;