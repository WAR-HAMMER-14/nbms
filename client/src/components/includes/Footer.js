import React from 'react'
import { useLocation } from 'react-router-dom'


const Footer = () => {

  const pathData = useLocation();

  const isPublic = pathData.pathname.includes('/stratanumber');

  return (
    <>
        {!isPublic && <footer>
		      <p>Copyright © Building Management System Australia | All rights reserved</p>
	      </footer>}
    </>
  )
}

export default Footer