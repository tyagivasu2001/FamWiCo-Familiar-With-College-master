import React from 'react';
import { useEffect, useLayoutEffect } from 'react';
import { useState } from 'react';
import './AddPost.css';
import { getStorage,ref,uploadBytesResumable,getDownloadURL } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import db, { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BallTriangle } from 'react-loader-spinner';

const AddPost=()=>{
    const navigate=useNavigate();

    const [selectedFile, setSelectedFile] = useState();
    const [postMessage,setPostMessage]=useState();
    const [preview, setPreview] = useState();
    let postFileUrl='';

    const [user,error]=useAuthState(auth);
    const [currentUser,setCurrentUser]=useState();
    const [helper,setHelper]=useState(false);

    const [loading,setloading]=useState(false);

    
    useEffect(()=>{
        setloading(true);
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
                setloading(false);
            }
        }
    },[helper]);

    useEffect(() => {
        if (!selectedFile) {
            setPreview(undefined)
            return
        }

        const objectUrl = URL.createObjectURL(selectedFile)
        console.log(objectUrl);
        console.log(currentUser);
        setPreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [selectedFile]);

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedFile(undefined)
            return
        }
        setSelectedFile(e.target.files[0])
    }

    const handlePost=()=>{
        
        try{
            const metadata={
                contentType:'*',
            };
            const storage=getStorage();
            const storageRef=ref(storage,`/postImages/${selectedFile.name}`);
            const uploadTask=uploadBytesResumable(storageRef,selectedFile,metadata);

            uploadTask.on("state_changed",
                (snapshot)=>{
                    setloading(true);
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    if(progress===100){
                        setTimeout(()=>{
                            savingData();
                            setloading(false);
                        },7000);
                    }
                },
                (error)=>{

                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        console.log('File available at', downloadURL);
                        postFileUrl=downloadURL;
                    })
                }
            );

            const savingData=async()=>{
                console.log('saving data');
                let date=new Date();
                console.log(currentUser);
                const res=await fetch("https://famwico-default-rtdb.firebaseio.com/posts.json",
                {
                    method:"POST",
                    headers:{
                        contentType:'application/json',
                    },
                    body:JSON.stringify({like:[''],comments:[''],user:currentUser,postMessage:postMessage,postFileUrl:postFileUrl,postTime:(date.toLocaleDateString()+" "+date.toLocaleTimeString())}),
                }
                )
            }

            navigate('/post');

        }
        catch(error){
            console.log(error);
            alert(error);
        }
    }

    if(currentUser===undefined || loading){
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
        <div className='addPost_main'>
            <div className='addPost_sub'>
                {selectedFile &&  <img className='addPost_image' src={preview} /> }
                <textarea placeholder="Write Something..." rows='5' onChange={(event)=>{setPostMessage(event.target.value)}}></textarea>
                <input type="file" accept='image/*' onChange={onSelectFile}></input>
                <button onClick={()=>handlePost()}>Post</button>
            </div>
        </div>
        </>
    );
}

export default AddPost;