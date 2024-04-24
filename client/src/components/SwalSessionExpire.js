import Swal from 'sweetalert2';

    // swal alert for session expire with only confirm with ok btn
   export const swalSessionExpire = () => {
        Swal.fire({
            title: 'Session terminated !',
            text: 'Please Login again to continue.',
            icon: 'warning',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Ok',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.isConfirmed) 
            {
             ExpireSession();
            }
          
          })
    }
    
    // expire Session function
    const ExpireSession = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("authKey");

        if(localStorage.getItem("loginType")==='admin')
        {
          window.location.replace('/bms/admin')
        }
        else if(localStorage.getItem("loginType")==='user')
        {
          window.location.replace('/bms/admin')
        }

    }
