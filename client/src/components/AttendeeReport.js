import React from 'react';
import { Link } from 'react-router-dom';
import FilterOutputText from '../utilities/util';

const AttendeeReport = ({attendee, onDelete, isChecked, setAttendees}) => {
    const toggleChecked = () => {
        setAttendees((prevAttendees) => prevAttendees.map((prevAttendee) => prevAttendee.id === attendee.id ? { ...prevAttendee, isChecked: !isChecked } : prevAttendee )
      );
    };

	// console.log(attendee.USER_ACCESS.split(","));
	// console.log('check-----'+attendee.USER_ACCESS.split(",").includes('2'));
	// console.log(attendee);

  return (
    <>
		<tr>
			<th scope="row"><input className='form-check-input' type='checkbox' name='checkbox' id={attendee.id} checked={isChecked} onChange={toggleChecked} /></th>
			<td>{FilterOutputText(attendee.first_name)}</td>
			<td>{FilterOutputText(attendee.last_name)} </td>
			<td>{FilterOutputText(attendee.organisation_name)}</td>
			<td>{FilterOutputText(attendee.building_name)}</td>
			<td>{FilterOutputText(attendee.phone)}</td>
			<td>{attendee.PURPOSENAME}</td>
			<td>{attendee.start_time}</td>
			<td>{attendee.end_time !== '0000-00-00 00:00:00' ?	attendee.end_time : ''}</td>
			<td>
				{localStorage.getItem('loginType') === 'user' && attendee.USER_ACCESS.split(",").includes('2') ? 
				(<>
					<Link title='Edit Attendee' className="eyeColor" to={`/editAttendee?id=${attendee.id}`}><i className="fa fa-pencil" aria-hidden="true"></i></Link>
					<Link title='Delete' className="eyeColor" onClick={()=>onDelete(attendee.id)}><i className="fa fa-times" aria-hidden="true"></i></Link>
				</>)
				: ''}
				{localStorage.getItem('loginType') === 'admin' ? 
				(<>
					<Link title='Edit Attendee' className="eyeColor" to={`/editAttendee?id=${attendee.id}`}><i className="fa fa-pencil" aria-hidden="true"></i></Link>
					<Link title='Delete' className="eyeColor" onClick={()=>onDelete(attendee.id)}><i className="fa fa-times" aria-hidden="true"></i></Link>
				</>)
				: ''}
			</td>
		</tr>
    </>
  )
}

export default AttendeeReport;