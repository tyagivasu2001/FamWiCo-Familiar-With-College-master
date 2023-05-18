import React, { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import db, { auth } from './firebase';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import './Comments.css';
import {useNavigate} from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';

const Comments=()=>{
    const navigate=useNavigate();
    const location=useLocation();
    const nodes=location.state.nodes;
    const posts_notes=location.state.posts_notes;
    const index=location.state.index;
    const fromPost=location.state.post;

    const [user,loading,error]=useAuthState(auth);
    const [currentUser,setCurrentUser]=useState();
    const [helper,setHelper]=useState(false);

    const [comments,setComments]=useState();
    const [newComment,setNewComment]=useState('');

    useEffect(()=>{
        let ref = db.ref("/users");
        ref.on("value", snapshot => {
            snapshot.forEach((child)=>{
                if(child.val().email===user.email){
                    setCurrentUser(child.val());
                    setHelper(true);
                }
            })
        })

        let idx=posts_notes.length-1-index;
        if(fromPost==='true'){
            console.log("post");
            let ref = db.ref(`/posts/${nodes[idx]}`);
            ref.once("value",(snapshot)=>{
                setComments(snapshot.val().comments);
                setHelper(true);
            })
        }
        else{
            let ref = db.ref(`/notes/${nodes[idx]}`);
            ref.once("value",(snapshot)=>{
                setComments(snapshot.val().comments);
                setHelper(true);
            })
        }
    },[helper,newComment]);

    const addComment=()=>{
        let idx=posts_notes.length-1-index;
        if(fromPost==='true'){
            let ref = db.ref(`/posts/${nodes[idx]}`);
            ref.once("value",(snapshot)=>{
                let arr=(snapshot.val().comments);
                arr.push({comment:newComment,commentor:currentUser});
                ref.set({...snapshot.val(),['comments']:arr});
                setNewComment('');
            })
        }
        else{
            let ref = db.ref(`/notes/${nodes[idx]}`);
            ref.once("value",(snapshot)=>{
                let arr=(snapshot.val().comments);
                arr.push({comment:newComment,commentor:currentUser});
                ref.set({...snapshot.val(),['comments']:arr});
                setNewComment('');
            })
        }
    }

    if(currentUser===undefined || comments===undefined){
        return <h1>loading...</h1>
    }

    return (
        <div className='comments_main'>
            <div className='comments'>
                <div className='comments_add'>
                    <input type="text" placeholder='Add Comment...' value={newComment} onChange={(event)=>{setNewComment(event.target.value)}} />
                    <ArrowUpwardIcon className='sendarrow' onClick={addComment}/>
                </div>
                {
                    comments.slice(1).reverse().map((comment)=>{
                        return (
                        <div className='comments_show'>
                            <div className='comments_show_user' onClick={()=>{navigate('/profileuser',{state:{user:comment.commentor}})}}>
                                <img src={comment.commentor.profileImageUrl} alt="pic" />
                                <input type="text" readOnly className='user' value={comment.commentor.name}/>
                            </div>
                            <hr style={{width:'100%'}}/>
                            <div className='comment_div'>
                                <p className='comment'>{comment.comment}</p>
                            </div>
                        </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Comments;