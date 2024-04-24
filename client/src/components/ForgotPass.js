import React from 'react'
import { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as config from '../utilities/config';
import Navbar from './includes/Navbar';
import routes from './routesConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as SessionMsg from './SwalSessionExpire';
import validator from 'validator'


const ForgotPass = () => {

    document.title = "BMS : Forgot Password";

    const [email,setEmail] = useState('');
    


    const changeHandler = (event) => {
        setEmail(event.target.value);
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


    // submit handler with validations
    const submitHandler = (event) => 
    {
        event.preventDefault();

        const postData = new FormData();
        
        if(email !== '')
        {
            if(validator.isEmail(email))
            {
                postData.append('email',email);
            }
            else
            {
                alertError("Please enter a valid email!");
                return false;
            }
           
        }
        else
        {
            alertError("Please enter email");
            return false;
        }


        postData.append('flag','FORGOT_PASSWORD');

        // console.log(postData);
        
        forgotPassword(postData);


    }


    // update password
    async function forgotPassword(postData) 
    {
        try{
            const res = await axios.post(config.API_BASE_URL+'forgotPassword.php',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                if(res.data === "SUCCESS")
                {
                    alertSuccess("Success! \n \n If a matching account was found, an email was sent to allow you to reset your password. ");
                    setEmail('');
                }
                else if(res.data === "INVALID_EMAIL")
                {
                    alertError("Invalid Email: Email not found in Database!");
                }
                else if(res.data === "EMAIL_NOT_PROVIDED")
                {
                    alertError("Email not provided");
                }
                else if(res.data === "UNKNOWN_ERROR")
                {
                    alertError("Unknown Error Occured!");
                }
               
                console.log(res.data);
            }

        }
        catch(err){
            console.log(err);
        }

    }


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
                <h1>Forgot Password</h1>

                <fieldset>
                <legend>Email</legend>
                    <input type="text" name='email' placeholder="Email"  onChange={changeHandler} value={email} />
                </fieldset>
                
                                


                <Button className='sendForgotPassBtnStyle'  variant="contained" onClick={submitHandler} >Send Password Reset Link</Button>&nbsp;
                <Link to={'/admin'}><Button className='refToLoginBtn'>Back to Login</Button></Link>

            </div>
            <div className='col'></div>
        </div>
    </section>


    </>
  )
}

export default ForgotPass