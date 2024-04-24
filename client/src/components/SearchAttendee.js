import React from 'react';
import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import * as SessionMsg from './SwalSessionExpire';
import * as config from '../utilities/config';


const SearchAttendee = ({onSearch}) => {

    const [searchBuilding, setSearchBuilding] = useState(() => {
        return sessionStorage.getItem('searchBuilding') || '';
    });

    const [searchStartTime, setSearcStartTime] = useState(() => {
        return sessionStorage.getItem('searchStartTime') || '';
    });

    const [searchEndTime, setSearchEndTime] = useState(() => {
        return sessionStorage.getItem('searchEndTime') || '';
    });

    const [buildingList, setBuildingList] = useState([]);


    const buildingChangeHandler = (event) => {
        setSearchBuilding(event.target.value);
        sessionStorage.setItem('searchBuilding', event.target.value);
    }

    const StartTimeChangeHandler = (event) => {
        setSearcStartTime(event.target.value);
        sessionStorage.setItem('searchStartTime', event.target.value);
    }

    const EndTimeChangeHandler = (event) => {
        setSearchEndTime(event.target.value);
        sessionStorage.setItem('searchEndTime', event.target.value);
    }

    const clickHandler = () => {
        onSearch(searchStartTime, searchEndTime, searchBuilding);
    }

    const resetHandler = () => {
        setSearchBuilding('');
        setSearcStartTime('');
        setSearchEndTime('');
        sessionStorage.setItem('searchBuilding', '');
        sessionStorage.setItem('searchStartTime', '');
        sessionStorage.setItem('searchEndTime', '');
        onSearch('', '', '');
    }

    // for fetching buildings from database
    async function getBuildingsList()
    {
        const postData = new FormData();
        if(localStorage.getItem('loginType')==='user')
        {
            postData.append('user_id',localStorage.getItem('userId'));
        }
        postData.append('flag','buildings');
        try{
            const res = await axios.post(config.API_BASE_URL+'buildingAssignDet.php',postData);
            // console.log(res);

            if(res.data === "AUTH_KEY_NOT_PROVIDED" || res.data === "VALIDATION_TIME_ERROR" || res.data === "VALIDATION_ERROR")
            {
                SessionMsg.swalSessionExpire();
            }
            else
            {
                setBuildingList(res.data);
                // console.log(res.data);
            }

        }
        catch(err){
            console.log(err);
        }
    }


    useEffect(() => {
        getBuildingsList();
    },[]);


  return (
    <>
        <div className='row'>
            <div className='col-md-4'>
                <label>Buildings: </label> 
                <select name="" onChange={buildingChangeHandler}>
                    <option>Select a building</option>
                    {buildingList != '' ? buildingList.map((building, index) =>(
                        <option value={building.id} selected={building.id === searchBuilding} key={index}>{building.building_name} || {building.strata_number}</option>
                    )
                    ): ''}
                </select>
            </div>
            <div className='col-md-4'>
                <label>Start Time</label>  <input type='date' placeholder="Start Time" name='searchStartTime' onChange={StartTimeChangeHandler} value={searchStartTime} />
            </div>
            <div className='col-md-4'>
                <label>End Time</label> <input type='date' placeholder="End Time" name='searchEndTime' onChange={EndTimeChangeHandler} value={searchEndTime} />
            </div>
            <div className='col-md-12'>
                <Button variant="contained" className='searchBtn' onClick={clickHandler}>Search</Button>
                <Button variant="outlined" className='resetBtn' onClick={resetHandler}>Reset</Button>
            </div>
        </div>
    </>
  )
}

export default SearchAttendee;