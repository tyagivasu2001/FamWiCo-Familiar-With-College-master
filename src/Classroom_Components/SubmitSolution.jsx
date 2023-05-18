import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';
import db from '../firebase';
import './ClassComp.css';

const SubmitSolution=(props)=>{
    const [solutionFile,setSolutionFile]=useState();
    const [solName,setSolName]=useState();
    const [loading,setloading]=useState(false);
    let solutionFileUrl='';

    const setIdx=props.setIdx;
    const assignments=props.assignments;
    const index=props.index;
    const classCode=props.classCode;

    const uploadSolutionButton=()=>{
        const idx=assignments.length-1-index;
        try{
            const metadata={
                contentType:'application/pdf',
            };
            const storage=getStorage();
            const storageRef=ref(storage,`/classroom/assignmentsSolutions/${solutionFile.name}`);
            const uploadTask=uploadBytesResumable(storageRef,solutionFile,metadata);

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
                        solutionFileUrl=downloadURL;
                    })
                }
            );

            const savingData=async()=>{
                console.log('saving data');

                let ref=db.ref(`/classes`);
                ref.once("value",(snapshot)=>{
                    snapshot.forEach((child)=>{
                        if(child._delegate.ref._path.pieces_[1]===classCode){
                            let assignments=child.val().assignments;
                            assignments[idx].submittedBy.push({assignSolLink:solutionFileUrl,studentName:solName});
                            let classInfo={...child.val(),["assignments"]:assignments};
                            ref.child(child._delegate.ref._path.pieces_[1]).set(classInfo);
                            console.log("assignment given");
                            setloading(false);
                        }
                    })
                });
                setIdx(undefined);
            }

        }
        catch(error){
            console.log(error);
            alert(error);
        }
    }

    if(loading){
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
        <div className='add_assign_work'>
            <input type="file" name="file" className='choose' accept="application/pdf" onChange={(event)=>{setSolutionFile(event.target.files[0])}}></input>
            <textarea placeholder="Your name" rows='5' onChange={(event)=>{setSolName(event.target.value)}}></textarea>
            <button  className='uploadButton' onClick={uploadSolutionButton}>Upload</button>
        </div>
    );
}

export default SubmitSolution;