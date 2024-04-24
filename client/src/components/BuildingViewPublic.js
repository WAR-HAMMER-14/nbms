import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios';
import * as config from '../utilities/config';
import * as SessionMsg from './SwalSessionExpire'
import { useParams, useLocation } from 'react-router-dom';

const BuildingViewPublic = () => {

    document.title = "BMS : View Building";

    const [buildingDet , setBuildingDet] = useState('loading');

    const { number } = useParams();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);


    const flag = queryParams.get('flag');

    // console.log('this is id -> '+ buildid)


    const buildingNameHandler = (buildName) => {
        
        let build_name_arr = buildName.split(" ");

        let building_lname = build_name_arr.pop();
        let building_fname = build_name_arr;

        // return build_name_arr.pop() + " " + building_fname;
        // return building_fname.join(" ") + " " + building_lname;

        return (<><span class="buildingColorName">{building_fname.join(" ")}</span> {building_lname}</>);
    }

    

    // get type def of number variable
    // console.log(number);

    // for fetching users from database
    async function getBuildingDet(postData)
    {
        try{
            const res = await axios.post(config.API_BASE_URL+'stratanumber.php',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                // console.log(res.data);
                if(res.data !== 0)
                {
                    setBuildingDet(res.data);
                }
                else
                {
                    setBuildingDet('');
                }

            }
        

        }
        catch(err){
            console.log(err);
        }
    }

    let buildingPdf = '';
    if(buildingDet.building_pdf !== undefined)
    {
        buildingPdf = buildingDet.building_pdf.replace(/^\d+_-_/, '');
    }

    useEffect(() => {
        const postData = new FormData();
        postData.append('flag','GET_BUILDING_BY_STRATA');
        postData.append('strata_number',number);

        if(flag === 'preview')
        {
            postData.append('preview_flag',flag);
        }

        getBuildingDet(postData);
    },[]);


return (
    <>
        <title>Building Details</title>
            {buildingDet === 'loading' ?( 
                <div className='loadingDiv'>
                    <div class="spinner"></div>
                    <label className='loadingLabel'>Loading...</label>
                </div> ):
            buildingDet ? (
    <div className="buildingPublicBase">
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-7">
                    <div className="bmsLeftArea">
                        <div className="newlogo">
                            <img src={config.API_BASE_URL+"images/newLogo.png"} alt="New Logo" />
                        </div>
                        <div className="buildingName">
                            {buildingNameHandler(buildingDet.building_name)}
                        </div>	


                        <div className="buildingTestBase">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="greenBar">Strata Number :</div>
                                </div>
                                <div className="col-md-8">
                                    <div className="infoTextbase">{buildingDet.strata_number}</div>
                                </div>

                                <div className="col-md-4">
                                    <div className="greenBar">Address :</div>
                                </div>
                                <div className="col-md-8">
                                    <div className="infoTextbase">{buildingDet.building_address +' '+ buildingDet.suburb + ' ' + buildingDet.postcode}</div>
                                </div>

                                <div className="col-md-4">
                                    <div className="greenBar">Suburb :</div>
                                </div>
                                <div className="col-md-8">
                                    <div className="infoTextbase">{buildingDet.suburb}</div>
                                </div>

                                <div className="col-md-4">
                                    <div className="greenBar">Postcode :</div>
                                </div>
                                <div className="col-md-8">
                                    <div className="infoTextbase">{buildingDet.postcode}</div>
                                </div>

                                <div className="col-md-4">
                                    <div className="greenBar">Building Information :</div>
                                </div>
                                <div className="col-md-8">
                                    <div className="infoSmTextbase">{buildingDet.additional_info}</div>
                                </div>

                                <div className="col-md-4">
                                    <div className="greenBar">Move in Move out :</div>
                                </div>
                                <div className="col-md-8">
                                    <div className="infoSmTextbase">{buildingDet.move_in_out}</div>
                                </div>

                                <div className="col-md-4">
                                    <div className="greenBar">Building Pdf :</div>
                                </div>
                                <div className="col-md-8">
                                    <div className="infoSmTextbase"> <a href={config.API_BASE_URL+config.BUILDING_PDF_PATH+buildingDet.building_pdf} target="_blank" title={buildingPdf}><img src={config.API_BASE_URL+"images/pdfFile.png"} alt="pdf" /></a></div>
                                </div>

                                {/* <div className="col-md-12">
                                    <label className="labelStyle">Building Manager: &nbsp;</label>{buildingDet.manager_name}
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="bmsRightArea">
                    <div className="dotsleft"><img src={config.API_BASE_URL+"images/dotsleft.png"} alt="" /></div>
                        
                        <div className="rightAreaImgBase"><img src={config.API_BASE_URL+config.BUILDING_UPLOADING_PATH+buildingDet.building_image} alt="BM" /></div>
                        <div className="dotsright"><img src={config.API_BASE_URL+"images/dotsleft.png"} alt="" /></div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>

        ):(
            <div className="container">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <div className="building_error_public_container">
                            <h1 align="center" style={{textTransform: 'none'}}>Error: Building not found!</h1>
                        </div>
                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>
        )}
    <footer>
        <p>Copyright © Building Management System Australia | All rights reserved</p>
    </footer>
    </>
  );
};

export default BuildingViewPublic