import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { Link } from 'react-router-dom';
import './Navbar.css';

import { authLogout, removeAlert } from "../../../store/actions/index";
import { Button } from '@material-ui/core';

function Navbar(props) {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const history = useHistory();

  // const handleClick = () => setClick(!click);
  // const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  const { onauthLogout,companyName } = props;

  const handleLogout = () => {
    onauthLogout();
    history.push("/");
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          {/* <Link to='/' className='navbar-logo' >
            <img src="uom.png"/>
          </Link> */}
          <p className="company">{companyName}</p>
          <div className='menu-icon'>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            
            
            <li className='nav-item'>
              <Link to='/interviewpanel' className='nav-links'>
                Participants
              </Link>
            </li>
            <li className='nav-item'>
              <Button href='http://www.google.com' className='nav-links' target="_blank" >
                Join Meeting
              </Button>
            </li>
            <li className='nav-item'>
              <Link
                to='/contactvolunteer'
                className='nav-links'
              >
                Contact Volunteer
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/'
                className='nav-links'
                onClick={() => handleLogout()}
              >
                Log Out
              </Link>
            </li>
          </ul>
         
        </div>
      </nav>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token != null,
    alerts: state.alert.alerts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onauthLogout: () => dispatch(authLogout()),
    removeAlert: (alertId) => dispatch(removeAlert(alertId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
