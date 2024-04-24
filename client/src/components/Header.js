import React from 'react'
import ApartmentIcon from '@mui/icons-material/Apartment';

const Header = () => {
  return (
    <div>
		<div className="header_container">
			<div className="mail_container">
				<ApartmentIcon style={{fontSize: "40px",color: "white"}}/>
				<div className="header_title">Building Management System</div>
			</div>

		</div>
    </div>
  )
}

export default Header