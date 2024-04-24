import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { Link } from 'react-router-dom';
import AssuredWorkloadTwoToneIcon from '@mui/icons-material/AssuredWorkloadTwoTone';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


const User = ({user, onDelete, isChecked, setUsers}) => {

      const toggleChecked = () => {
        setUsers((prevUsers) => prevUsers.map((prevUser) => prevUser.id === user.id ? { ...prevUser, isChecked: !isChecked } : prevUser )
      );
    };

  return (
    <>
		<tr>
			<th scope="row"><input className='form-check-input' type='checkbox' name='checkbox' id={user.id} checked={isChecked} onChange={toggleChecked} /></th>
			<td>{user.id}</td>
			<td>{user.first_name} </td>
			<td>{user.last_name}</td>
			<td>{user.email}</td>
      <td>{user.BUILD_NAME}</td>
			<td><Link title='View User' to={`/viewUser?id=${user.id}`} class="eyeColor"><RemoveRedEyeIcon /></Link><Link title='Edit User' to={`/editUser?id=${user.id}`}><EditIcon style={{color: '#498b2a',cursor: 'pointer'}}/></Link> <Link to={`/buildingAccess?id=${user.id}`} title='Modify Building Permission'><AssuredWorkloadTwoToneIcon style={{color: '#498b2a',cursor: 'pointer'}} /></Link> <Link title='Delete User'><ClearIcon onClick={()=>onDelete(user.id)} style={{color: '#498b2a',cursor: 'pointer'}}/></Link></td>
		</tr>
    </>
  )
}

export default User