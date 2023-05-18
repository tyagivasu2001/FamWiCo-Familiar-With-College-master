import React, { useEffect, useState } from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import './Note.css';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { NavLink, useNavigate } from 'react-router-dom';
import db, { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const NotePost=()=>{
    const navigate=useNavigate();
    const [notes,setnotes]=useState([]);
    const [notesNodes,setnotesNodes]=useState([]);
    const [user,loading,error]=useAuthState(auth);
    const [liked,setLiked]=useState(true);

    const likeStyle={};

    if(liked){
        likeStyle.backgroundColor='skyblue';
    }

    useEffect(() => {
        let ref = db.ref("/notes");
        ref.on("value", snapshot => {
            let arr1=[];
            let arr2=[];
            snapshot.forEach((child)=>{
                arr1.push(child.val());
                arr2.push(child._delegate.ref._path.pieces_[1]);
            })

            setnotes(arr1);
            setnotesNodes(arr2);
        })
        
    },[]);

    const handleLike=(event,index)=>{
        let idx=notes.length-1-index;
        let ref = db.ref(`/notes/${notesNodes[idx]}`);
        if(!notes[idx].like.includes(user.email)){
            notes[idx].like.push(user.email);
            ref.update(notes[idx]);
            setLiked(true);
        }
        else{
            notes[idx].like.splice(notes[idx].like.indexOf(user.email));
            ref.update(notes[idx]);
            setLiked(true);
        }
    }

    const handleComment=(event,index)=>{
        navigate('/note/comments',{state:{nodes:notesNodes,posts_notes:notes,index:index,post:'false'}})
    }

    const handleShare=(event,index)=>{
        alert("we are building...");
    }
    
    return (
        <>
        <div className='NotePost'>
            <div className='addNote'>
                <NoteAddIcon className='addNoteIcon'/>
                <NavLink className='addNoteNav' to='/note/uploadNotes'>Add Notes...</NavLink>
            </div>

            {
                notes.slice(0).reverse().map((note,index)=>{
                    return (
                        <div className='NotePost_main'>
                            <div className='NotePost_owner_info' onClick={()=>{navigate('/profileuser',{state:{user:note.user}})}}>
                                <img className='NotePost_owner_img' src={note.user.profileImageUrl} alt="pic"></img>
                                <input className='NotePost_owner_name' type='text' readOnly value={note.user.name}></input>
                            </div>
                            <p className='note_msg' >{note.noteMessage}</p>
                            <div className='NotePost_img'>
                                <InsertDriveFileIcon className='npfile'/>
                                <a className='npfile_name' href={note.noteFileUrl}>{note.noteFileUrl}</a>
                            </div>
                            {/* <input type="button" value='View' className='viewPdf' onClick={(event)=>handleUrlClick()}/> */}
                            <hr style={{width:'90%', backgroundColor:'black'}}/>
                            <div className='NotePost_activity'>
                                <input type='button' value={"Like " + note.like.length} style={note.like.includes(user.email)?likeStyle:null} onClick={(event)=>handleLike(event,index)}></input>
                                <input type='button' value='Comment'  onClick={(event)=>handleComment(event,index)}></input>
                                <input type='button' value='Share'  onClick={(event)=>handleShare(event,index)}></input>
                            </div>
                        </div>
                    );
                })
            }
            
        </div>
        </>
    );
}

export default NotePost;