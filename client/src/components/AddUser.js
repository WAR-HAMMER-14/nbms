import React from 'react'

import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import validator from 'validator'
import axios from 'axios';
import * as config from '../utilities/config';
import Navbar from './includes/Navbar';
import routes from './routesConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as SessionMsg from './SwalSessionExpire'





const AddUser = ({userDet,flag}) => {

    if(flag === 'edit')
    {
        document.title = "BMS : Edit User";
    }
    else
    {
        document.title = "BMS : Add User";
    }
    

const [user,setUser] = useState({first_name: userDet.first_name, last_name:userDet.last_name, email:userDet.email});

const [lastUserId, setLastUserId] = useState('');

const [error, setError] = useState({ first_name_err:false, last_name_err:false, email_err:false});

const [errorMsg, setErrorMsg] = useState({ first_name_err_msg:'', last_name_err_msg:'', email_err_msg:''});


axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('authKey')}`;
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

const changeHandler = (event) => {
    setUser({...user,[event.target.name]:event.target.value});
    setError({...error,[event.target.name + '_err']:false});
    setErrorMsg({...errorMsg,[event.target.name + '_err_msg']:''});

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
    
    if(user.first_name === '')
    {
        setErrorMsg({...errorMsg,first_name_err_msg:'Please enter first name'});
        setError({...error,first_name_err:true});
        alertWarning('Please enter first name');
        return false;     
    }

    if(user.last_name === '')
    {
        setErrorMsg({...errorMsg,last_name_err_msg:'Please enter last name'});
        setError({...error,last_name_err:true});
        alertWarning('Please enter last name');
        return false;     
    }

    if(user.email !== '')
    {
        if(validator.isEmail(user.email))
        {
            // alert('Valid email');
            // setError({...error,email_err:false});
           
        }
        else
        {
            setErrorMsg({...errorMsg,email_err_msg:'Please enter valid email'});
            setError({...error,email_err:true});
            alertWarning('Please enter valid email');
            return false;
        }
    }
    else
    {
        setErrorMsg({...errorMsg,email_err_msg:'Please enter email'});
        setError({...error,email_err:true});
        alertWarning('Please enter email');
        return false;
    }

    

    
    const postData = new FormData();

    if(flag === 'edit')
    {
        postData.append('first_name',user.first_name);
        postData.append('last_name',user.last_name);
        postData.append('email',user.email);
        postData.append('user_id',lastUserId);
        postData.append('flag','edit');
        
    }
    else
    {
        postData.append('first_name',user.first_name);
        postData.append('last_name',user.last_name);
        postData.append('email',user.email);
        postData.append('flag','add');
    }
    

    addEditUser(postData); // calling add user function


    async function addEditUser(postData)
    {
        try{
            const auth_key = localStorage.getItem('authKey');
            postData.append('auth_key', auth_key);
            const response = await axios.post(config.API_BASE_URL+'addEditUser.php',postData);
            console.log(response);
            const respData = response.data.split('_');

            if(respData[0] === 'success')
            {
                if(flag !== 'edit')
                {
                    alertSuccess('User added successfully');
                    setUser({first_name:'',last_name:'',email:''});
                }
                else
                {
                    alertSuccess('User edited successfully');
                }
                
                setLastUserId(respData[1]);
            }
            else if(response.data === 'email_exist')
            {
                alertError('Email already exist');
                setError({...error,email_err:true});
                setErrorMsg({...errorMsg,email_err_msg:'Email already exist in the database'});
            }
            else if(response.data === "AUTH_KEY_NOT_PROVIDED" || response.data === "VALIDATION_TIME_ERROR" || response.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }

        }
        catch(err){
            console.log(err);
        }
    }




}

useEffect(() => {
    setUser({
      first_name: userDet.first_name,
      last_name: userDet.last_name,
      email: userDet.email
    });
    setLastUserId(userDet.id);
  }, [userDet]);

   





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
                                <h1>{flag === 'edit' ?'Edit':'Add'} User</h1>
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
                                        <label>First Name: </label>
                                        <input type='text' name='first_name' id='first_name' placeholder="First Name" onChange={changeHandler} value={user.first_name} />
                                        {/* <TextField required id="outlined-basic" error={error.first_name_err} className='form-control addInputStyle' name="first_name" helperText={errorMsg.first_name_err_msg} label="First Name" onChange={changeHandler} value={user.first_name} variant="outlined" /> */}
                                    </div>

                                    <div className='col-md-12'>
                                        <label>Last Name: </label>
                                        <input type='text' name='last_name' id='last_name' placeholder="Last Name" onChange={changeHandler} value={user.last_name} />
                                        {/* <TextField required id="outlined-basic" error={error.last_name_err} className='form-control addInputStyle' name="last_name" helperText={errorMsg.last_name_err_msg} label="Last Name" onChange={changeHandler} value={user.last_name} variant="outlined" /> */}
                                    </div>

                                    <div className='col-md-12'>
                                        <label>Email: </label>
                                        <input type='text' name='email' id='email' placeholder="Email" onChange={changeHandler} value={user.email} />
                                        {/* <TextField required id="outlined-basic" error={error.email_err} className='form-control addInputStyle' name="email" label="Email" helperText={errorMsg.email_err_msg} onChange={changeHandler} value={user.email} variant="outlined" /> */}
                                    </div>

                                    
                                    <div className='col-md-12'>
                                        <Button variant="contained" className='add_butt' onClick={submitHandler}>{flag === 'edit' ?'Update':'Add'} User</Button>
                                        <Link to={'/users'}><Button variant="contained" className='back_butt'>Back</Button></Link>
                                        {lastUserId != '' ? (<Link to={`/buildingAccess?id=${lastUserId}`}><Button variant="contained" className='back_butt'>Add Access Control</Button></Link>):''}
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

AddUser.defaultProps = {
    flag: '',
    userDet: {
        id: '',
        first_name: '',
        last_name: '',
        email: '',
    },
}


export default AddUser
