import React from 'react'
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


function DashboardAdmin(){

  document.title = 'BMS: Dashboard';

  const [userCount, setUserCount] = useState(0);
  const [buildingCount, setBuildingCount] = useState(0);
  
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authKey')}`;
  axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

  // for fetching users from database
  async function getDashboardStats(postData)
  {
      try{
          const res = await axios.post(config.API_URL+'getAdminDashboardStats',postData);
          console.log(res);

          if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
          {
              SessionMsg.swalSessionExpire();
          }
          else
          {
            //   console.log(res.data);
              const resArr = res.data;

              const dataArr = resArr.split('<@_@>');

              setUserCount(dataArr[0]);
              setBuildingCount(dataArr[1]);

            //   console.log(JSON.parse(dataArr[0]));
            //   console.log(JSON.parse(dataArr[1]));
          }

      }
      catch(err){
          console.log(err);
      }
  }


  useEffect(() => {
    const postData = new FormData();
    postData.append('flag','GET_USER_AND_BUILDING_COUNT');
    getDashboardStats(postData);
  },[])



  return (
    <section className="container-fluid">
    	    <div className="row">
                <Navbar links={routes} />
                <div className='col-md-10'>
                    <div className="bms_Right">
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='dashboardTitle'>Dashboard</div>
                                <div className='dashboardSubTitle'>Please click a menu in the left to continue</div>
                            </div>
                            <div className='col-md-3'></div>
                            <div className='col-md-3'>
                            	
								<div className='dashboardCountContainer'>
									<h1>User count</h1>
									<span className='countStyle'>{userCount}</span>
								</div>
							</div>
                            <div className='col-md-3'>
								
								<div className='dashboardCountContainer'>
									<h1>Building count</h1>
									<span className='countStyle'>{buildingCount}</span>
								</div>
							</div>
                            <div className='col-md-3'></div>
                        </div>
                    </div>
                </div>
          </div>
    </section>
  )
}

export default DashboardAdmin
