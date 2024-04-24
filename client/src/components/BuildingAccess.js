import React from 'react'

import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
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
import SingleBuildingAccess from './SingleBuildingAccess';


const BuildingAccess = () => {

    document.title = "BMS : Set Building Access";

    const [buildings, setBuildings] = useState([]);
    const [accessControls, setAccessControls] = useState([]);
    const [userBuildingAccessList, setUserBuildingAccessList] = useState([]);
    const [userBuildings, setUserBuilding] = useState([]);
    const [accessCheckboxes,setAccessCheckboxes] = useState([]);
    const [userDetails, setUserDetails] = useState({});

    const addNewBuildingAccess = () => {
        const newComponent = <SingleBuildingAccess key={userBuildingAccessList.length} onDeletePress={deleteAccessHandler} onBuildingChange={buildingChangeHandler} onCheckboxChange={checkboxChangeHandler} childIndex={userBuildingAccessList.length} buildings={buildings} accessControls={accessControls} />
        setUserBuildingAccessList(prevList => [...prevList, newComponent]);
        setUserBuilding(prevUserBuildings => [...prevUserBuildings,'']);
        setAccessCheckboxes(prevAccessCheckboxes => [...prevAccessCheckboxes, []]);
        
    }

    const deleteAccessHandler = (index) => {
        checkboxChangeHandler([''],index);
        buildingChangeHandler('',index);
        setUserBuildingAccessList(prevList => 
            prevList.map((item, i) => 
            i === index ? [] : item
            )
        );
        alertWarning("Please click Submit All to save the changes");
    }

    const checkboxChangeHandler = (value, index) => {
        // console.log('hello---'+value);
        // console.log(index);
        setAccessCheckboxes(prevAccessCheckboxes => 
                    prevAccessCheckboxes.map((checkbox, i) => 
                    i === index ? value : checkbox
                )
            );
    }

    const buildingChangeHandler = (value, index) => {
        // console.log(value);
        setUserBuilding(prevUserBuildings => 
            prevUserBuildings.map((building, i) => 
                i === index ? value : building
            )
        );
    }

    useEffect(()=>{
       console.log(accessCheckboxes); 
       console.log(userBuildings); 
    },[accessCheckboxes,userBuildings])



    const loadPreviousUserBuildingAccessData = (data) => {
        if(data !== 0)
        {
            setUserBuildingAccessList([]);
            setUserBuilding([]);
            setAccessCheckboxes([]);


            data.map((userData,index)=>{
                
                setUserBuilding(prevUserBuildings => [...prevUserBuildings,userData.building_id]);
                const userDataCb = userData.AC_ID.split(',');
                setAccessCheckboxes(prevAccessCheckboxes => [...prevAccessCheckboxes, userDataCb]);
                const newComponent = <SingleBuildingAccess key={index} onDeletePress={deleteAccessHandler} selectedBuilding={userData.building_id} selectedAccess={userDataCb} onBuildingChange={buildingChangeHandler} onCheckboxChange={checkboxChangeHandler} childIndex={index} buildings={buildings} accessControls={accessControls} />
                setUserBuildingAccessList(prevList => [...prevList, newComponent]);
                
            })
        }
    }

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const user_id = queryParams.get('id');

 

    axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('authKey')}`;
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

    // fetching previous building access records
    async function getExistingBuildingAccessRecords()
    {
        const postData = new FormData();
        postData.append('flag','user_building_access_records');
        postData.append('user_id',user_id);
        try{
            const res = await axios.post(config.API_BASE_URL+'buildingAssignDet.php',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                // console.log(res.data);
                loadPreviousUserBuildingAccessData(res.data);
            }

        }
        catch(err){
            console.log(err);
        }
    }

    // fetching user details by user id
    async function getUserDetailsByUserId(user_id)
    {
        const postData = new FormData();
        postData.append('flag','user_det');
        postData.append('id',user_id);
        try{
            const res = await axios.post(config.API_BASE_URL+'userDet.php',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                setUserDetails(res.data);
                console.log(res.data);
            }

        }
        catch(err){
            console.log(err);
        }
    }


    // for fetching buildings from database
    async function getBuildingsList()
    {
        const postData = new FormData();
        postData.append('flag','buildings');
        try{
            const res = await axios.post(config.API_BASE_URL+'buildingAssignDet.php',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                setBuildings(res.data);
                // console.log(res.data);
            }

        }
        catch(err){
            console.log(err);
        }
    }

    // for fetching Access Controll List from database
    async function getAccessControllList()
    {
        const postData = new FormData();
        postData.append('flag','AC_list');
        try{
            const res = await axios.post(config.API_BASE_URL+'buildingAssignDet.php',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                setAccessControls(res.data);
                // console.log(res.data);
            }

        }
        catch(err){
            console.log(err);
        }
    }

    // for updating user building access
    async function updateUserBuildingAccessControll(postData,index)
    {
        // console.log(postData);
        try{
            const res = await axios.post(config.API_BASE_URL+'updateUserBuildingAccessControll.php',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                alertSuccess('Building Access Assigned Successfully');

                // setting state variables after suucessfully inserting to the database
                // Remove elements based on index from state variables
                // setUserBuildingAccessList(prevList => prevList.filter((_, i) => i !== index));
                // setUserBuilding(prevUserBuildings => prevUserBuildings.filter((_, i) => i !== index));
                // setAccessCheckboxes(prevAccessCheckboxes => prevAccessCheckboxes.filter((_, i) => i !== index));

                // console.log(res.data);
            }

        }
        catch(err){
            console.log(err);
        }

    }

        // for updating user building access
        async function deletePreviousUserBuildingAccessPermissions()
        {
            const postData = new FormData();
            postData.append('flag','delete_previous_records');
            postData.append('user_id',user_id);

            try{
                const res = await axios.post(config.API_BASE_URL+'updateUserBuildingAccessControll.php',postData);
                // console.log(res);
    
                if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
                {
                    SessionMsg.swalSessionExpire();
                }
                else
                {
                    console.log(res.data);
                }
    
            }
            catch(err){
                console.log(err);
            }
    
        }


    const singleSubmitHandler = async (buildingId, accessIdArray,index) => {
        // console.log('buildId--> '+buildingId);
        // console.log(accessIdArray);

        

        const postData = new FormData();
        postData.append('flag', 'add_building_access');
        postData.append('user_id',user_id);
        postData.append('building_id',buildingId);
        postData.append('access_arr',JSON.stringify(accessIdArray));

        await updateUserBuildingAccessControll(postData,index);

    }




    const submitAllHandler = async () => {
        // console.log(userBuildings);
        // console.log(accessCheckboxes);

        await deletePreviousUserBuildingAccessPermissions();

        userBuildings.forEach((userBuildingId,index) =>{
            // console.log(accessCheckboxes[index]);
            if(userBuildingId !== '' && accessCheckboxes[index].length > 0 )
            {
                singleSubmitHandler(userBuildingId,accessCheckboxes[index],index);
            }
        })

    }
    
    useEffect(()=>{
        getBuildingsList();
        getAccessControllList();
        getUserDetailsByUserId(user_id);
    },[])

    useEffect(()=>{
        if (buildings.length > 0 && accessControls.length > 0) 
        {
            // Only call this function when both buildings and accessControls are set
            getExistingBuildingAccessRecords();
        }
    },[buildings,accessControls])


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

  return (
    <>
    <section className="container-fluid">
    <div className="row">
        <Navbar links={routes} />
            
        <div className="col-md-10"> 

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
            <div className="bms_Right">
                <h1>Modify User Building Access</h1>
                <h5><i>{userDetails.first_name} {userDetails.last_name}</i></h5>
                <div className="buildingService">
                    <div className='row'>
                        {userBuildingAccessList.length > 0 ? userBuildingAccessList.map((buildingComponent) => (buildingComponent)) : <div className='col-md-12'><h4>No BuildingAccess Found !</h4></div>}
                    

                        <div className='col-md-12 containerSpace'></div>

                        <div className='col-md-12'>
                            <Button variant="contained" className='add_butt' onClick={addNewBuildingAccess}>Add Building</Button>
                            <hr />
                        </div>
                        <div className='col-md-12'>
                            
                            <Button variant="contained" className='SaveDraff' onClick={submitAllHandler}>Submit All</Button>
                            <Link to={'/users'}><Button variant="contained" className='back_butt'>Back</Button></Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        </div>
    </section>
    </>
  )
}

export default BuildingAccess