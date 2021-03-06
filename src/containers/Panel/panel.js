import React, { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

import {
  getAllParticipants,
  updateParticipants,
} from "../../api/InterviewsAPI";
import { replaceItemInArray, addItemToArray, removeItemFromArray, updateItemInArray } from "../../shared/utility";
import FHModal from "../../components/UI/FHModal/FHModal";
import UserProfile from "../Panel/UserProfile"
import Table from "../../components/UI/Table/MaterialTable/Table";
import * as actions from "../../store/actions/index";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "../../components/UI/Navbar/Navbar";
import {getSocket} from '../../services/socket';

const IntervieweeTable = "Interviewee Table";

const tableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 30, 50],
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    width: '100%',
    color: 'blue',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    justifyItems: 'center'
  },
}));

const Users = (props) => {
  const classes = useStyles();
  const [participants, setParticipants] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurentUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getAllParticipants(props.userId).then((response) => {
      if (!response.error) {
        // (response.data).forEach(user => setUsers(user));
        console.log(response);
        setParticipants(response.data);
      }
    });
  }, [props.userId]);

  useEffect(() => {
		let socket = getSocket();
		socket.on('interview', (method, data) => {
      console.log(method);
			console.log(data);
			switch (method) {
				case 'post':
					setParticipants(addItemToArray(participants, data));
					break;
				case 'put':
					setParticipants(replaceItemInArray(participants, 'interviewID', data, data.interviewID));
					break;
				case 'delete':
					console.log(data.id);
					setParticipants(removeItemFromArray(participants, 'interviewID', parseInt(data.id)));
					break;
				default:
					console.log('Invalid method');
					break;
			}
		});
    socket.on('interviewee', (method, data) => {
      console.log(method);
			console.log(data);
			switch (method) {
				case 'put':
					setParticipants(updateItemInArray(participants, 'intervieweeID', data));
					break;
				case 'delete':
					console.log(data.id);
					setParticipants(removeItemFromArray(participants, 'intervieweeID', parseInt(data.id)));
					break;
				default:
					console.log('Invalid method');
					break;
			}
		});

	}, [participants]);
  const { addAlert } = props;
  // const [isLoading, setIsLoading] = useState(true);

  console.log(props.userId);

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
          setCurentUser(rowData.interviewID)
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
      <Link href={rowData.cv} target="_blank" >
            {rowData.cv}
      </Link>
    ),
    []
  );

  const tableColumns = [
    { title: 'Interviewee', field: 'intervieweeImg', render: rowData => <img src={rowData.intervieweeImg} alt="ieee" style={{width: 40, borderRadius: '50%'}}/> },
    { title: "Interview ID", field: "interviewID", editable: "never", width: "10%" },
    { title: "Name", field: "name", editable: "never" },
    {
      title: "State",
      field: "state",
      lookup: { Ongoing: "Ongoing", Next: "Next", Done: "Done" },
    },
    {
      title: "Availability",
      field: "availability",
      lookup: { true: "Available", false: "Not-Available" },
      editable: "never",
    },
    // { title: "Profile", render: renderProfileBtn },
    { title: "View CV", render: renderCVBtn },
    { title: "Profile", render: renderFeedbackBtn },
  ];


  if (false) {
    //return <Spinner />
  } else {
    return (
      <div className={classes.root}>
        
        <Navbar companyName="ABC Company" link="uom.lk"/>

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
            className={classes.table}
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
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAlert: (alert) => dispatch(actions.addAlert(alert)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);

// export default (Users);
