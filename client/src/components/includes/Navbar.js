import React from 'react'
import { Link } from 'react-router-dom';

function Navbar({links}) {
  return (
    <div className="col-md-2">
        <nav className="navbar navbar-expand-md navbar-light bg-light"> <a className="navbar-brand" href="#"></a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse"data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav left_base">
                <div className="navbar-nav">
                <ul>
                    {
                        links.map((link, index)=>(
                            (link.access === localStorage.getItem('loginType') || link.access === 'both' ? 
                                (
                                    <li key={index}>
                                        <Link to={link.path}>{link.component}</Link>
                                    </li>
                                ): null
                            )
                        )
                    )}
                </ul>
                </div>
            </ul>
            </div>
        </nav>
    </div>

  )
}

export default Navbar;