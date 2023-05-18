import React, { useEffect } from 'react';
import './Classroom.css';
import { useState } from 'react';
import PopupJoin from './PopupJoin';
import PopupCreate from './PopupCreate';
import db, { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';

const Classroom=()=>{
    const navigate=useNavigate();

    const [user,loading,error]=useAuthState(auth);
    const [currentUser,setCurrentUser]=useState();
    const [helper,setHelper]=useState(false);

    const [classes,setClasses]=useState();
    const [helper2,setHelper2]=useState(false);
    
    //for  popups
    const [isOpenj, setIsOpenj] = useState(false);
    const [isOpenc, setIsOpenc] = useState(false);

    const togglePopupj=()=>{
        setIsOpenj(!isOpenj);
    }

    const togglePopupc=()=>{
        setIsOpenc(!isOpenc);
        
    }

    //for getting classes
    useEffect(()=>{
        let ref = db.ref("/classes");
        console.log("getting classes");
        var arr=[];
        ref.on("value",(snapshot) => {
            snapshot.forEach((child)=>{
                const obj=child.val();
                console.log("user defined");
                if(obj.members.includes(user.email))
                arr.push(obj);
            })
            console.log(arr);
            setClasses(arr);
        })

    },[isOpenc,isOpenj,helper]);

    //for getting current user
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

    const handleClassClick=(classn,index)=>{
        navigate('/classroom/class',{state:{classes:classes,classn:classn,index:classes.length-1-index}})
    }

    if(currentUser===undefined){
        return <div>Still Loading...</div>
    }

    return (
        <>
        <div className='classroom'>

            <div className='classAction'>
                <input type="button" value="Join Class" onClick={togglePopupj}/>
                {isOpenj && <PopupJoin handleClosej={togglePopupj} setCJ={setClasses}/>}
                
                <input type="button" value="Create Class" onClick={togglePopupc}/>
                {isOpenc && <PopupCreate handleClosec={togglePopupc} setC={setClasses} />}
            </div>
            
            {
                classes!==undefined && classes.slice(0).reverse().map((classn,index)=>{
                    return (
                    <div className='classes'>
                        <div onClick={()=>{handleClassClick(classn,index)}} className='class_header'>
                            <p style={{cursor:'pointer'}}>{classn.subjectName}</p>
                            <p style={{cursor:'pointer'}}>{classn.course}</p>
                        </div>
                        <div className='class_footer'>
                            <p>Class Teacher: {classn.teacher}</p>
                            <p> members: {classn.members.length}</p>
                        </div>
                    </div>
                    );
                })
            }
            
        </div>
        </>
    );
}

export default Classroom;