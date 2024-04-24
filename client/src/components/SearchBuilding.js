import React from 'react';
import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';


const SearchBuilding = ({onSearch}) => {

    const [searchBuildingName, setSearcBuildinghName] = useState(() => {
        return sessionStorage.getItem('searchBuildingName') || '';
    });
    const [searchBuildingStrataNumber, setSearchStrataNumber] = useState(() => {
        return sessionStorage.getItem('searchBuildingStrataNumber') || '';
    });
    const [searchBuildingAddress, setSearchAddress] = useState(() => {
        return sessionStorage.getItem('searchBuildingAddress') || '';
    });

    const buildingNameChangeHandler = (event) => {
        setSearcBuildinghName(event.target.value);
        sessionStorage.setItem('searchBuildingName', event.target.value);
    }

    const strataNumberChangeHandler = (event) => {
        setSearchStrataNumber(event.target.value);
        sessionStorage.setItem('searchBuildingStrataNumber', event.target.value);
    }

    const addressChangeHandler = (event) => {
        setSearchAddress(event.target.value);
        sessionStorage.setItem('searchBuildingAddress', event.target.value);
    }

    const clickHandler = () => {
        onSearch(searchBuildingName, searchBuildingStrataNumber, searchBuildingAddress);
    }

    const resetHandler = () => {
        setSearcBuildinghName('');
        setSearchStrataNumber('');
        setSearchAddress('');
        sessionStorage.setItem('searchBuildingName', '');
        sessionStorage.setItem('searchBuildingStrataNumber', '');
        sessionStorage.setItem('searchBuildingAddress', '');
        onSearch('', '', '');
    }

    useEffect(() => {
        console.log(searchBuildingName);
    },[searchBuildingName]);


  return (
    <>
        <div className='row'>
            <div className='col-md-4'>
                <label>Strata Number</label>  <input type='text' placeholder="Strata Number" name='searchBuildingStrataNumber' onChange={strataNumberChangeHandler} value={searchBuildingStrataNumber} />
            </div>
            <div className='col-md-4'>
                <label>Building Name</label> <input type='text' placeholder="Building Name" name='searchBuildingName' onChange={buildingNameChangeHandler} value={searchBuildingName} />
            </div>
            <div className='col-md-4'>
                <label>Address</label>  <input type='text' placeholder="Address" name='searchBuildingAddress' onChange={addressChangeHandler} value={searchBuildingAddress} />
            </div>
            <div className='col-md-4'>
                <Button variant="contained" className='searchBtn' onClick={clickHandler}>Search</Button>
                <Button variant="outlined" className='resetBtn' onClick={resetHandler}>Reset</Button>
            </div>
        </div>
    </>
  )
}

export default SearchBuilding;