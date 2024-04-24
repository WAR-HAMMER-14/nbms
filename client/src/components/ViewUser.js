import React from 'react'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import axios from 'axios';
import * as config from '../utilities/config';
import 'react-toastify/dist/ReactToastify.css';
import * as SessionMsg from './SwalSessionExpire'
import Navbar from './includes/Navbar';
import routes from './routesConfig';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';



const ViewUser = () => {

    document.title = "BMS : View User";

    const [userDet , setUserDet] = useState('');

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);


    const id = queryParams.get('id');
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
        <section className="container-fluid">
            <div className="row">
                <Navbar links={routes} />
                <div className='col-md-10'>
                    <div className='bms_Right'>
                        <div className='row'>
                            <div className='col-md-3'></div>
                            <div className='col-md-6'>
                                <h3>User Details</h3>
                            </div>
                            <div className='col-md-3'></div>
                            <div className='col-md-12 clearfix'>&nbsp;</div>
                            <div className='col-md-3'></div>
                            <div className='col-md-6'>
                                <label className='previewLabel'>First Name:&nbsp;</label>{userDet.first_name}
                            </div>
                            <div className='col-md-3'></div>
                            <div className='col-md-3'></div>
                            <div className='col-md-6'>
                                <label className='previewLabel'>Last Name:&nbsp;</label>{userDet.last_name}
                            </div>
                            <div className='col-md-3'></div>
                            <div className='col-md-3'></div>
                            <div className='col-md-6'>
                                <label className='previewLabel'>Email:&nbsp;</label>{userDet.email}
                            </div>
                            <div className='col-md-3'></div>

                            <div className='col-md-12'>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                            </div>

                            <div className='col-md-3'></div>
                            <div className='col-md-6'>
                                <Link to={'/users'}><Button variant="contained" className='back_butt'>Back</Button></Link>
                            </div>
                            <div className='col-md-3'></div>
                        </div>
                    </div>
                </div>

            </div>
        </section>

    </>
  )
}

export default ViewUser