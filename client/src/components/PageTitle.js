import React from 'react'
import { useLocation } from 'react-router-dom'

const PageTitle = () => {

    const location = useLocation();
    const pageTitle = location.pathname === '/' ? 'Home' : location.pathname.slice(1);

  return (
        <title>BMS: {pageTitle}</title>
  )
}

export default PageTitle