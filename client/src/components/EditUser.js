import React from 'react'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios';
import * as config from '../utilities/config';
import 'react-toastify/dist/ReactToastify.css';
import * as SessionMsg from './SwalSessionExpire'
import AddUser from './AddUser';


const EditUser = () => {

    const [userDet , setUserDet] = useState();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);


    const id = queryParams.get('id');
    const flag = 'edit';
    axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('authKey')}`;
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

    const postData = new FormData();
    postData.append('flag','user_det');
    postData.append('id',id);


    // for fetching users from database
    async function getUserDet(postData)
    {
        try{
            const res = await axios.post(config.API_BASE_URL+'userDet.php',postData);
            console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                setUserDet(res.data);
                console.log(res.data);
            }

        }
        catch(err){
            console.log(err);
        }
    }


    useEffect(() => {
        getUserDet(postData);
    },[]);



  return (
    <>
        <AddUser userDet={userDet} flag={flag}/>
    </>
  )
}

export default EditUser