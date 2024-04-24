import React from 'react'
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FormControl } from '@mui/material';
import './SingleBuildingAccess.css';

const SingleBuildingAccess = ({buildings,accessControls,childIndex,onDeletePress,onBuildingChange,onCheckboxChange,selectedBuilding,selectedAccess}) => {

    const [checkedValues, setCheckedValues] = useState(selectedAccess);
    

    const handleCheckboxChange = (event, permissionId) => {
        const newValue = event.target.checked;
        // const valueId = parseInt(event.target.value);

        console.log(permissionId);

        if (newValue) 
        {
            setCheckedValues((prevCheckedValues) => [...prevCheckedValues, permissionId]);
        } 
        else 
        {
            setCheckedValues((prevCheckedValues) =>
                prevCheckedValues.filter((value) => value !== permissionId)
            );
        }
    }


    const handleAllSelect = (event) => {
        const checkedVal = event.target.checked;

        // console.log(accessControls.length);
        // console.log(selectedAccess.length);
        // return false;


        if(checkedVal)
        {
            const allPermissionIds = accessControls.map((permission) => permission.id)
            setCheckedValues(allPermissionIds);
            console.log(allPermissionIds);
        }
        else
        {
            setCheckedValues([]);
        }



    }



    var defaultVal = '';
    var defBuildName = '';

    if(selectedBuilding !== '')
    {
        defaultVal = buildings.filter((build)=> build.id === selectedBuilding);
        defBuildName = defaultVal[0].building_name +' | '+ defaultVal[0].strata_number ;
    }






    // Function to check if a permission is selected
    const isPermissionSelected = (permissionId) => {
        return checkedValues.includes(permissionId);
    };



    useEffect(()=>{
        onCheckboxChange(checkedValues,childIndex);
    },[checkedValues]);

  return (
    <>
       
            <div className='col-md-4'>
                    <Autocomplete
                        disablePortal
                        id={`building_name${childIndex}`}
                        defaultValue={defBuildName}
                        sx={{marginBottom: '10px',color:'#498b2a'}}

                        options={buildings.map((singleBuilding)=>({
                            label: singleBuilding.building_name +' | '+ singleBuilding.strata_number,
                            id: singleBuilding.id,
                        }))}
                        onChange={(event,value) => {
                            if(value !== null)
                            {
                                onBuildingChange(value.id,childIndex);
                            }
                            else
                            {
                                onBuildingChange('',childIndex);
                            }
                        }}
                        
                        renderInput={(params) => <TextField {...params} label="Buildings" />}
                    />
            </div>
            <div className='col-md-7'>
                {
                    accessControls.map((permission,index)=>(
                        <FormControlLabel key={index} 
                            control={
                                <Checkbox 
                                    style={{color:'#498b2a'}}
                                    value={permission.id} 
                                    onChange={(event) => handleCheckboxChange(event, permission.id)}
                                    checked={isPermissionSelected(permission.id)} // Check if permission is selected    
                                />} 
                            label={permission.access_control_name} />))

                                    
                }
                <FormControlLabel control={<Checkbox style={{color:'#498b2a'}} onChange={(event) => handleAllSelect(event)} />} label="ALL" />
            </div>
            <div className='col-md-1'>
                <button  className='btn btn-sm btn-block add_butt' onClick={()=>onDeletePress(childIndex)} >Delete</button>
            </div>
            
        
    
    </>
  )
}

SingleBuildingAccess.defaultProps = {
    selectedBuilding: '',
    selectedAccess: [],
}

export default SingleBuildingAccess