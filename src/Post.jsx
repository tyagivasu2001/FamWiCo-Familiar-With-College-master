import React,{ useEffect, useState } from 'react';
import './Post.css';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { NavLink,useNavigate } from 'react-router-dom';
import db, { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BallTriangle } from 'react-loader-spinner';


const Post=()=>{
    const navigate=useNavigate();
    
    const [posts,setPosts]=useState([]);
    const [postsNodes,setPostsNodes]=useState([]);
    const [user,error]=useAuthState(auth);
    const [liked,setLiked]=useState(true);
    
    const [loading,setloading]=useState();

    const likeStyle={};

    if(liked){
        likeStyle.backgroundColor='skyblue';
    }

    useEffect(() => {
        setloading(true);
        let ref = db.ref("/posts");
        ref.on("value", snapshot => {
            let arr1=[];
            let arr2=[];
            snapshot.forEach((child)=>{
                arr1.push(child.val());
                arr2.push(child._delegate.ref._path.pieces_[1]);
            })

            setPosts(arr1);
            setPostsNodes(arr2);
            setloading(false);
        })
        
    },[]);

    const handleLike=(event,index)=>{
        let idx=posts.length-1-index;
        let ref = db.ref(`/posts/${postsNodes[idx]}`);
        if(!posts[idx].like.includes(user.email)){
            posts[idx].like.push(user.email);
            ref.update(posts[idx]);
            setLiked(true);
        }
        else{
            posts[idx].like.splice(posts[idx].like.indexOf(user.email));
            ref.update(posts[idx]);
            setLiked(true);
        }

        
    }

    const handleComment=(event,index)=>{
        navigate('/post/comments',{state:{nodes:postsNodes,posts_notes:posts,index:index,post:'true'}})
    }

    const handleShare=(event,index)=>{
        alert("we are building...");
    }

    if(loading){
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
        <div className='post'>
            <div className='addPost'>
                <AddAPhotoIcon className='addPostIcon'/>
                <NavLink className='addPostNav' to='/post/AddPost'>Add Post...</NavLink>
            </div>

            {
                posts.slice(0).reverse().map((post,index)=>{
                    return (
                    <>
                    <div className='post_main' key={index}>
                        <div className='post_owner_info' onClick={()=>{navigate('/profileuser',{state:{user:post.user}})}}>
                            <img className='post_owner_img' src={post.user.profileImageUrl} alt="pic"></img>
                            <input className='post_owner_name' readOnly value={post.user.name}></input>
                            <div className='post_time'>
                                <input type="text" readOnly value={post.postTime.split(" ")[1]+" "+post.postTime.split(" ")[2]} />
                                <input type="text" readOnly value={post.postTime.split(" ")[0] }/>
                            </div>
                        </div>
                        <hr style={{width:'98%',margin:'10px 4px 4px 4px',backgroundColor:'black'}}/>
                        <p className='post_msg'>{post.postMessage}</p>
                        <img className='post_img' src={post.postFileUrl} alt="pic" ></img>
                        <div className='post_activity'>
                            <input type='button' value={'Like '+post.like.length} style={post.like.includes(user.email)?likeStyle:null} onClick={(event)=>handleLike(event,index)} key={index}></input>
                            <input type='button' value='Comment' onClick={(event)=>handleComment(event,index)}></input>
                            <input type='button' value='Share' onClick={(event)=>handleShare(event,index)}></input>
                        </div>
                    </div>
                    </>
                    );
                })
            }
            
        </div>
        </>
    );
}

export default Post;