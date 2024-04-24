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
import { useNavigate } from 'react-router-dom';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccessDenied from './AccessDenied';


const ViewBuilding = () => {

    document.title = "BMS : View Building";

    const [buildingDet , setBuildingDet] = useState('');
    const [buildingServiceDet , setBuildingServiceDet] = useState([]);
    const navigate = useNavigate();

    const [userAccess, setUserAccess] = useState(false);


    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);


    const id = queryParams.get('id');
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
           // console.log(res);

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

                console.log(JSON.parse(dataArr[0]));
            }
        

        }
        catch(err){
            console.log(err);
        }
    }

    // get user access permission to view building information
    async function getUserBuildingAccessDet()
    {
        const postData = new FormData();
        if(localStorage.getItem('loginType')==='user')
        {
            postData.append('flag','checkUserViewAccess');
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

                console.log(JSON.parse(dataArr[0]));
            }
        

        }
        catch(err){
            console.log(err);
        }
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

    const handleCopyLink = async () => {
        try {
          await navigator.clipboard.writeText(config.CLIENT_SITE_URL + 'stratanumber/' + buildingDet.strata_number);
          alertSuccess('Link Copied');
          console.log('fine');
        } catch (error) {
          // If clipboard API is not available, provide a fallback method
          const link = document.createElement('textarea');
          link.value = config.CLIENT_SITE_URL + 'stratanumber/' + buildingDet.strata_number;
          document.body.appendChild(link);
          link.select();
          document.execCommand('copy');
          document.body.removeChild(link);
          alertSuccess('Link Copied');
          console.log('error case');
        }
      };

    useEffect(() => {
        getBuildingDet(postData);

        if(localStorage.getItem('loginType')==='user')
        {
            getUserBuildingAccessDet();
        }

    },[]);

//console.log(buildingDet);



const pdfUrl = config.API_BASE_URL+'uploads/buildingPdf/'+buildingDet.building_pdf;
const buildingImageSrc = config.API_BASE_URL+'uploads/buildings/thumbs/'+buildingDet.building_image;

let buildingPdf = '';
if(buildingDet.building_pdf !== undefined)
{
    buildingPdf = buildingDet.building_pdf.replace(/^\d+_-_/, '');
}

const moveInQRCode = config.API_BASE_URL+'uploads/movein/'+buildingDet.sign_in_qr_code;
const moveOutQRCode = config.API_BASE_URL+'uploads/moveout/'+buildingDet.sign_out_qr_code;

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
                        <h1>View Building</h1>
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
                        <br/>
                        <div className='row'>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Building Name: </label> {buildingDet.building_name}
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Strata Number: </label> {buildingDet.strata_number}
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Building Address: </label> {buildingDet.building_address}
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Suburb: </label> {buildingDet.suburb}
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Postcode: </label> {buildingDet.postcode}
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Additional Info: </label> {buildingDet.additional_info}
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Move In, Move Out: </label> {buildingDet.move_in_out}
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Building Manager: </label> {buildingDet.manager_name}
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Building Image: </label> <br/>
                                {buildingDet.building_image !== ''?<img src={buildingImageSrc} />:<p>Building Image not set</p>}
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Building Pdf:&nbsp; </label> 
                                {buildingDet.building_pdf !== ''?<a href={pdfUrl} target="_blank" rel="noopener noreferrer">{buildingPdf}</a>:<p>Pdf not set</p>}
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>Building URL:&nbsp;</label> 
                                <a href={config.CLIENT_SITE_URL+'stratanumber/'+buildingDet.strata_number} target="_blank" rel="noopener noreferrer">{config.CLIENT_SITE_URL+'stratanumber/'+buildingDet.strata_number}</a>
                                <i title='Copy Link'>&nbsp;<ContentCopyIcon onClick={handleCopyLink} /></i>
                            </div>
                            <div className='col-md-12'>
                                <label className='previewLabel'>View Building QR:&nbsp;</label> 
                                <a href={config.API_BASE_URL+'viewQRCode.php?id='+buildingDet.id} target="_blank" rel="noopener noreferrer">View QR Code</a>
                            </div>

                            <div className='col-md-12'>
                            <br/>
                            </div>

                            <h3>Building services</h3>
                            <div className='col-md-12'>
                            <br/>
                            </div>
                            <div className='col-md-6'>
                                {/* {console.log(buildingServiceDet)} */}
                                <table className="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Service Name</th>
                                            <th>Contact Number</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        buildingServiceDet.length>0?buildingServiceDet.map((buildingService,index) => (
                                            <tr>
                                                <td>{buildingService.title}</td>
                                                <td>{buildingService.serviceName}</td>
                                                <td>{buildingService.contactNumber}</td>
                                            </tr>
                                            )):<tr><td colspan='3'>No data found</td></tr>
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <div className='col-md-6'></div>
                            {/* <div className='col-md-6'>
                                <label>Entry QR Code</label>
                                    {buildingDet.sign_in_qr_code !== ''?<img src={moveInQRCode} />:<p>QR code not set</p>}
                            </div>
                            <div className='col-md-6'>
                                <label>Exit QR Code</label>
                                {buildingDet.sign_out_qr_code !== ''?<img src={moveOutQRCode} />:<p>QR code not set</p>}
                            </div> */}
                        </div>

                        <Link to={'/buildings'}><Button className='btnBackToEdit'>Back to Buildings</Button></Link>
                       
                    </div>
                </div>
            </div>
        </section>
    </>
       
    
  )
}

export default ViewBuilding;