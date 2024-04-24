import React from 'react'
import * as config from '../../utilities/config'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'


const Header = () => {

  const pathData = useLocation();

  const isPublic = pathData.pathname.includes('/stratanumber');

  const navigate = useNavigate();

  const pageHomeHandler = () => {

    if(localStorage.getItem('isLoggedIn'))
    {
		if(localStorage.getItem('loginType')==='admin')
		{
			navigate('/dashboard');
		}
		else if(localStorage.getItem('loginType')==='user')
		{
			navigate('/dashboardUser');
		}
    }
    else
    {
    	navigate('/admin');
    }

  }



  return (
    <>
       {!isPublic && <header>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3"><div className='headerLogoContainer'><img src={config.API_BASE_URL+"images/logo.png"} alt="logo" onClick={pageHomeHandler} /></div></div>
                    <div className="col-md-9"></div>
                </div>
            </div>
        </header>}
    </>
  )
}

export default Header