import React, { useState } from 'react';
import './App.css';
import {NavLink, useNavigate} from 'react-router-dom';
import { register } from './Auth';
import { getStorage,ref,uploadBytesResumable,getDownloadURL } from 'firebase/storage';

const Signin=()=>{
    let navigate=useNavigate();
    const [form,setForm] = useState({
        name:'',
        email:'',
        phone:'',
        course:'',
        branch:'',
        password:'',
    })

    const [image,setImage]=useState(null);
    let imageUrl='';

    const changeImage=(event)=>{
        setImage(event.target.files[0]);
    }

    const changeHandler=(event)=>{
        const {name,value}=event.target;

        setForm((preval)=>{
            return {
                ...preval,
                [name]:value,
            }
        });
    }
    
    const handleSubmit = async(e)=>{
        try{
            //user registration
            await register({email:form.email,password:form.password});

            //uploading profile image in storage and getting url
            const uploading=()=>{
                const storage=getStorage();
                const metadata={
                    contentType: 'image/*',
                };

                const storageRef=ref(storage,`profileImages/${image.name}`);
                const uploadTask= uploadBytesResumable(storageRef,image,metadata);

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
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            console.log('File available at', downloadURL);
                            imageUrl=downloadURL;
                        });
                    }
                )

            }

            //saving user data to realtime database
            const savingData=()=>{
                console.log("saving data now");
                const res= fetch("https://famwico-default-rtdb.firebaseio.com/users.json",
                {
                    method:"POST",
                    headers:{
                        contentType:'application/json',
                    },
                    body:JSON.stringify({...form,profileImageUrl:imageUrl}),
                });
            }

            uploading();

            navigate('/')
        }
        catch(err){
            console.log(err);
            alert(err);
        }
    }
    return (
        <>
            <div className='Signin_main'>
                <div className='Signin'>
                        <input type="text" minLength='3' maxLength='20' placeholder='Enter Name' className='SigninInput' onChange={changeHandler} name='name' value={form.name}/>
                        <input required type="email" placeholder='Enter Email' className='SigninInput' onChange={changeHandler} name='email' value={form.email}/>
                        <input required type="number" minLength='10' maxLength='10' placeholder='Enter Mobile no.' className='SigninInput' onChange={changeHandler} name='phone' value={form.phone}/>
                        <input type="text" placeholder='Enter Course' className='SigninInput' onChange={changeHandler} name='course' value={form.course}/>
                        <input type="text" placeholder='Enter Branch(if any)' className='SigninInput' onChange={changeHandler} name='branch' value={form.branch}/>
                        <input type="text" placeholder='Enter Password' className='SigninInput' onChange={changeHandler} name='password' value={form.password}/>
                        <p style={{backgroundColor:'transparent', fontSize:'small'}}>Select image for profile</p>
                        <input type="file" accept='image/*' placeholder='Enter profle image' className='SigninInput' onChange={changeImage}/>
                        <button type='submit' className='SigninButton' value='Signin' onClick={handleSubmit}>Sign In</button>
                        <div className='toLogIn'>
                            <p>Already have account?</p>
                            <NavLink to='/login' className='loginNav'>Login</NavLink>
                        </div>
                </div>
            </div>
        </>
    );
}

export default Signin;