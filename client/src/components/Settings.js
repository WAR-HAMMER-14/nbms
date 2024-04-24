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
import * as SessionMsg from './SwalSessionExpire'
import PasswordChecklist from "react-password-checklist"


const Settings = () => {

    document.title = "BMS : Settings";

const [password,setPassword] = useState({pass:'',confPass:''});
const [submitBtn, setSubmitBtn] = useState(true);



axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('authKey')}`;
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

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
const submitHandler = (event) => {
    event.preventDefault();

    const postData = new FormData();
    postData.append('password',password.pass);
    postData.append('confirmPassword',password.confPass);
    postData.append('flag','UPDATE_PASSWORD');
    postData.append('user_type',localStorage.getItem('loginType'));

    if(localStorage.getItem('loginType')==='user')
    {
        postData.append('id',localStorage.getItem('userId'));
    }
    else if(localStorage.getItem('loginType')==='admin')
    {
        postData.append('id',localStorage.getItem('adminId'));
    }

    // console.log(postData);
    
    updatePassword(postData);


}


// update password
async function updatePassword(postData) {
    try{
        const res = await axios.post(config.API_BASE_URL+'updatePassword.php',postData);
        // console.log(res);

        if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
        {
            SessionMsg.swalSessionExpire();
        }
        else
        {
            if(res.data === "SUCCESS")
            {
                alertSuccess("Password Updated Successfully");
            }
            else if(res.data === "PASSWORD_NOT_MATCH")
            {
                alertError("Password Not Match");
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
    
    <section class="container-fluid">
            <div class="row">
                <Navbar links={routes} />
                <div class="col-md-10">
                    <div className='bms_Right'>
                        <div className='row'>
                            <div className='col'></div>
                            <div className='col-md-5'>
                                <h1>Change Password</h1>
                                <div className='col-md-12 clearfix'>&nbsp;</div>
                                <ToastContainer position="top-center"
                                    autoClose={5000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="light" 
                                />
                                
                                <div className='row'>
                                    <div className='col-md-12'>
                                        <label>Password: </label>
                                        <input type='password' name='pass' placeholder="Password" onChange={changeHandler} value={password.pass} />
                                    </div>

                                    <div className='col-md-12'>
                                        <label>Confirm Password: </label>
                                        <input type='password' name='confPass' placeholder="Confirm Password" onChange={changeHandler} value={password.confPass} />
                                    </div>
                                    <div className='col-md-12'>
                                        <PasswordChecklist
                                            rules={["minLength","specialChar","number","capital","match"]}
                                            minLength={8}
                                            value={password.pass}
                                            valueAgain={password.confPass}
                                            onChange={(isValid) => {setSubmitBtn(!isValid);}}
                                            />
                                    </div>

                                    <div className='col-md-12 clearfix'>&nbsp;</div>
                                    
                                    <div className='col-md-12'>
                                        <Button variant="contained" className='add_butt' disabled={submitBtn} onClick={submitHandler}>Submit</Button>
                                        <Link to={'/users'}><Button variant="contained" className='back_butt'>Back</Button></Link>
                                    </div>
                                    <div className='clearfix'>&nbsp;</div>
                                    <div className='clearfix'>&nbsp;</div>
                                    <div className='clearfix'>&nbsp;</div>
                                    <div className='clearfix'>&nbsp;</div>
                                </div>
                            </div>
                            <div className='col'></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


    </>
  )
}

export default Settings