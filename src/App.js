import React, { Suspense }  from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

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
import IntervieweeList from '../src/containers/Volunteers/IntervieweeList'


import * as routez from './shared/routes';

import './App.css';

function App() {

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

export default App;
