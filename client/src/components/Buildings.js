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
import Building from "./Building";
import SearchBuilding from "./SearchBuilding";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from "./Pagination";

const Buildings = () =>{

    document.title = "BMS : Building Management";

    const [buildings, setBuildings] = useState([]);

    const [checkAll, setCheckAll] = useState(false); // all checkbox state

    const [paginationCount, setPaginationCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authKey')}`;
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

    // for fetching building from database
    async function getBuildings(postData)
    {
        try{
            const res = await axios.post(config.API_URL+'buildingLists',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {

                const resArr = res.data;
                const dataArr = resArr.split('<@_@>');

                setBuildings(JSON.parse(dataArr[0]));
                setPaginationCount(JSON.parse(dataArr[1]));
                setCurrentPage(JSON.parse(dataArr[2]));



                // setBuildings(res.data);
                // console.log(res.data);
                // console.log(JSON.parse(dataArr[0]));
            }

        }
        catch(err){
            console.log(err);
        }
    }

     // for searching user event handler
     const searchHandler = (buildingName,buildingStrataNumber,buildingAddress) => {
        const postData = new FormData();
        postData.append('buildingName', buildingName);
        postData.append('buildingStrataNumber', buildingStrataNumber);
        postData.append('buildingAddress', buildingAddress);

        if(localStorage.getItem('loginType')==='user')
        {
            postData.append('flag','user');
            postData.append('user_id',localStorage.getItem('userId'));
        }
        
    
        // console.log(postData);
    
        getBuildings(postData); // calllcing get function
    
        }

    // for deleting Building event handler
    const deleteBuildingHandler = (id) => {
        const postData = new FormData();
        postData.append('id', id);
        postData.append('flag','delete');

        swalConfirmAlert('Building will be deleted permanently','1',handleConfirmDelete);
        function handleConfirmDelete()
        {
            deleteBuilding(postData); // calling delete Building function
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
        getBuildings(postData);
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

    // for multi delete Building event handler
    const multiBuildingDeleteHandler = () => {

        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        if(checkboxes.length === 0)
        {
            swalAlert('Please select atleast one Building');
            return false;
        }
        else if(checkboxes.length > 0)
        {
            swalConfirmAlert('Building will be deleted permanently',checkboxes.length,handleConfirmDelete);
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
                
                deleteBuilding(postData); // calling delete Buildin function
            }
        }
    }


    async function deleteBuilding(postData)
    {
        try{
            const res = await axios.post(config.API_URL+'updateBuilding', postData);

            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                // console.log(res.data);
                // getBuildings('');
                paginateHandler(1);
            }
        }
        catch(err){
            console.log(err);
        }
    }


    // swal alert for deleting multiple Buildings
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
                number+" Buildings has been deleted.",
                'success'
                )
                handleConfirmDelete();
            }
            })
    }


    // check all building event handler
    const checkAllHandler = (event) => {

        const isChecked = event.target.checked;
        setCheckAll(isChecked);
        // Update the checked state for each building
        setBuildings((prevBuildings) =>
        prevBuildings.map((building) => ({ ...building, isChecked }))
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
        getBuildings(postData);
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
                        <h1>Building Management</h1>
                        <div className="searchBase">
                            <div className="searchHead">Search</div>
                            <SearchBuilding onSearch={searchHandler} /> 
                        </div>
                        <div className="tableBase">
    				        <div className="table-responsive">
                  		        <table className="table table-striped" border="0">
                                    <thead>
                                        <tr>
                                            <th scope="col"><input className='form-check-input' type='checkbox' name='checkbox' onClick={checkAllHandler} checked={checkAll}/></th> 
                                            <th scope="col">Strata Number</th>
                                            <th scope="col">Building Name</th>
                                            <th scope="col">Publish Status</th>
                                            <th scope="col">Address</th>
                                            <th scope="col">Building Manager</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {buildings.length > 0 ?(buildings.map((building,index) =>(<Building key={building.id}  isChecked={building.isChecked}  setBuildings={setBuildings} onDelete={deleteBuildingHandler} building={building}/>))): (<tr><td colSpan="6">No data available</td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                            <div className="row spaceLeft">
                                <div className="col-md-6 ">
                                    {/* <a href="#" class="add_butt">Add</a> <a href="#" class="back_butt">Back</a> */}
                                    {localStorage.getItem('loginType') !== 'user' ? 
                                    <>
                                        <Link to={'/addBuilding'}><Button variant="contained" className='add_butt' >Add</Button></Link>
                                        <Button variant="contained" className='back_butt' onClick={multiBuildingDeleteHandler} >Delete</Button>
                                    </> 
                                    : ''}
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

export default Buildings;