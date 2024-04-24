import React from 'react'
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import { Link, json } from 'react-router-dom';
import axios from 'axios';
import * as config from '../utilities/config';
import Navbar from './includes/Navbar';
import routes from './routesConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as SessionMsg from './SwalSessionExpire';
import PasswordChecklist from "react-password-checklist";
import { useLocation } from 'react-router-dom';


const SetPassword = () => {

    document.title = "BMS : Set Password";

    const [email, setEmail] = useState('');
    const [password,setPassword] = useState({pass:'',confPass:''});
    const [submitBtn, setSubmitBtn] = useState(true);
    const [passwordError, setPasswordError] = useState(true); 
    const [tokenValid, setTokenValid] = useState(false); 

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const token = queryParams.get('token');

    console.log(token);

    const changeHandler = (event) => {
    setPassword({...password,[event.target.name]:event.target.value});
    }
        
    const alertSuccess = (data) => toast.success(data, { 
        position: "top-center", 
        autoClose: 10000, 
        hideProgressBar: false, 
        closeOnClick: true, 
        pauseOnHover: true, 
        draggable: true, 
        progress: undefined, 
        theme: "light",
    });

    const alertError = (data) => toast.error(data, {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });

    const alertWarning = (data) => toast.warn(data, {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });


    // submit handler with validations
    const submitHandler = (event) => 
    {
        event.preventDefault();

        const postData = new FormData();
        postData.append('password',password.pass);
        postData.append('confirmPassword',password.confPass);
        postData.append('flag','SET_PASSWORD');
        postData.append('token',token);

        // console.log(postData);
        
        updatePassword(postData);


    }


    // update password
    async function updatePassword(postData) 
    {
        try{
            const res = await axios.post(config.API_BASE_URL+'setPassword.php',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                if(res.data === "SUCCESS")
                {
                    alertSuccess("Password Set Successfully");
                    setPasswordError(false);
                    setSubmitBtn(true);
                }
                else if(res.data === "PASSWORD_NOT_MATCH")
                {
                    alertError("Password Not Match");
                    setPasswordError(true);
                }
                else if(res.data === "TOKEN_NOT_PROVIDED" || res.data === "INVALID_TOKEN")
                {
                    alertError("Password Set Failed: Invalid Token / Token Not Provided");
                    setPasswordError(true);
                }
                console.log(res.data);
            }

        }
        catch(err){
            console.log(err);
        }

    }


        // get token info
        async function getUserDetByToken(postData) 
        {
            try{
                const res = await axios.post(config.API_BASE_URL+'setPassword.php',postData);
                // console.log(res);
    
                if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
                {
                    SessionMsg.swalSessionExpire();
                }
                else
                {
                    const dataArr = res.data.split("<@_@>");
                    if(dataArr[0] === "SUCCESS")
                    {
                        const userDet = JSON.parse(dataArr[1]);
                        setEmail(userDet.email);   
                        setTokenValid(true);
                    }
                    else if(dataArr[0] === "TOKEN_NOT_PROVIDED" || dataArr[0] === "INVALID_TOKEN")
                    {
                        alertError("Invalid Token / Token Not Provided");
                        setPasswordError(true);
                        setTokenValid(false);
                    }
                    console.log(dataArr);
                }
    
            }
            catch(err){
                console.log(err);
            }
    
        }

        useEffect(() => {
            const postData = new FormData();
            postData.append('flag','GET_TOKEN_DET');
            postData.append('token',token);
            getUserDetByToken(postData);
        },[])


  return (
    <>
    
    <section className="container">
        <div className='row'>
            <div className='col-md-12'>
                <ToastContainer
                    position="top-center"
                    autoClose={6000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    style={{width:"600px"}}
                />
            </div>
            <div className='col'></div>
            <div className='col-md-5 loginHolder'>
                <h1>Set Password</h1>
                {tokenValid ? <>

                <fieldset>
                <legend>Email</legend>
                    <input type="email" name='pass' placeholder="Password" disabled="true"  value={email} />
                </fieldset>

                <fieldset>
                <legend>Password</legend>
                    <input type="password" name='pass' placeholder="Password" disabled={!passwordError} onChange={changeHandler} value={password.pass} />
                </fieldset>

                <fieldset>
                <legend>Confirm Password</legend>
                    <input type='password' name='confPass' placeholder="Confirm Password" disabled={!passwordError} onChange={changeHandler} value={password.confPass} />
                </fieldset>
                
                
                <PasswordChecklist
                    rules={["minLength","specialChar","number","capital","match"]}
                    minLength={8}
                    value={password.pass}
                    valueAgain={password.confPass}
                    onChange={(isValid) => {setSubmitBtn(!isValid);}}
                    />
                                


                <Button className={submitBtn ? 'resetPassBtnDisable': 'resetPassBtnEnable'}  variant="contained" disabled={submitBtn} onClick={submitHandler} size="large">Set Password</Button>&nbsp;
                { !passwordError ? (<Link to={'/admin'}><Button className='refToLoginBtn'>Go to Login</Button></Link>):''}
                </>:<h3 style={{color:'red',fontWeight:'600'}}>Invalid Token</h3>}

            </div>
            <div className='col'></div>
        </div>
    </section>
    
    </>
  )
}

export default SetPassword