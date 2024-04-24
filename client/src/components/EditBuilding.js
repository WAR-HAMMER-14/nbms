import React from 'react'
import { useLocation } from 'react-router-dom';
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
import AddBuilding from './AddBuilding';
import AccessDenied from './AccessDenied';


const EditBuilding = () => {

    const [buildingDet , setBuildingDet] = useState(null);
    const [buildingServiceDet , setBuildingServiceDet] = useState(null);

    const [userAccess, setUserAccess] = useState(false);


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);


    const id = queryParams.get('id');
    const flag = 'edit';
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authKey')}`;
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

    const postData = new FormData();
    postData.append('flag','building_det');
    postData.append('flag2','service_det');
    postData.append('id',id);


    // for fetching users from database
    async function getBuildingDet(postData)
    {
        try{
            const res = await axios.post(config.API_URL+'buildingDet',postData);
            // console.log(res.data);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                const receivedData = res.data;
                const dataArr = receivedData.split('<@^@>');
                setBuildingDet(JSON.parse(dataArr[0]));
                setBuildingServiceDet(JSON.parse(dataArr[1]));
                // console.log(JSON.parse(dataArr[0]));
            }
        

        }
        catch(err){
            console.log(err);
        }
    }

    // get user access permission to edit building information
    async function getUserBuildingAccessDet()
    {
        const postData = new FormData();
        if(localStorage.getItem('loginType')==='user')
        {
            postData.append('flag','checkUserAccess');
            postData.append('user_id',localStorage.getItem('userId'));
            postData.append('id',id);
        }

        try{
            const res = await axios.post(config.API_URL+'buildingDet',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                const receivedData = res.data;
                const dataArr = receivedData.split('<@^@>');

                const access = JSON.parse(dataArr[0]);

                if(access == "ACCESS_GRANTED")
                {
                    setUserAccess(true);
                }
                else if(access == "ACCESS_DENIED")
                {
                    setUserAccess(false);
                }

                // console.log(dataArr[0]);

                // console.log(JSON.parse(dataArr[0]));
            }
        

        }
        catch(err){
            console.log(err);
        }
    }


    useEffect(() => {
        getBuildingDet(postData);
        if(localStorage.getItem('loginType')==='user')
        {
            getUserBuildingAccessDet();
        }
    },[]);


    if (buildingDet === null || buildingServiceDet === null) {
        return <p>Loading...</p>; // You can replace this with a loading indicator or message
    }

    if(localStorage.getItem('loginType')==='user' && userAccess === false)
    {
        return <AccessDenied />
    }

    return (
        <>
            <AddBuilding buildingDet={buildingDet} buildingServiceDet={buildingServiceDet} flag={flag}/>
        </>
    );


//   return (
//     <>
//         <AddBuilding buildingDet={buildingDet} buildingServiceDet={buildingServiceDet} flag={flag}/>
//     </>
//   )
}

export default EditBuilding;