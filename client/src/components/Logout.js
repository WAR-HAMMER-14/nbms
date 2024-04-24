import React from 'react'

const Logout = () => {

    const type = localStorage.getItem("loginType")
    if(type === "admin")
    {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("authKey");
        window.location.replace('/bms/admin');
    }
    else if(type === "user")
    {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("authKey");
        window.location.replace('/bms/admin');
    }


  return (
    <></>
  )
}

export default Logout