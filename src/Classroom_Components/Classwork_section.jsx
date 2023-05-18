import React, { useEffect, useState } from 'react';
import './ClassComp.css';
import db from '../firebase';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { BallTriangle } from 'react-loader-spinner';

const Classwork_section=(props)=>{
    const [isAssignnotes,setAssignnotes]=useState(false);
    const [noteFile,setNoteFile]=useState();
    const [noteMessage,setNoteMessage]=useState();
    let noteFileUrl='';

    const [classworkNotes,setClassworkNotes]=useState();
    const [loading,setloading]=useState(false);

    const currentUser=props.currentUser;
    const classCode=props.classCode;

    useEffect(() => {
        setloading(true);
        let ref=db.ref(`/classes/${classCode}`);
        ref.once("value",(snapshot)=>{
            setClassworkNotes(snapshot.val().classwork);
            setloading(false);
        })
    }, [isAssignnotes]);
    

    const uploadButton=()=>{
        try{
            const metadata={
                contentType:'application/pdf',
            };
            const storage=getStorage();
            const storageRef=ref(storage,`/classroom/classwork/${noteFile.name}`);
            const uploadTask=uploadBytesResumable(storageRef,noteFile,metadata);

            uploadTask.on("state_changed",
                (snapshot)=>{
                    setloading(true);
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    if(progress===100){
                        setTimeout(()=>{
                            savingData();
                        },10000);
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

                let ref=db.ref(`/classes`);
                ref.once("value",(snapshot)=>{
                    snapshot.forEach((child)=>{
                        if(child._delegate.ref._path.pieces_[1]===classCode){
                            let classwork=child.val().classwork; 
                            classwork.push({["noteMessage"]:noteMessage,["noteLink"]:noteFileUrl});
                            let classInfo={...child.val(),["classwork"]:classwork};
                            ref.child(child._delegate.ref._path.pieces_[1]).set(classInfo);
                            console.log("notes given");
                            setloading(false);
                        }
                    })
                    setAssignnotes(false);
                })
            }

        }
        catch(error){
            console.log(error);
            alert(error);
        }
    }

    if(currentUser===undefined || loading){
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
        <div className='classwork'>
            <div className='assign_note'>
                <NoteAddIcon className='assign_note_icon'/>
                <input type='button' className='assign_note_button' value='Add Notes/work...' onClick={()=>{setAssignnotes(!isAssignnotes)}}></input>
            </div>
            {
                isAssignnotes && 
                <div className='add_assign_note'>
                    <input type="file" name="file" className='choose' accept="application/pdf" onChange={(event)=>{setNoteFile(event.target.files[0])}}></input>
                    <textarea placeholder="Write Something..." rows='5' onChange={(event)=>{setNoteMessage(event.target.value)}}></textarea>
                    <button onClick={uploadButton} className='uploadButton'>Upload</button>
                </div>
            }

            {
                classworkNotes!==undefined && classworkNotes.slice(1).reverse().map((note,index)=>{
                    return (
                        <div className='classwork_card'>
                            <input type="text" readOnly className='classwork_card_link' value={note.noteLink}/>
                            <p className='classwork_card_message'>{note.noteMessage}</p>
                        </div>
                    );
                })

            }
        </div>
        </>
    );
}

export default Classwork_section;