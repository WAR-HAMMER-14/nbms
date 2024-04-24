import React from 'react'
import Login from './Login'
import Header from './Header'

const AdminLogin = () => {

  document.title = "BMS : Admin Login";

    // checkLogin();

    const flag = 'admin';

  return (
    <>
    <Login flag={flag}/>
    </>
  )
}

export default AdminLogin