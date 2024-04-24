import React from 'react';
import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import axios from 'axios';
import * as SessionMsg from './SwalSessionExpire';
import * as config from '../utilities/config';


const SearchComponent = ({onSearch}) => {

    const [searchName, setSearchName] = useState(() => {
        return sessionStorage.getItem('searchName') || '';
    });
    const [searchEmail, setSearchEmail] = useState(() => {
        return sessionStorage.getItem('searchEmail') || '';
    });
    const [searchBuilding, setSearchBuilding] = useState(() => {
        return sessionStorage.getItem('searchBuilding') || '';
    });

    const [buildingList, setBuildingList] = useState([]);

    const nameChangeHandler = (event) => {
        setSearchName(event.target.value);
        sessionStorage.setItem('searchName', event.target.value);
    }

    const emailChangeHandler = (event) => {
        setSearchEmail(event.target.value);
        sessionStorage.setItem('searchEmail', event.target.value);
    }

    const buildingChangeHandler = (event) => {
        setSearchBuilding(event.target.value);
        sessionStorage.setItem('searchBuilding', event.target.value);
    }

    const clickHandler = () => {
        onSearch(searchName, searchEmail, searchBuilding);
        // console.log(searchBuilding); 
    }

    const resetHandler = () => {
        setSearchName('');
        setSearchEmail('');
        setSearchBuilding('');
        sessionStorage.setItem('searchName', '');
        sessionStorage.setItem('searchEmail', '');
        sessionStorage.setItem('searchBuilding', '');
        onSearch('', '', '');
        // console.log(searchBuilding); 
    }
    
    // for fetching buildings from database
    async function getBuildingsList()
    {
        const postData = new FormData();
        postData.append('flag','buildings');
        try{
            const res = await axios.post(config.API_URL+'buildingAssignDet',postData);
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

    // useEffect(() => {
    //     console.log(searchBuilding);
    // },[searchBuilding]);

    useEffect(() => {
        getBuildingsList();
    },[]);


  return (
    <div className='searchBase'>
        <div className="searchHead">Search</div>
        <div className='row'>
            <div className='col-md col-sm'>
                <label>Name: </label>
                <input name="" type="text" placeholder="Name" onChange={nameChangeHandler} value={searchName}></input>
                {/* <TextField className='form-control' label="Name" variant="outlined" name='searchName' onChange={nameChangeHandler} value={searchName} /> */}
            </div>
            <div className='col-md col-sm'>
                <label>Email: </label>
                <input name="" type="text" placeholder="Email" onChange={emailChangeHandler} value={searchEmail}></input>
                {/* <TextField className='form-control' label="Email" variant="outlined" name='searchEmail' onChange={emailChangeHandler} value={searchEmail} /> */}
            </div>
            <div className='col-md col-sm'>
                <label>Buildings: </label> 
                <select name="" value={searchBuilding} onChange={buildingChangeHandler}>
                    <option value="">Select a building</option>
                    {buildingList.length ? buildingList.map((building, index) =>(
                        <option value={building.id} key={index}>
                            {building.building_name} || {building.strata_number}
                        </option>
                    )
                    ): ''}
                </select>
            </div>
            <div className='col-md-12'>
                <Button variant="contained" className='searchBtn' onClick={clickHandler}>Search</Button>
                <Button variant="outlined" className='resetBtn' onClick={resetHandler}>Reset</Button>
            </div>
        </div>
    </div>
  )
}

export default SearchComponent