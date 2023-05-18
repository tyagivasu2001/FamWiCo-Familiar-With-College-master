import React, { useEffect, useState } from 'react';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import '../Classroom_Components/ClassComp.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import db from '../firebase';
import SubmitSolution from './SubmitSolution';
import { BallTriangle } from 'react-loader-spinner';


const Assignment_section=(props)=>{
    const [isAssignwork,setAssignwork]=useState(false);
    const [file,setFile]=useState();
    const [assignmentMessage,setAssignmentMessage]=useState();
    let assignmentFileUrl='';

    const [loading,setloading]=useState(false);

    const [assignments,setAssignments]=useState();
    const [idx,setIdx]=useState();

    const currentUser=props.currentUser;
    const classCode=props.classCode;
    const teacherEmail=props.teacherEmail;

    useEffect(() => {
        setloading(true);
        let ref=db.ref(`/classes/${classCode}`);
        ref.once("value",(snapshot)=>{
            setAssignments(snapshot.val().assignments);
            setloading(false);
        })
    }, [isAssignwork]);
    

    const uploadButton=()=>{
        try{
            const metadata={
                contentType:'application/pdf',
            };
            const storage=getStorage();
            const storageRef=ref(storage,`/classroom/assignents/${file.name}`);
            const uploadTask=uploadBytesResumable(storageRef,file,metadata);

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
                        assignmentFileUrl=downloadURL;
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
                            let assignments=child.val().assignments; 
                            assignments.push({["assignmentMessage"]:assignmentMessage,["assignmentLink"]:assignmentFileUrl,submittedBy:[{assignSolLink:"",studentName:''}]});
                            let classInfo={...child.val(),["assignments"]:assignments};
                            ref.child(child._delegate.ref._path.pieces_[1]).set(classInfo);
                            console.log("assignment given");
                            setloading(false);
                        }
                        setAssignwork(false);
                    })
                })
            }

        }
        catch(error){
            console.log(error);
            alert(error);
        }
    }

    if(idx!==undefined){
        return <SubmitSolution assignments={assignments} index={idx} classCode={classCode} setIdx={setIdx}/>
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
        <div className='assignment'>
            {
                currentUser.email===teacherEmail && 
                <div className='assign_work'>
                <NoteAddIcon className='assign_work_icon'/>
                <input type='button' className='assign_work_button' value='Add Assignment...' onClick={()=>{setAssignwork(!isAssignwork)}}></input>
            </div>
            }
            {
                isAssignwork && 
                <div className='add_assign_work'>
                    <input type="file" name="file" className='choose' accept="application/pdf" onChange={(event)=>{setFile(event.target.files[0])}}></input>
                    <textarea placeholder="Write Something..." rows='5' onChange={(event)=>{setAssignmentMessage(event.target.value)}}></textarea>
                    <button onClick={uploadButton} className='uploadButton'>Upload</button>
                </div>
            }

            {
                assignments!==undefined && assignments.slice(1).reverse().map((assignment,index)=>{
                    return (
                        <div className='assignment_card'>
                            <a className='assignment_card_link' href={assignment.assignmentLink} style={{overflow:'hidden'}}>{assignment.assignmentLink}</a>
                            <p className='assignment_card_message'>{assignment.assignmentMessage}</p>
                            {
                                (currentUser.email===teacherEmail) ? 
                                    <input type="button" className='assignment_card_submittedBy' value={`SubmittedBy: ${assignment.submittedBy.length} students (click to see)`} onClick={()=>{console.log("clicked")}}/>
                                    :
                                    <input type="button" className='assignment_card_submitsolution' value='Submit Solution' onClick={()=>{setIdx(index)}}/>
                            }
                        </div>
                    );
                })

            }
        </div>
        </>
    );
}

export default Assignment_section;