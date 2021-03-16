import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { Link } from 'react-router-dom';
import './Navbar.css';

import { authLogout, removeAlert } from "../../../store/actions/index";
import {getUser} from "../../../api/PanelAPI";

function Navbar(props) {
  // const [click, setClick] = useState(false);
  // const [button, setButton] = useState(true);
  const history = useHistory();
  const [panel, setPanel] = useState([]);

  // const handleClick = () => setClick(!click);
  // const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    if (props.isAuthenticated){
      getUser(props.userId).then((response) => {
        if (!response.error) {
          // (response.data).forEach(user => setUsers(user));
          setPanel(response.data);
        }
      });
    }
  }, [props]);

  // const showButton = () => {
  //   if (window.innerWidth <= 960) {
  //     setButton(false);
  //   } else {
  //     setButton(true);
  //   }
  // };
  
  const { onauthLogout } = props;

  const handleLogout = () => {
    onauthLogout();
    history.push("/");
  };

  // useEffect(() => {
  //   showButton();
  // }, []);

  // window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
            {/* <img src="http://res.cloudinary.com/isuruieee/image/upload/v1615335946/pghlhnpejcvtozbv7li4.jpg" alt="IEEE" width="5%" height="30%"/> */}
          <p className="company">{panel.companyName}</p>
          <div className='menu-icon'>
            <i className={'fas fa-times'} />
          </div>
          <ul className={'nav-menu active'}>
            
            
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
              <Link to='/contactpanel' className='nav-links'>
                Contact Pannel
              </Link>
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
