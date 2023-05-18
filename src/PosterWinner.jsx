import React, { useEffect, useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import db from './firebase';

const PosterWinner=()=>{
    const [maxLikerPost,setLikerPost]=useState();
    const [maxLikerNotes,setLikerNotes]=useState();

    const [loading,setloading]=useState(false);
    
    useEffect(() => {
        setloading(true);
        let ref = db.ref("/posts");
        ref.once("value", snapshot => {
            let maxLike=0;
            snapshot.forEach((child)=>{
                if(child.val().like.length>maxLike){
                    maxLike=child.val().like.length;
                    setLikerPost(child.val());
                }
            })
            setloading(false);
        })
        
    },[]);

    useEffect(() => {
        setloading(true);
        let ref = db.ref("/notes");
        ref.once("value", snapshot => {
            let maxLike=0;
            snapshot.forEach((child)=>{
                if(child.val().like.length>maxLike){
                    maxLike=child.val().like.length;
                    setLikerNotes(child.val());
                }
            })
            setloading(false);
        })
        
    },[]);

    if(maxLikerPost===undefined || maxLikerNotes===undefined){
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
        <div className='posterWinner_main'>
            <p className='title'>the user who got most likes on his/her post</p>
            <div className='posterWinner'>
                <img className='posterWinner_img' src={maxLikerPost.user.profileImageUrl} alt="Winner"></img>
                <p>{maxLikerPost.user.name}</p>
                <p>{maxLikerPost.user.course}</p>
                <p>{maxLikerPost.user.branch}</p>
            </div>

            <p className='title'>the user who got most likes on his/her notes</p>
            <div className='posterWinner'>
                <img className='posterWinner_img' src={maxLikerNotes.user.profileImageUrl} alt="Winner"></img>
                <p>{maxLikerNotes.user.name}</p>
                <p>{maxLikerNotes.user.course}</p>
                <p>{maxLikerNotes.user.branch}</p>
            </div>
        </div>
        </>
    );
}

export default PosterWinner;