import React , {useState, useEffect, useCallback } from "react";
import { connect } from 'react-redux';

import {getAllParticipants, updateParticipants, saveInterviewees } from "../../api/VolunteerInterviewsAPI"
import {getUser} from "../../api/PanelAPI";
import {replaceItemInArray, addItemToArray, removeItemFromArray, updateItemInArray} from "../../shared/utility";
import Table from "../../components/UI/Table/MaterialTable/Table";
import * as actions from '../../store/actions/index';
import {getSocket} from '../../services/socket';
import Navbar from "../../components/UI/Navbar/NavbarVolun";
import { removeAlert } from "../../store/actions/index";
import Alert from '../../components/UI/FHAlert/FHAlert';

const IntervieweeTable = "Interview Table";

const tableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 30, 50],
  actionsColumnIndex: -1
};

const Users = props => {

  const [participants, setParticipants] = useState([]);
  const [panel, setPanel] = useState([]);

  useEffect(() => {
    if(props.isAuthenticated){
      getUser(props.userId).then((response) => {
        if (!response.error) {
          // (response.data).forEach(user => setUsers(user));
          setPanel(response.data);
        }
      });
    }
  }, [props]);
  useEffect(() => {
      if(props.isAuthenticated){
        getAllParticipants(props.userId)
        .then((response) => {
          if (!response.error) {
            // (response.data).forEach(user => setUsers(user));
            setParticipants(response.data)
          }
        })
      }
  }, [props]);
  
  useEffect(() => {
		let socket = getSocket();
		if (props.isAuthenticated){
      socket.on('interview', (method, data) => {
        switch (method) {
          case 'post':
            setParticipants(addItemToArray(participants, data));
            break;
          case 'put':
            setParticipants(replaceItemInArray(participants, 'interviewID', data, data.interviewID));
            break;
          case 'delete':
            setParticipants(removeItemFromArray(participants, 'interviewID', parseInt(data.id)));
            break;
          default:
            console.log('Invalid method');
            break;
        }
      });
      socket.on('interviewee', (method, data) => {
        switch (method) {
          case 'put':
            setParticipants(updateItemInArray(participants, 'intervieweeID', data));
            break;
          case 'delete':
            setParticipants(removeItemFromArray(participants, 'intervieweeID', parseInt(data.id)));
            break;
          default:
            console.log('Invalid method');
            break;
        }
      });
    }
	}, [participants,props]);
   const { addAlert } = props;
  // const [isLoading, setIsLoading] = useState(true);

  const updateInterviee = useCallback(
    (newUser,oldUser) => {
      var data=({
        "availability" : newUser.availability, 
      })
      return new Promise((resolve, reject) => {
          updateParticipants(oldUser.intervieweeID, data)
              .then((response) => {
                  if (!response.error) {
                      addAlert({
                          message: "Interviewee Status Successfully!",
                      });
                      setParticipants(replaceItemInArray(participants, 'interviewID', newUser, oldUser.interviewID))
                      return resolve();
                  }
                  addAlert({
                    severity: "error",
                    message: "Failed!",
                  });
                  return reject();
              })
      });
    },
    [addAlert, participants]
  );

  const removeAlert = props.removeAlert;
    const handleAlertClose = useCallback((alertId) => {
        removeAlert(alertId);
    }, [removeAlert]);

  const saveInterviee = useCallback(
    (newCompanies) => {
      var data=({
          "panelID": props.userId[0],
          "intervieweeID" : newCompanies.intervieweeID, 
      })
      return new Promise((resolve, reject) => {
        saveInterviewees(data)
              .then((response) => {
                  if (!response.error) {
                      addAlert({
                          message: "Interview Saved Successfully!",
                      });
                      setParticipants(addItemToArray(participants, response.data))
                      return resolve();
                  }
                  addAlert({
                    severity: "error",
                    message: "Failed!",
                  });
                  return reject();
              })
        });
    },
    [addAlert, participants, props]
  );
  
  // const renderProfileBtn = useCallback(
  //   (rowData) => <Button color="primary" onClick={() => history.push(`users/${rowData.id}`)}>Profile</Button>,
  //   [history]
  // );

  const tableColumns = [
    { title: "Interviewee ID", field: "intervieweeID" },
    { title: "Interview ID", field: "interviewID", editable:"never" },
    { title: "Name", field: "name", editable:"never"  },
    { title: "Email", field: "email", editable:"never"  },
    { title: "Contact Number", field: "contactNo", editable:"never"  },
    { title: "State", field: "state", lookup: { Ongoing:"Ongoing", Next:"Next", Done:"Done"}, editable:"never" },
    { title: "Availability", field: "availability", lookup: { true:"Available", false:"Not-Available"}  },
  ];

  if (false) {
    //return <Spinner />
  } else {
    return (
      <React.Fragment>
          <Navbar panel={panel}/>
          <Alert handleAlertClose={handleAlertClose} alerts={props.alerts} />
          <Table
            data={participants}
            title={IntervieweeTable}
            columns={tableColumns}
            tableOptions={tableOptions}
            editable={{
              onRowAdd: newData =>saveInterviee(newData),
              onRowUpdate: (newData, oldData) =>updateInterviee(newData, oldData ),
            }}
            options={{
              actionsColumnIndex: -1
            }}
          />
      </React.Fragment>
    )
  }
};

const mapStateToProps = (state) => {
  return {
      error: state.auth.error,
      userId: state.auth.userId,
      alerts: state.alert.alerts,
      isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      addAlert: (alert) => dispatch(actions.addAlert(alert)),
      removeAlert: (alertId) => dispatch(removeAlert(alertId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);