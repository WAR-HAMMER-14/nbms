import React from 'react'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as config from '../utilities/config';
import Navbar from './includes/Navbar';
import routes from './routesConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as SessionMsg from './SwalSessionExpire';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AccessDenied from './AccessDenied';
import FilterOutputText from '../utilities/util';


const EditAttendee = () => {

    const [userAccess, setUserAccess] = useState(false);

    const flag = 'edit';
    if(flag === 'edit')
    {
        document.title = "BMS : Edit Attendee Details";
    }
    else
    {
        document.title = "BMS : Add Attendee Details";
    }

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);


    const id = queryParams.get('id');

    const [attendeeDetails, setAttendeeDetails] = useState({building_id:'', first_name:'', last_name:'', organisation_name:'', phone:'', purpose:'', start_time:'', end_time:''});

    const [purposes, setPurposes] = useState([]);

    axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('authKey')}`;
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

    const postData = new FormData();
    postData.append('flag','getAttendeeDetails');
    postData.append('id',id);

    async function getPurposeLists()
     {
         try{
             const res = await axios.post(config.API_BASE_URL+'getPurposeLists.php');
             // console.log(res);
 
             if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
             {
                 SessionMsg.swalSessionExpire();
             }
             else
             {
                const result = res.data;
                // console.log(result);
                setPurposes(result);
             }
         
 
         }
         catch(err){
             console.log(err);
         }
     }
     
     // for fetching Attendee details from database
     async function getAttendeeDet(postData)
     {
         try{
             const res = await axios.post(config.API_BASE_URL+'getAttendeeDetails.php',postData);
             // console.log(res);
 
             if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
             {
                 SessionMsg.swalSessionExpire();
             }
             else
             {
                const result = res.data;
                // console.log(result);
                setAttendeeDetails({building_id:result.building_id, first_name:result.first_name, last_name:result.last_name, organisation_name:result.organisation_name, phone:result.phone, purpose:result.purpose, start_time:new Date(result.start_time), end_time: (result.end_time !== '0000-00-00 00:00:00' ? new Date(result.end_time): '')});
             }
         
 
         }
         catch(err){
             console.log(err);
         }
     }


     // get user access permission to edit attendee details
     async function getUserAttendeeAccessDet()
     {
        const postData = new FormData();
        if(localStorage.getItem('loginType')==='user')
        {
            postData.append('flag','checkUserAccess');
            postData.append('user_id',localStorage.getItem('userId'));
            postData.append('id',id);
        }
         try{
             const res = await axios.post(config.API_BASE_URL+'getAttendeeDetails.php',postData);
             // console.log(res);
 
             if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
             {
                 SessionMsg.swalSessionExpire();
             }
             else
             {
                if(res.data == "ACCESS_GRANTED")
                {
                    setUserAccess(true);
                }
                else if(res.data == "ACCESS_DENIED")
                {
                    setUserAccess(false);
                }

                // console.log(res.data);
             }
         
 
         }
         catch(err){
             console.log(err);
         }
     }

     useEffect(() => {
        getAttendeeDet(postData);
        if(localStorage.getItem('loginType')==='user')
        {
            getUserAttendeeAccessDet();
        }
        getPurposeLists();
        
    },[]);



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

    const changeHandler = (event) => {
        setAttendeeDetails({...attendeeDetails,[event.target.name]:event.target.value});
    }

    const handleStartDateChange = (date) => {
        setAttendeeDetails({...attendeeDetails,start_time:date});
    };

    const handleEndDateChange = (date) => {
        setAttendeeDetails({...attendeeDetails,end_time:date});
    };

    const submitHandler = (event) => {
        
        event.preventDefault();

        if(attendeeDetails.first_name === '')
        {
            alertWarning('Please enter first name');
            return false;     
        }

        if(attendeeDetails.last_name === '')
        {
            alertWarning('Please enter last name');
            return false;     
        }

        if(attendeeDetails.organisation_name === '')
        {
            alertWarning('Please enter organisation name');
            return false;     
        }

        if(attendeeDetails.phone === '')
        {
            alertWarning('Please enter phone');
            return false;     
        }

        if(attendeeDetails.purpose === '')
        {
            alertWarning('Please enter purpose');
            return false;     
        }

        if(attendeeDetails.start_time === null)
        {
            alertWarning('Please enter start time');
            return false;     
        }



        const postData = new FormData();

        postData.append('buildingId',attendeeDetails.building_id);
        postData.append('firstName',attendeeDetails.first_name);
        postData.append('lastName',attendeeDetails.last_name);
        postData.append('organisationName',attendeeDetails.organisation_name);
        postData.append('phone',attendeeDetails.phone);
        postData.append('purpose',attendeeDetails.purpose);
        postData.append('startTime',attendeeDetails.start_time);
        postData.append('endTime',attendeeDetails.end_time);
        postData.append('attendeeId',id);
        postData.append('flag','edit');

        console.log(postData);

        addEditAttendee(postData);

        async function addEditAttendee(postData)
        {
            try{
                const auth_key = localStorage.getItem('authKey');
                postData.append('auth_key', auth_key);
                const response = await axios.post(config.API_BASE_URL+'addEditAttendee.php',postData);
                //  console.log(response);
                const respData = response.data.split('_');

                if(respData[0] === 'success')
                {
                    if(flag !== 'edit')
                    {
                        alertSuccess('Attendee Record added successfully');
                    }
                    else
                    {
                        alertSuccess('Attendee Record updated successfully');
                    }
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

    

    if(localStorage.getItem('loginType')==='user' && userAccess === false)
    {
        return <AccessDenied />
    }


     return (
        <>
            <section className="container-fluid">
                <div className="row">
                    <Navbar links={routes} />
                    <div className='col-md-10'>
                        <div className="bms_Right">
                            <h1>{flag === 'edit' ?'Edit':'Add'} Attendee Report</h1>
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
                                <div className='col-md-4'>
                                    <label>First Name</label>
                                    <input type='text' required id="outlined-basic"  className='' name="first_name"  placeholder="First Name" onChange={changeHandler} value={FilterOutputText(attendeeDetails.first_name)} variant="outlined" />
                                </div>
    
                                <div className='col-md-4'>
                                    <label>Last Name</label>
                                    <input type='text' required id="outlined-basic"  className='' name="last_name" placeholder="Last Name" onChange={changeHandler} value={FilterOutputText(attendeeDetails.last_name)} variant="outlined" />
                                </div>
    
                                <div className='col-md-4'>
                                    <label>Organisation Name</label>
                                    <input type='text' required id="outlined-basic"  className='' name="organisation_name" placeholder="Organisation Name" onChange={changeHandler} value={FilterOutputText(attendeeDetails.organisation_name)} variant="outlined" />
                                </div>
    
                                <div className='col-md-4'>
                                    <label>Phone</label>
                                    <input type='text' required id="outlined-basic"  className='' name="phone" placeholder="Phone" onChange={changeHandler} value={FilterOutputText(attendeeDetails.phone)} variant="outlined" />
                                </div>
    
                                <div className='col-md-4'>
                                    <label>Purpose</label>
                                    <select name='purpose' onChange={changeHandler}>
                                        <option>Select Purpose</option>
                                    {purposes.map((purpose, index) => (
                                        <option value={purpose.id} key={index}  selected={attendeeDetails.purpose===purpose.id?true:false} >{purpose.purpose}</option>
                                    ))}
                                    </select>
                                </div>
    
                                <div className='col-md-4'>
                                    <label>Start Time</label>
                                    <DatePicker
                                        selected={attendeeDetails.start_time}
                                        onChange={handleStartDateChange}
                                        showTimeSelect
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        name="start_time" 
                                        timeIntervals={5}
                                    />
                                </div>
    
                                <div className='col-md-4'>
                                <label>End Time</label>
                                    <DatePicker
                                        selected={attendeeDetails.end_time}
                                        onChange={handleEndDateChange}
                                        showTimeSelect
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        name="end_time" 
                                        timeIntervals={5}
                                    />
                                </div>
    
                                <div className='col-md-12'>
                                    <Button variant="contained" className='submitBtn' onClick={submitHandler}>Save</Button>
                                    <Link to={'/attendeeReports'}><Button variant="contained" className='back_butt'>Back</Button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
      )
}

export default EditAttendee;