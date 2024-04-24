import React from "react";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import * as config from '../utilities/config';
import { checkLogin, authKeyHeader } from '../utilities/auth';
import Navbar from './includes/Navbar';
import routes from './routesConfig';
import Swal from 'sweetalert2';
import * as SessionMsg from './SwalSessionExpire';
import AttendeeReport from "./AttendeeReport";
import SearchAttendee from "./SearchAttendee";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AttendeePdf from "./AttendeePdf";
import Pagination from "./Pagination";

const AttendeeReports = () =>{

    document.title = "BMS : Attendee Reports";

    const [attendees, setAttendees] = useState([]);

    const [checkAll, setCheckAll] = useState(false); // all checkbox state

    const [pdfSearchBuilding, setPdfSearchBuilding] = useState('');
    const [pdfSearchStartDate, setPdfSearchStartDate] = useState('');
    const [pdfSearchEndDate, setPdfSearchEndDate] = useState('');

    const [paginationCount, setPaginationCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('authKey')}`;
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

    // for fetching attendees from database
    async function getAttendees(postData)
    {
        try{
            const res = await axios.post(config.API_BASE_URL+'getAttendeeLists.php',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                const resArr = res.data;
                const dataArr = resArr.split('<@_@>');

                setAttendees(JSON.parse(dataArr[0]));
                setPaginationCount(JSON.parse(dataArr[1]));
                setCurrentPage(JSON.parse(dataArr[2]));

                // setAttendees(res.data);
                // console.log(res.data);
                // console.log(JSON.parse(dataArr[0]));
            }

        }
        catch(err){
            console.log(err);
        }
    }

     // for searching user event handler
     const searchHandler = (startTime,endTime,buildingId) => {
        const postData = new FormData();
        postData.append('startTime', startTime);
        postData.append('endTime', endTime);
        postData.append('buildingId', buildingId);
        
        if(localStorage.getItem('loginType')==='user')
        {
            postData.append('flag','user');
            postData.append('user_id',localStorage.getItem('userId'));
        }

        setPdfSearchBuilding(buildingId);
        setPdfSearchStartDate(startTime);
        setPdfSearchEndDate(endTime);
    
        // console.log(postData);
    
        getAttendees(postData); // calllcing get function
    
        }

    // for deleting Attendee event handler
    const deleteAttendeeHandler = (id) => {
        const postData = new FormData();
        postData.append('id', id);
        postData.append('flag','delete');
// console.log(postData);
        swalConfirmAlert('Attendee will be deleted permanently','1',handleConfirmDelete);
        function handleConfirmDelete()
        {
            deleteAttendee(postData); // calling delete Attendee function
        }
    }


    const paginateHandler = (page) => {
        const postData = new FormData();
        if(localStorage.getItem('loginType')==='user')
        {
            postData.append('flag','user');
            postData.append('user_id',localStorage.getItem('userId'));
        }
        postData.append('currPage',page);
        getAttendees(postData);
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

    // swal alert for not selecting any user
    const swalAlert = (data) => {
        Swal.fire({
            title: data,
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
            })
    }

    // for multi delete Attendee event handler
    const multiAttendeeDeleteHandler = () => {

        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        if(checkboxes.length === 0)
        {
            swalAlert('Please select atleast one Attendee');
            return false;
        }
        else if(checkboxes.length > 0)
        {
            swalConfirmAlert('Attendee will be deleted permanently',checkboxes.length,handleConfirmDelete);
            function handleConfirmDelete()
            {
                const postData = new FormData();
                const idArray = [];
                postData.append('flag','multiDelete');
                checkboxes.forEach((checkbox) => {
                    if(checkbox.checked)
                    {
                        idArray.push(checkbox.id);
                    }
                });
                postData.append('id',idArray);
                // console.log(idArray);
                
                deleteAttendee(postData); // calling delete attendee function
            }
        }
    }


    async function deleteAttendee(postData)
    {
        try{
            const res = await axios.post(config.API_BASE_URL+'updateAttendee.php', postData);

            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                // console.log(res.data);
                // getAttendees('');
                paginateHandler(1);
            }
        }
        catch(err){
            console.log(err);
        }
    }

    // swal alert for deleting multiple Attendee
    const swalConfirmAlert = (msg,number,handleConfirmDelete) => {
        Swal.fire({
            title: 'Are you sure?',
            text: number+" "+msg,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
            }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                'Deleted!',
                number+" Attendee has been deleted.",
                'success'
                )
                handleConfirmDelete();
            }
            })
    }


    // check all attendee event handler
    const checkAllHandler = (event) => {

        const isChecked = event.target.checked;
        setCheckAll(isChecked);
        // Update the checked state for each attendee
        setAttendees((prevAttendee) =>
        prevAttendee.map((attendee) => ({ ...attendee, isChecked }))
        );
    
    }

    useEffect(() => {
        const postData = new FormData();

        if(localStorage.getItem('loginType')==='user')
        {
            postData.append('flag','user');
            postData.append('user_id',localStorage.getItem('userId'));
        }
        postData.append('currPage',currentPage);
        getAttendees(postData);
    },[]);

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
                        <h1>Attendee Report</h1>
                        <div className="searchBase">
                            <div className="searchHead">Search</div>
                            <SearchAttendee onSearch={searchHandler} /> 
                        </div>
                        <div className="tableBase">
    				        <div className="table-responsive">
                  		        <table className="table table-striped" border="0">
                                    <thead>
                                        <tr>
                                            <th scope="col"><input className='form-check-input' type='checkbox' name='checkbox' onClick={checkAllHandler} checked={checkAll}/></th> 
                                            <th scope="col">First Name</th>
                                            <th scope="col">Last Name</th>
                                            <th scope="col">Organisation Name</th>
                                            <th scope="col">Building</th>
                                            <th scope="col">Phone</th>
                                            <th scope="col">Purpose</th>
                                            <th scope="col">Start Time</th>
                                            <th scope="col">End Time</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendees.length > 0 ?(attendees.map((attendee,index) =>(<AttendeeReport key={attendee.id}  isChecked={attendee.isChecked}  setAttendees={setAttendees} onDelete={deleteAttendeeHandler} attendee={attendee}/>))): (<tr><td colSpan="10">No data available</td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                            <div className="row spaceLeft">
                                <div className="col-md-6 ">
                                    {attendees.length > 0 ?<AttendeePdf attendeeSearchBuildngId={pdfSearchBuilding} attendeeSearchStartDate={pdfSearchStartDate} attendeeSearchEndDate={pdfSearchEndDate}/>:''}
                                    { localStorage.getItem('loginType') !== 'user' ? <Button variant="contained" className='back_butt' onClick={multiAttendeeDeleteHandler} >Delete</Button> : ''}
                                    
                                    
                                </div>
                                <div className="col-md-6">
                                    <Pagination pageCount={paginationCount} currentPage={currentPage} onPageNav={paginateHandler} />               			
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

export default AttendeeReports;