
export const checkLogin = () => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const loginType = sessionStorage.getItem('loginType');
    
  
    if(loginType === 'admin')
    {
        if (isLoggedIn == 'false') 
        {
            // Redirect to admin login page
            window.location.replace('/admin');
        }
    }
    else if(loginType === 'customer')
    {
        if (isLoggedIn == 'false') 
        {
            // Redirect to customer login page
            window.location.replace('/');
        }
    }



    
  
    return isLoggedIn;
  };


    const authKey = sessionStorage.getItem('authKey');



