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



const PreviewBuilding = () => {

    document.title = "BMS : Preview Building";

    const [buildingDet , setBuildingDet] = useState('');
    const [buildingServiceDet , setBuildingServiceDet] = useState([]);
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);


    const id = queryParams.get('id');
    axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('authKey')}`;
    axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

    const postData = new FormData();
    postData.append('flag','building_det');
    postData.append('flag2','service_det');
    postData.append('id',id);


    // for fetching users from database
    async function getBuildingDet(postData)
    {
        try{
            const res = await axios.post(config.API_BASE_URL+'buildingDet.php',postData);
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
                //console.log(JSON.parse(dataArr[0]));
            }
        

        }
        catch(err){
            console.log(err);
        }
    }


    useEffect(() => {
        getBuildingDet(postData);
    },[]);

//console.log(buildingDet);
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

const submitHandler = (event) => {
    const publishPostData = new FormData();
    publishPostData.append('id', id);
    publishPostData.append('publishStatus', '1');
    
    //console.log(publishPostData);
    // Update publish status
    async function updatePublishStatus(publishPostData)
    {
        try{
            const res = await axios.post(config.API_BASE_URL+'updateBuildingPublishStatus.php',publishPostData);
            //  console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }

            alertSuccess('Building details has been published');
            setTimeout(() => {
                navigate('/buildings');
            },3000)
        }
        catch(err){
            console.log(err);
        }
    }


    updatePublishStatus(publishPostData);
}

const pdfUrl = config.API_BASE_URL+'uploads/buildingPdf/'+buildingDet.building_pdf;
const buildingImageSrc = config.API_BASE_URL+'uploads/buildings/thumbs/'+buildingDet.building_image;

let buildingPdf = '';
if(buildingDet.building_pdf !== undefined)
{
    buildingPdf = buildingDet.building_pdf.replace(/^\d+_-_/, '');
}

const moveInQRCode = config.API_BASE_URL+'uploads/movein/'+buildingDet.sign_in_qr_code;
const moveOutQRCode = config.API_BASE_URL+'uploads/moveout/'+buildingDet.sign_out_qr_code;

  return (
    
    <>
        <section className="container-fluid">
    	    <div className="row">
                <Navbar links={routes} />
                <div className='col-md-10'>
                    <div className="bms_Right">
                        <h1>Preview Building</h1>
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
                            <br/>
                            </div>

                            <h3>Building services</h3>
                            <div className='col-md-12'>
                            <br/>
                            </div>
                            <div className='col-md-6'>
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
                                            <tr key={index}>
                                                <td>{buildingService.title}</td>
                                                <td>{buildingService.serviceName}</td>
                                                <td>{buildingService.contactNumber}</td>
                                            </tr>
                                            )):<tr><td colSpan='3'>No data found</td></tr>
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

                        <Link to={'/editBuilding?id='+id}><Button className='btnBackToEdit'>Back to Edit</Button></Link>
                        <Button className='btnPublish' onClick={submitHandler}> Publish</Button>
                       
                    </div>
                </div>
            </div>
        </section>
    </>
       
    
  )
}

export default PreviewBuilding;