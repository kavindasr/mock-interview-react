import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";

import {
  getAllParticipants,
  updateParticipants,
} from "../../api/InterviewsAPI";
import {getUser} from "../../api/PanelAPI";
import { replaceItemInArray, addItemToArray, removeItemFromArray, updateItemInArray } from "../../shared/utility";
import FHModal from "../../components/UI/FHModal/FHModal";
import UserProfile from "../Panel/UserProfile"
import Table from "../../components/UI/Table/MaterialTable/Table";
import Spinner from "../../components/UI/Spinner/Spinner";
import * as actions from "../../store/actions/index";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "../../components/UI/Navbar/Navbar";
import {getSocket} from '../../services/socket';

import { removeAlert } from "../../store/actions/index";
import Alert from '../../components/UI/FHAlert/FHAlert';

const IntervieweeTable = "Interviewee Table";

const tableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 30, 50],
  actionsColumnIndex: -1
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: 'blue',
    display:'flex',
    alignContent: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
  },
}));

const Users = (props) => {
  const classes = useStyles();
  const [participants, setParticipants] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurentUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    if (isLoading) {
      if(props.isAuthenticated){
        getAllParticipants(props.userId).then((response) => {
          if (!response.error) {
            // (response.data).forEach(user => setUsers(user));
            setParticipants(response.data);
          }
        }).finally(() => setIsLoading(false));
      }
    }
  }, [props,isLoading,participants]);

  useEffect(() => {
		if (props.isAuthenticated){
      let socket = getSocket();
      if (props.usertype.toLowerCase() === 'admin') {
        socket.emit('subscribe', 'admin','name');
      } else if (props.usertype.toLowerCase() ==='volunteer') {
        socket.emit('subscribe', 'volunteer',props.userId);
      } else if (props.usertype.toLowerCase() ==='panel'){
        socket.emit('subscribe', 'panel',props.userId);
      };
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
    (newUser, oldUser) => {
      return new Promise((resolve, reject) => {
        updateParticipants(oldUser.interviewID, newUser).then((response) => {
          if (!response.error) {
            addAlert({
              message: "Interviewee Status Successfully!",
            });
            setParticipants(
              replaceItemInArray(
                participants,
                "interviewID",
                newUser,
                oldUser.interviewID
              )
            );
            return resolve();
          }
          addAlert({
            message: "Failed!",
            severity: "error",
          });
          return reject();
        });
      });
    },
    [addAlert, participants]
  );

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const renderFeedbackBtn = useCallback(
    (rowData) => (
      <Button
        color="primary"
        onClick={() => {
          setCurentUser(rowData.intervieweeID)
          setIsEdit(false);
          setIsModalOpen(true);
        }}
      >
        Add Feedback
      </Button>
    ),
    []
  );

  // const renderProfileBtn = useCallback(
  //   (rowData) => (
  //     <Button
  //       color="primary"
  //       onClick={() => {
  //         setCurentUser(rowData.interviewID)
  //         setIsEdit(false);
  //         setIsModalOpen(true);
  //       }}
  //     >
  //       Profile
  //     </Button>
  //   ),
  //   []
  // );

  const renderCVBtn = useCallback(
    (rowData) => (
      <Button href={rowData.cv} className='nav-links' target="_blank" color="primary" >
        View CV
      </Button>
    ),
    []
  );

  const removeAlert = props.removeAlert;
    const handleAlertClose = useCallback((alertId) => {
        removeAlert(alertId);
    }, [removeAlert]);

  const tableColumns = [
    { title: 'Interviewee', field: 'intervieweeImg',editable: "never" , render: rowData => <img src={rowData.intervieweeImg} alt="ieee" style={{width: 40, borderRadius: '50%'}}/> },
    { title: "Interview ID", field: "interviewID", editable: "never", width: "10%" },
    { title: "Name", field: "name", editable: "never" },
    {
      title: "Availability",
      field: "availability",
      lookup: { true: "Available", false: "Not-Available" },
      editable: "never",
    },
    // { title: "Profile", render: renderProfileBtn },
    { title: "View CV", render: renderCVBtn },
    { title: "Profile", render: renderFeedbackBtn },
    {
      title: "State",
      field: "state",
      lookup: { Ongoing: "Ongoing", Next: "Next", Done: "Done" },
    },
  ];


  if (isLoading) {
    return <Spinner />
  } else {
    return (
      <React.Fragment>
        
        <Navbar panel={panel} />
        <Alert handleAlertClose={handleAlertClose} alerts={props.alerts} />
        <div className={classes.paper}>
          <Table
            data={participants}
            title={IntervieweeTable}
            columns={tableColumns}
            tableOptions={tableOptions}
            editable={{
              onRowUpdate: (newData, oldData) =>
                updateInterviee(newData, oldData),
            }}
          />
        </div>
        <FHModal
          customWidth="60%"
          body={
            <UserProfile
              data={currentUser}
              isEdit={isEdit}
              setIsModalOpen={setIsModalOpen}
            />
          }
          open={isModalOpen}
          handleClose={handleModalClose}
        />
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => {
  return {
      error: state.auth.error,
      userId: state.auth.userId,
      alerts: state.alert.alerts,
      usertype:state.auth.usertype,
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

// export default (Users);
