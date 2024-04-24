import React from 'react'
import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import validator from 'validator'
import axios from 'axios';
import * as config from '../utilities/config';
import Navbar from './includes/Navbar';
import routes from './routesConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as SessionMsg from './SwalSessionExpire';
import ManagerListComp from './ManagerListComp';
import { useNavigate } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';






const AddBuilding = ({buildingDet,buildingServiceDet,flag}) => {

if(flag === 'edit')
{
    document.title = "BMS : Edit Building";
}
else
{
    document.title = "BMS : Add Building";
}
    

const [building,setBuilding] = useState({building_id: buildingDet.id,building_name: buildingDet.building_name, strata_number:buildingDet.strata_number, building_address:buildingDet.building_address, suburb:buildingDet.suburb, postcode:buildingDet.postcode, additional_info:buildingDet.additional_info, move_in_out:buildingDet.move_in_out,manager_id:buildingDet.building_manager,manager_name:buildingDet.manager_name,building_image:buildingDet.building_image,building_pdf:buildingDet.building_pdf});


//for manager list
const [options, setOptions] = useState([]);
const [selectedOption, setSelectedOption] = useState(building.manager_id);

//for auto complete add manager
const [filteredSuggestions, setFilteredSuggestions] = useState([]);

//for upload building image
const [selectedImage, setSelectedImage] = useState(building.building_image);

//For uploading pdf
const [selectedPdf, setSelectedPdf] = useState(building.building_pdf);

//set publish status
const [publishStatus, setPublishStatus] = useState('');

//set publish flag
const [publishBtnFlag, setPublishBtnFlag] = useState(false);

// set loader 
const [loader, setLoader] = useState(false);




const navigate = useNavigate();



//for building services
const [buildingServices, setBuildingServices] = useState( buildingServiceDet );

  const handleAddMore = () => {
    setBuildingServices([...buildingServices, { title: '', serviceName: '', contactNumber: '' }]);
  };

  const handleChange = (index, field, value) => {
    const updatedBuildingServices = [...buildingServices];
    updatedBuildingServices[index][field] = value;
    setBuildingServices(updatedBuildingServices);
  };

  const handleRemove = (index) => {
    const updatedBuildingServices = buildingServices.filter((_, i) => i !== index);
    setBuildingServices(updatedBuildingServices);
  };

  const handleSelectChange = (selectedOpt) => {
    console.log(selectedOpt);
    setSelectedOption(selectedOpt);
  };



// for fetching users from database
async function getManagers()
{
    try{
        const res = await axios.post(config.API_URL+'getManagers','');
        //console.log(res);

        if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
        {
            SessionMsg.swalSessionExpire();
        }
        else
        {
            const managerLists =  res.data.map(option => ({
                value: option.id,
                label: option.first_name+' '+option.last_name
              }));
            setOptions(managerLists);
            // console.log(managerLists);
        }

    }
    catch(err){
        console.log(err);
    }
}



useEffect(() => {

    if(flag === 'edit')
    {
        setPublishBtnFlag(true);
    }

    getManagers('');
},[]);


const [error, setError] = useState({ building_name_err:false, strata_number_err:false, building_address_err:false, suburb_err:false, postcode_err:false, additional_info_err:false, move_in_out_err:false, manager_name_err:false});

const [errorMsg, setErrorMsg] = useState({ building_name_err_msg:'', strata_number_err_msg:'', building_address_err_msg:'', suburb_err_msg:'', postcode_err_msg:'', additional_info_err_msg:'', move_in_out_err_msg:'',manager_name_err_msg:''});


axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authKey')}`;
axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

const changeHandler = (event) => {
    setBuilding({...building,[event.target.name]:event.target.value});
    setError({...error,[event.target.name + '_err']:false});
    setErrorMsg({...errorMsg,[event.target.name + '_err_msg']:''});

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

    //save as draft
const submitDraftHandler = (event) =>{
    submitHandler(event, '2');
}

// submit handler with validations
const submitHandler = (event, publishStatus) => {
    event.preventDefault();
    // console.log(publishStatus);



    if(building.building_name === '')
    {
        setErrorMsg({...errorMsg,building_name_err_msg:'Please enter building name'});
        setError({...error,building_name_err:true});
        alertWarning('Please enter building name');
        return false;     
    }

    if(building.strata_number === '')
    {
        setErrorMsg({...errorMsg,strata_number_err_msg:'Please enter strata number'});
        setError({...error,strata_number_err:true});
        alertWarning('Please enter strata number');
        return false;     
    }

    if(building.building_address == '')
    {
        setErrorMsg({...errorMsg,building_address_err_msg:'Please enter building address'});
        setError({...error,building_address_err:true});
        alertWarning('Please enter building address');
        return false;
    }

    if(building.suburb == '')
    {
        setErrorMsg({...errorMsg,suburb_err_msg:'Please enter suburb'});
        setError({...error,suburb_err:true});
        alertWarning('Please enter suburb');
        return false;
    }

    if(building.postcode == '')
    {
        setErrorMsg({...errorMsg,postcode_err_msg:'Please enter postcode'});
        setError({...error,postcode_err:true});
        alertWarning('Please enter postcode');
        return false;
    }

    if(building.additional_info == '')
    {
        setErrorMsg({...errorMsg,additional_info_err_msg:'Please enter additional info'});
        setError({...error,additional_info_err:true});
        alertWarning('Please enter additional info');
        return false;
    }

    if(building.move_in_out == '')
    {
        setErrorMsg({...errorMsg,move_in_out_err_msg:'Please enter move in move out text'});
        setError({...error,move_in_out_err:true});
        alertWarning('Please enter move in move out text');
        return false;
    }

    if(building.manager_id == '')
    {
        setErrorMsg({...errorMsg,manager_name_err_msg:'Please select building manager'});
        setError({...error,manager_name_err:true});
        alertWarning('Please select building manager');
        return false;
    }

    // start the loader
    setLoader(true);

    
    const postData = new FormData();

    postData.append('building_name',building.building_name);
    postData.append('strata_number',building.strata_number);
    postData.append('building_address',building.building_address);
    postData.append('suburb',building.suburb);
    postData.append('postcode',building.postcode);
    postData.append('additional_info',building.additional_info);
    postData.append('move_in_out',building.move_in_out);
    postData.append('manager_id',selectedOption);

    if(flag === 'edit')
    {
        postData.append('flag','edit');        
        postData.append('building_id',building.building_id);        
    }
    else
    {        
        postData.append('flag','add');        
    }

    if (selectedImage) {
        postData.append('building_image', selectedImage);
    }

    if (selectedPdf) {
        postData.append('building_pdf', selectedPdf);
    }

    
    postData.append('publish_status', '2');
    

    if(buildingServices){
        // Append array data to postData
        for (let i = 0; i < buildingServices.length; i++) {
            const buildingServiceTitle = buildingServices[i]['title'];
            const buildingServiceName = buildingServices[i]['serviceName'];
            const buildingServicecontNo = buildingServices[i]['contactNumber'];
            const buildingServiceArr = [buildingServiceTitle,buildingServiceName,buildingServicecontNo];
            postData.append('buildingServices[]', buildingServiceArr);
        }
    }
    
    // console.log(buildingServices);
    //  console.log(postData);
    addEditBuilding(postData); // calling add building function



    async function addEditBuilding(postData)
    {
        try{
            console.log(postData);
            // const auth_key = localStorage.getItem('authKey');
            // postData.append('auth_key', auth_key);
            const response = await axios.post(config.API_URL+'addEditBuilding',postData);
            //  console.log(response.data);
            const respData = response.data.split('_');

            // TURN OFF THE LOADER  
            setLoader(false);

            if(respData[0] === 'success')
            {
                if(flag !== 'edit')
                {
                    // alertSuccess('Building added successfully');
                    setBuilding({building_name:'',strata_number:'',building_address:'',suburb:'',postcode:'',additional_info:'',move_in_out:'',manager_id:'', manager_name:'',building_image:'',building_pdf:''});
                    setPublishStatus('1');

                    setBuildingServices([{ title: '', serviceName: '', contactNumber: '' }]);
                    setSelectedImage(null);
                    setSelectedPdf(null);
                    setFilteredSuggestions([]);
                }
                else
                {
                    // alertSuccess('Building edited successfully');
                }
                if(publishStatus == '2')
                {
                    alertSuccess('Building details has been saved in draft');
                    setTimeout(() => {
                        navigate('/buildings');
                    },3000)
                    
                }
                else
                {
                    alertSuccess('Building details has been saved');
                    setPublishBtnFlag(true);
                    setTimeout(() => {
                        // navigate('/PreviewBuilding?id='+respData[1]);
                        alertSuccess('Building preview has been opened in a separate tab');
                        window.open(config.CLIENT_SITE_URL+'stratanumber/'+building.strata_number+'?flag=preview', '_blank');
                    },3000)
                }
                

                
            }
            else if(response.data === "STRATA_NUMBER_EXIST")
            {
                alertError('Strata number already exist');
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

const publishHandler = (event) => {
    const publishPostData = new FormData();
    publishPostData.append('id', building.building_id);
    publishPostData.append('publishStatus', '1');
    
    //console.log(publishPostData);
    // Update publish status
    async function updatePublishStatus(publishPostData)
    {
        try{
            const res = await axios.post(config.API_URL+'updateBuildingPublishStatus',publishPostData);
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

useEffect(() => {
    setBuilding({
        building_name: buildingDet.building_name,
        strata_number: buildingDet.strata_number,
        building_address: buildingDet.building_address,
        suburb: buildingDet.suburb,
        postcode: buildingDet.postcode,
        additional_info: buildingDet.additional_info,
        move_in_out: buildingDet.move_in_out,
        manager_id:buildingDet.building_manager,
        manager_name:buildingDet.manager_name,
        building_image:buildingDet.building_image,
        building_pdf:buildingDet.building_pdf,
        building_id:buildingDet.id
    });
  }, [buildingDet]);

   

  const handleImageSelect = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);
  };

  const handlePdfSelect = (event) => {
    const pdfFile = event.target.files[0];
    setSelectedPdf(pdfFile);
  };


const pdfUrl = config.API_BASE_URL+'uploads/buildingPdf/'+building.building_pdf;
const buildingImageSrc = config.API_BASE_URL+'uploads/buildings/'+building.building_image;


  return (
    <>
    {/* {loader ? <div className='inProgressLoader'>
            <div class="spinner"></div>
            <label className='loadingLabel'>Please wait...</label>
        </div> : ''} */}
        
        <section className="container-fluid">
    	    <div className="row">
                <Navbar links={routes} />
                <div className='col-md-10'>
                    <div className="bms_Right">
                        <h1>{flag === 'edit' ?'Edit':'Add'} Building</h1>
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
                                <label>Building Name</label>
                                <input type='text' required id="outlined-basic"  className='' name="building_name"  placeholder="Building Name" onChange={changeHandler} value={building.building_name} variant="outlined" />
                            </div>

                            <div className='col-md-4'>
                                <label>Strata Number</label>
                                <input type='text' required id="outlined-basic"  className='' name="strata_number" placeholder="Example, SP409998" onChange={changeHandler} value={building.strata_number} variant="outlined" />
                            </div>

                            <div className='col-md-4'>
                                <div className="image-upload">
                                    <label>Upload Building Image</label> <br></br>
                                    <input type="file" accept="image/*" onChange={handleImageSelect} onImageSelect={handleImageSelect}/>
                                </div>
                                
                                {buildingDet.building_image?<a className='addEditFileLink' href={buildingImageSrc} target="_blank" rel="noopener noreferrer">View Image</a>:''}
                            </div>

                            <div className='col-md-4'>
                                <label>Address</label>
                                <input type='text' required id="outlined-basic"  className='' name="building_address" placeholder="Address"  onChange={changeHandler} value={building.building_address} variant="outlined" />
                            </div>

                            <div className='col-md-4'>
                                <label>Suburb</label>
                                <input type='text' required id="outlined-basic" className='' name="suburb" placeholder="Suburb"  onChange={changeHandler} value={building.suburb} variant="outlined" />
                            </div>

                            <div className='col-md-4'>
                                <label>Postcode</label>
                                <input type='text' required id="outlined-basic"  className='' name="postcode" placeholder="Postcode"  onChange={changeHandler} value={building.postcode} variant="outlined" />
                            </div>

                            <div className='col-md-12'>
                                <label>Building Information </label>
                                <textarea value={building.additional_info} name="additional_info" required id="outlined-basic"  className='' placeholder="Building Information (200 words limit)"  onChange={changeHandler} maxLength="200"/>
                                {/* <input type='text' required id="outlined-basic"  className='' name="additional_info" placeholder="Additional Info"  onChange={changeHandler} value={building.additional_info} variant="outlined" /> */}
                            </div>

                            <div className='col-md-12'>
                                <label>Move In, Move Out</label>
                                <textarea value={building.move_in_out} required id="outlined-basic"  className='' name="move_in_out" placeholder="Move In Move Out (200 words limit)"  onChange={changeHandler} maxLength="100"/>
                                {/* <input type='text' required id="outlined-basic"  className='' name="move_in_out" placeholder="Move In"  onChange={changeHandler} value={building.move_in_out} variant="outlined" /> */}
                            </div>

                            <div className='col-md-4'>
                                <div className="pdf-upload">
                                    <label>Upload Building PDF</label> <br></br>
                                    <input type="file" accept="pdf/*" onChange={handlePdfSelect} onImageSelect={handlePdfSelect}/>
                                </div>

                                {buildingDet.building_pdf?<a href={pdfUrl} className='addEditFileLink' target="_blank" rel="noopener noreferrer">View Pdf</a>:''}
                            </div>

                            <div className="col-md-8"></div>

                            <div className="col-lg-7 ">
                                <div className="buildingService">
                                    <label>Building services</label>
                                    <div>
                                        {buildingServices.map((buildingService, index) => (
                                            <div className='row' key={index}>
                                                <div className="col-md-3">
                                                    <input
                                                    type="text"
                                                    placeholder="Title"
                                                    value={buildingService.title}
                                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Name"
                                                        value={buildingService.serviceName}
                                                        onChange={(e) => handleChange(index, 'serviceName', e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Contact Number"
                                                        value={buildingService.contactNumber}
                                                        onChange={(e) => handleChange(index, 'contactNumber', e.target.value)}
                                                    />
                                                </div>

                                                <div className="col-md-1 spacePadding">
                                                    <Link title='Delete'><ClearIcon onClick={() => handleRemove(index)} style={{color: 'red',cursor: 'pointer'}}/></Link>
                                                    {/* <button onClick={() => handleRemove(index)}>Remove</button> */}
                                                </div>
                                            
                                            </div>
                                        ))}
                                        <button className='addButSM' onClick={handleAddMore}>Add More</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5 "></div>

                            <div className='col-md-4'>
                            <ManagerListComp options={options} selectedManager={building.manager_id} onSelectChange={handleSelectChange} />
                            </div>

                            <div className='col-md-12'>
                                <Button variant="contained" className='add_butt' onClick={submitDraftHandler}> Save as Draft</Button>
                                <Button variant="contained" className='submitBtn' onClick={submitHandler}>Preview and Save Building</Button>
                                {publishBtnFlag ? <Button className='btnPublish' onClick={publishHandler}> Publish</Button> : ''}
                                
                                <Link to={'/buildings'}><Button variant="contained" className='back_butt'>Back</Button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

AddBuilding.defaultProps = {
    flag: '',
    buildingDet: {
        id: '',
        building_name: '',
        strata_number: '',
        building_address: '',
        suburb: '',
        postcode: '',
        additional_info: '',
        move_in_out: '',
        manager_id:'',
        manager_name:'',
        building_id:''
    },
    buildingServiceDet:[{ title: '', serviceName: '', contactNumber: '' }]
}


export default AddBuilding
