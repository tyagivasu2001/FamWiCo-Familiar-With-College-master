import React, { useState } from 'react';
import './ProfileEditImage.css';
import { useNavigate,useLocation } from 'react-router-dom';
import db from './firebase';
import { getStorage,ref,uploadBytesResumable,getDownloadURL } from 'firebase/storage';

const ProfileEditImage=()=>{
    const navigate=useNavigate();
    const location=useLocation();
    const currentUser=location.state.currentUser;

    const [newProfileImage,setNewProfileImage]=useState();
    let newImageUrl='';

    const uploadImage=()=>{
        const storage=getStorage();
        const metadata={
            contentType: 'image/*',
        };

        const storageRef=ref(storage,`profileImages/${newProfileImage.name}`);
        const uploadTask= uploadBytesResumable(storageRef,newProfileImage,metadata);

        uploadTask.on("state_changed",
            (snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                if(progress===100){
                    setTimeout(()=>{
                        updatingData();
                    },7000);
                }
            },
            (error)=>{

            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    newImageUrl=downloadURL;
                });
            }
        )

        const updatingData=()=>{
            console.log("updating data now");
            let ref=db.ref('/users');
            ref.once("value",(snapshot)=>{
                snapshot.forEach((child)=>{
                    if(child.val().email===currentUser.email){
                        ref.child(child._delegate.ref._path.pieces_[1]).set({...child.val(),["profileImageUrl"]:newImageUrl});
                    }
                })
            })
        }
        navigate('/profile');
    }

    return (
        <div className='edit_image'>
            <div className='edit_image_main'>
                <input type="file" name="file" className='choose' accept="image/*" onChange={(event)=>{setNewProfileImage(event.target.files[0])}}></input>
                <button onClick={uploadImage}>Update Image</button>
            </div>
        </div>
    );
}

export default ProfileEditImage;