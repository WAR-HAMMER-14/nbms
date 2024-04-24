import React from 'react';
import axios from 'axios';
import * as config from '../utilities/config';
import * as SessionMsg from './SwalSessionExpire';
import Button from '@mui/material/Button';





// Create a component to generate and automatically download the PDF
const AttendeePdf = ({attendeeSearchBuildngId, attendeeSearchStartDate, attendeeSearchEndDate}) => {

  axios.defaults.headers.common['Authorization'] = `${localStorage.getItem('authKey')}`;
  axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';

  

  // call API to generate pdf
  async function generatePdf(postData)
  {
      try{
          const res = await axios.post(config.API_BASE_URL+'downloadAttendeeDetails.php',postData);
          // console.log(res);

          if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
          {
              SessionMsg.swalSessionExpire();
          }
          else
          {
              window.open(config.API_BASE_URL+'uploads/attendee/'+res.data, '_blank');
            
          }

      }
      catch(err){
          console.log(err);
      }
  }


  const generatePdfHandler = () => {
    const postData = new FormData();
    postData.append('startTime', attendeeSearchStartDate);
    postData.append('endTime', attendeeSearchEndDate);
    postData.append('buildingId', attendeeSearchBuildngId);

	if(localStorage.getItem('loginType')==='user')
	{
		postData.append('flag','user');
		postData.append('user_id',localStorage.getItem('userId'));
	}

    generatePdf(postData); // calllcing get function
  }


  return (
    <>
    	<Button className='btnPublish' onClick={generatePdfHandler}> Generate PDF</Button>
    </>
  );

};

export default AttendeePdf;
