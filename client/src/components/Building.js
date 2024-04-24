import React from 'react';
import { Link } from 'react-router-dom';
import * as config from '../utilities/config';

const Building = ({building, onDelete, isChecked, setBuildings}) => {
    const toggleChecked = () => {
        setBuildings((prevBuildings) => prevBuildings.map((prevBuilding) => prevBuilding.id === building.id ? { ...prevBuilding, isChecked: !isChecked } : prevBuilding )
      );
    };

  return (
    <>
		<tr>
			<th scope="row"><input className='form-check-input' type='checkbox' name='checkbox' id={building.id} checked={isChecked} onChange={toggleChecked} /></th>
			<td>{building.strata_number}</td>
			{/* <td>{building.id}</td> */}
			<td>{building.building_name} </td>
			<td>{building.publish_status=='2'?<label className="draft">Draft</label>:<label className="publish">Published</label>}</td>
			<td>{building.building_address} | {building.suburb} | {building.postcode}</td>
			<td>{building.manager_name}</td>
			<td>
				<Link title='View Building' className="eyeColor" to={`/viewBuilding?id=${building.id}`}><i className="fa fa-eye" aria-hidden="true"></i></Link>

				{localStorage.getItem('loginType') === 'user' && building.USER_ACCESS.split(",").includes('4') ? 
				(<>
					<Link title='Edit Building' className="eyeColor" to={`/editBuilding?id=${building.id}`}><i className="fa fa-pencil" aria-hidden="true"></i></Link> 
					<Link title='Delete' className="eyeColor" onClick={()=>onDelete(building.id)}><i className="fa fa-times" aria-hidden="true"></i></Link>
				</>)
				: ''}
				{localStorage.getItem('loginType') === 'admin' ? 
				(<>
					<Link title='Edit Building' className="eyeColor" to={`/editBuilding?id=${building.id}`}><i className="fa fa-pencil" aria-hidden="true"></i></Link> 
					<Link title='Delete' className="eyeColor" onClick={()=>onDelete(building.id)}><i className="fa fa-times" aria-hidden="true"></i></Link>
				</>)
				: ''}

				<Link title='View QR Code' className="eyeColor" to={config.API_BASE_URL+'viewQRCode.php?id='+building.id} target='_blank'><i className="fa fa-qrcode" aria-hidden="true"></i></Link>
				</td>
		</tr>
    </>
  )
}

export default Building;