import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { Link } from 'react-router-dom';
import './Navbar.css';

import { authLogout, removeAlert } from "../../../store/actions/index";
import {getUser} from "../../../api/PanelAPI";

function Navbar(props) {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const history = useHistory();
  const [panel, setPanel] = useState([]);

  // const handleClick = () => setClick(!click);
  // const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    getUser(props.userId).then((response) => {
      if (!response.error) {
        // (response.data).forEach(user => setUsers(user));
        console.log(response);
        setPanel(response.data);
      }
    });
  }, [props.userId]);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };
  
  const { onauthLogout } = props;

  const handleLogout = () => {
    onauthLogout();
    history.push("/");
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  console.log(props.link)

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          {/* <Link to='/' className='navbar-logo' >
            <img src="uom.png"/>
          </Link> */}
          <p className="company">{panel.companyName}</p>
          <div className='menu-icon'>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            
            
            <li className='nav-item'>
              <Link to='/interviewvolunteer' className='nav-links'>
                Interviews
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/intervieweelist' className='nav-links'>
                Interviewees
              </Link>
            </li>
            <li className='nav-item'>
              <a href={panel.link} className='nav-links-button' target="_blank" >
                Join Meeting
              </a>
            </li>
            {/* <li className='nav-item'>
              <Link
                to='/contactvolunteer'
                className='nav-links'
              >
                Contact Volunteer
              </Link>
            </li> */}
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
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onauthLogout: () => dispatch(authLogout()),
    removeAlert: (alertId) => dispatch(removeAlert(alertId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
