import React, { Suspense, useEffect }  from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import SignIn from '../src/containers/Auth/auth';
import Companies from '../src/components/Pages/Admin/companies';
import Volunteers from '../src/components/Pages/Admin/volunteers';
import Panel from '../src/components/Pages/Admin/panels';
import InterviePanel from '../src/containers/Panel/panel';
import Interviewee from '../src/containers/Volunteers/Volunteers';
import Intervieweebasic from '../src/components/Pages/Admin/interviewee';
import VolunteerProfile from '../src/containers/Panel/UserProfile';
import UploadFiles from '../src/containers/Admin/Uploadfile';
import ContactVolunteers from '../src/containers/Panel/ContactVolunteer';
import ContactPanel from '../src/containers/Volunteers/ContactPanel';
import IntervieweeList from '../src/containers/Volunteers/IntervieweeList';

import * as actions from "./store/actions/index";
import * as routez from './shared/routes';
import {getSocket} from './services/socket'
import './App.css';

function App(props) {

  const onTryAutoSignIn = props.onTryAutoSignIn;

  useEffect(() => {
    onTryAutoSignIn();
    getSocket();
  }, [onTryAutoSignIn]);

  let routes = (
    <Suspense >
      <Switch>
        <Route exact path={routez.COMPANIES} component={Companies}/>
        <Route exact path={routez.VOLUNTEERS} component={Volunteers}/>
        <Route exact path={routez.PANELS} component={Panel}/>
        <Route exact path={routez.INTERVIEWEELIST} component={IntervieweeList}/>
        <Route exact path={routez.CONTACTVOLUNTEER} component={ContactVolunteers}/>
        <Route exact path={routez.INTERVIEPANNEL} component={InterviePanel}/>
        <Route exact path={routez.INTERVIEWEE} component={Interviewee}/>
        <Route exact path={routez.INTERVIEWEEBASIC} component={Intervieweebasic}/>
        <Route exact path={routez.VOLUNTEERPROFILE} component={VolunteerProfile}/>
        <Route exact path={routez.UPLOADFILES} component={UploadFiles}/>
        <Route exact path={routez.CONTACTPANEL} component={ContactPanel}/>
        <Route exact path={routez.SIGNIN} component={SignIn}/>
        <Redirect path="/" to={routez.SIGNIN} />
      </Switch>
    </Suspense>
  );


  return (
    <div className="App">
      {routes}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignIn: () => dispatch(actions.authCheckState()),
  };
};

// const withErrorhandlerWrappedComponent = withErrorHandler(App, axios);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
