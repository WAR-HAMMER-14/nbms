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
const DashboardUser = () => {
  
    document.title = 'BMS: Dashboard';

    

  
    return (
    <>
    
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
                        </div>
                    </div>
                </div>
          </div>
    </section>
    
    </>
  )
}

export default DashboardUser