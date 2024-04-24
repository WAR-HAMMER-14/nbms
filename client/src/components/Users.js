import React from 'react'
import SearchComponent from './SearchComponent'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import * as config from '../utilities/config';
import { checkLogin, authKeyHeader } from '../utilities/auth'
import Navbar from './includes/Navbar';
import routes from './routesConfig';
import Swal from 'sweetalert2';
import * as SessionMsg from './SwalSessionExpire'
import User from './User'
import Pagination from './Pagination';





const Users = () => {

    document.title = "BMS : User Management";

    const [users, setUsers] = useState([]);
    
    const [paginationCount, setPaginationCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [checkAll, setCheckAll] = useState(false); // all checkbox state

    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authKey')}`;
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

    // for fetching users from database
    async function getUsers(postData)
    {
        try{
            const res = await axios.post(config.API_URL+'getUsersList',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                // console.log(res.data);
                const resArr = res.data;
                const dataArr = resArr.split('<@_@>');

                setUsers(JSON.parse(dataArr[0]));
                setPaginationCount(JSON.parse(dataArr[1]));
                setCurrentPage(JSON.parse(dataArr[2]));

                // console.log(JSON.parse(dataArr[0]));
                // console.log(JSON.parse(dataArr[1]));
                // console.log(JSON.parse(dataArr[2]));
            }

        }
        catch(err){
            console.log(err);
        }
    }

    // for searching user event handler
    const searchHandler = async (name,email,building) => {

    const postData = new FormData();
    postData.append('name', name);
    postData.append('email', email);
    postData.append('building', building);
    postData.append('flag','users_list');
    
    console.log(postData);

    getUsers(postData); // calllcing get function

    }


    // for deleting user event handler
    const deleteUserHandler = (id) => {
        const postData = new FormData();
        postData.append('id', id);
        postData.append('flag','delete');

        swalConfirmAlert('Users will be deleted permanently','1',handleConfirmDelete);
        function handleConfirmDelete()
        {
            deleteUser(postData); // calllcing delete user function
        }
    }

    // check all user event handler
    const checkAllHandler = (event) => {

        const isChecked = event.target.checked;
        setCheckAll(isChecked);
        // Update the checked state for each user
        setUsers((prevUsers) =>
        prevUsers.map((user) => ({ ...user, isChecked }))
        );
    
    }

    // swal alert for deleting multiple users
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
                number+" Users has been deleted.",
                'success'
                )
                handleConfirmDelete();
            }
            })
    }

    // swal alert for not selecting any user
    const swalAlert = (data) => {
        Swal.fire({
            title: data,
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok'
            })
    }

    // for multi delete user event handler
    const multiDeleteHandler = () => {

        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        if(checkboxes.length === 0)
        {
            swalAlert('Please select atleast one User');
            return false;
        }
        else if(checkboxes.length > 0)
        {
            swalConfirmAlert('Users will be deleted permanently',checkboxes.length,handleConfirmDelete);
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
                
                deleteUser(postData); // calling delete user function
            }
        }
    }


    async function deleteUser(postData)
    {
        try{
            const res = await axios.post(config.API_URL+'updateUser', postData);

            console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                console.log(res.data);
                // getUsers('');
                paginateHandler(1);
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const paginateHandler = (page) => {
        const postData = new FormData();
        postData.append('currPage',page);
        postData.append('flag','users_list');

        getUsers(postData);
    }




    useEffect(() => {
        const postData = new FormData();
        postData.append('currPage',currentPage);
        postData.append('flag','users_list');
        getUsers(postData);
    },[]);


  return (
    <>
        <section className="container-fluid">
    	    <div className="row">
                <Navbar links={routes} />
                <div className='col-md-10'>
                    <div className="bms_Right">
                        <h1>User Management</h1>
                        <div className='row'>
                            <div className='col-md-12'>
                                <SearchComponent onSearch={searchHandler} />
                            </div>
                            <div className='col-md-12'>
                                <div className='tableBase'>
                                    <div className='table-responsive'>
                                        <table className="table table-striped" border="0">
                                            <thead>
                                                <tr>
                                                    <th width="50px"><input className='form-check-input' type='checkbox' name='checkbox' onClick={checkAllHandler} checked={checkAll}/></th>
                                                    <th width="50px">User ID</th>
                                                    <th width="180px">First Name</th>
                                                    <th width="180px">Last Name</th>
                                                    <th width="220px">Email</th>
                                                    <th width="200px">Buildings Access</th>
                                                    <th width="100px">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.length > 0 ?(users.map((user,index) =>(<User key={user.id}  isChecked={user.isChecked}  setUsers={setUsers} onDelete={deleteUserHandler} user={user}/>))): (<td colSpan='7' style={{backgroundColor: 'rgb(238, 238, 238)'}}><h3>No data available</h3></td>)}
                                            </tbody>
                                            
                                        </table>
                                    </div>
                                    <div className='row spaceLeft'>
                                        <div className='col-md-4'>
                                            <Link to={'/addUser'}><Button variant="contained" className='add_butt' >Add</Button></Link>
                                            <Button variant="contained" className='back_butt' onClick={multiDeleteHandler} >Delete</Button>
                                        </div>
                                        <div className='col-md-8'>
                                            <Pagination pageCount={paginationCount} currentPage={currentPage} onPageNav={paginateHandler} />
                                        </div>
                                    </div>
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

export default Users