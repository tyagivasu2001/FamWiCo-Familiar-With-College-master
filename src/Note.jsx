import React, { useEffect, useState } from 'react';
import './Note.css';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AddCardIcon from '@mui/icons-material/AddCard';
import db, { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

const Note=()=>{
    const navigate=useNavigate();
    const [file,setFile]=useState();
    const [isFileSelected,setFileSelected]=useState(false);
    const [noteMessage,setNoteMessage]=useState();
    let noteFileUrl="";

    const [user,loading,error]=useAuthState(auth);
    const [currentUser,setCurrentUser]=useState();
    const [helper,setHelper]=useState(false);

    
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

    const handleFile=()=>{
        try{
            const metadata={
                contentType:'application/pdf',
            };
            const storage=getStorage();
            const storageRef=ref(storage,`/notes/${file.name}`);
            const uploadTask=uploadBytesResumable(storageRef,file,metadata);

            uploadTask.on("state_changed",
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    if(progress===100){
                        setTimeout(()=>{
                            savingData();
                        },7000);
                    }
                },
                (error)=>{

                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        console.log('File available at', downloadURL);
                        noteFileUrl=downloadURL;
                    })
                }
            );

            const savingData=async()=>{
                console.log('saving data');
                let date=new Date();
                console.log(currentUser);
                const res=await fetch("https://famwico-default-rtdb.firebaseio.com/notes.json",
                {
                    method:"POST",
                    headers:{
                        contentType:'application/json',
                    },
                    body:JSON.stringify({like:[''],comments:[''],user:currentUser,noteMessage:noteMessage,noteFileUrl:noteFileUrl,notePostTime:(date.toLocaleDateString()+" "+date.toLocaleTimeString())}),
                }
                )
            }

            navigate('/note');

        }
        catch(error){
            console.log(error);
            alert(error);
        }
    }

    const changeHandler=(event)=>{
        console.log(event.target.files[0]);
        setFile(event.target.files[0]);
        setFileSelected(true);
    }

    if(currentUser===undefined){
        return <div>Still Loading...</div>
    }

    return (
        <>
        <div className='note'>
            <div className='note_main'>
                {
                    isFileSelected ? (
                    <InsertDriveFileIcon className='file'/>
                    ) : 
                    <AddCardIcon className='nofile'/>
                }
                <input type="file" name="file" className='choose' onChange={changeHandler} accept="application/pdf"></input>
                <textarea placeholder="Write Something..." rows='5' onChange={(event)=>{setNoteMessage(event.target.value)}}></textarea>
                <button className='uploadButton' onClick={handleFile}>Upload</button>
            </div>
        </div>
        </>
    );
}

export default Note;