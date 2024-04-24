import React from 'react'
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import * as config from '../utilities/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const Login = ({flag}) => {

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const navigate = useNavigate();
    

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const inputEmailHandler = (e) => {
        setEmail(e.target.value);
        setEmailError(false);
       
    }

    const inputPasswordHandler = (e) => {  
        setPassword(e.target.value);
        setPasswordError(false);
    }

    const loginHandler = () => {

        if(email === '')
        {
            toastError('email cannot be empty');
            setEmailError(true);
            return false;
        }

        if(password === '')
        {
            toastError('password cannot be empty');
            setPasswordError(true);
            return false;
        }

        const postData = new FormData();
        postData.append('email', email);
        postData.append('password', password);
        // postData.append('flag', flag);

        console.log(postData);
        checkLogin(postData);
    }

    const toastError = (data) => {
        toast.error(data, {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
    }

    async function checkLogin(postData)
    {
        try{
            const response = await axios.post(config.API_URL+'login',postData);

            console.log(response.data);
            
            const responseCode = response.data.split('<@_@>')[0];
            //stringify JSON array
            const responseData = response.data.split('<@_@>')[1];

            const authKey = response.data.split('<@_@>')[2];

            const loginType = response.data.split('<@_@>')[3];
            // console.log(responseCode);
            // console.log(responseData); 

            if(responseCode == 'LOGIN_SUCCESS')
            {
                if(loginType == 'admin')
                {
                    // alert('Login Successfull'+response.data);
                    navigate('/dashboard');
                    localStorage.setItem('isLoggedIn',true);
                    localStorage.setItem('loginType','admin');
                    localStorage.setItem('adminId',responseData);
                    localStorage.setItem('authKey',authKey);

                    console.log(authKey);

                }
                else if(loginType == 'user')
                {
                    // alert('Login Successfull'+response.data);
          
                    navigate('/dashboardUser');
                    localStorage.setItem('isLoggedIn',true);
                    localStorage.setItem('loginType','user');
                    localStorage.setItem('userId',responseData);
                    localStorage.setItem('authKey',authKey);
                
                }

            }
            else if(responseCode == 'LOGIN_FAILED:WRONG_PASSWORD')
            {
                // alert('Invalid Credentials'+response.data);
                setEmailError(true);
                setPasswordError(true);
                toastError('Incorrect Email or Password!');
                
            }

        }
        catch(err)
        {
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
        <h1>User LogIn</h1>

        <fieldset>
        <legend>Email</legend>
            <input type="email"  placeholder="E.g. email@company.com" onChange={inputEmailHandler} />
        </fieldset>

        <fieldset>
        <legend>Password</legend>
            <input type="password"  placeholder="************" onChange={inputPasswordHandler} />
        </fieldset>
        <Link to={'/forgotPass'}><p>Forgot Password?</p></Link>
        <Button className='loginButton' variant="contained" onClick={loginHandler} size="large">Login</Button>

    </div>
    <div className='col'></div>
        </div>

        </section>
        



    </>
  )
}

export default Login