import React from 'react';
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import { Link } from 'react-router-dom';
import './Navbar.css';

import { authLogout, removeAlert } from "../../../store/actions/index";

function Navbar(props) {
  // const [click, setClick] = useState(false);
  // const [button, setButton] = useState(true);
  const history = useHistory();

  // const handleClick = () => setClick(!click);
  // const closeMobileMenu = () => setClick(false);

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
      <nav className='navbar'>
        <div className='navbar-container'>
            {/* <img src="http://res.cloudinary.com/isuruieee/image/upload/v1615335946/pghlhnpejcvtozbv7li4.jpg" alt="IEEE" width="5%" height="35%"/> */}
          <p className="company">{props.panel? props.panel.companyName : " " }</p>
          <div className='menu-icon'>
            <i className={'fas fa-times'} />
          </div>
          <ul className={'nav-menu active'}>
            
            
            <li className='nav-item'>
              <Link to='/interviewpanel' className='nav-links'>
                Participants
              </Link>
            </li>
            <li className='nav-item'>
              <a href={props.panel? props.panel.link : " " } className='nav-links-button' target="_blank" rel="noreferrer">
                Join Meeting
              </a>
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
