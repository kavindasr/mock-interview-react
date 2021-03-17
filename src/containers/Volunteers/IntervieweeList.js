import React , {useState, useEffect, useCallback } from "react";
import { connect } from 'react-redux';
import Axios from 'axios';
import { makeStyles } from "@material-ui/core/styles";

import {getAllInterviewee, deleteInterviewee, updateInterviewee, saveInterviewee } from "../../api/IntervieweeAPI";
import {getUser} from "../../api/PanelAPI";
import {replaceItemInArray, removeItemFromArray, addItemToArray} from "../../shared/utility";
import Table from "../../components/UI/Table/MaterialTable/Table";
import * as actions from '../../store/actions/index';
import {getSocket} from '../../services/socket';
import Navbar from "../../components/UI/Navbar/NavbarVolun";
import { removeAlert } from "../../store/actions/index";
import Alert from '../../components/UI/FHAlert/FHAlert';

const CompanyTable = "Interviewee Table";

const tableOptions = {
  pageSize: 30,
  pageSizeOptions: [10, 30, 50]
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

const Companies = props => {
  const classes = useStyles();
  const [companies, setComanies ] = useState([]);
  const [imageUrl,setimageUrl] =useState("");
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
    getAllInterviewee()
        .then((response) => {
          if (!response.error) {
            // (response.data).forEach(user => setUsers(user));
            setComanies(response.data)
          }
        })
  }, [props.userId]);

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
      socket.on('interviewee', (method, data) => {
        switch (method) {
          case 'post':
            setComanies(addItemToArray(companies, data));
            break;
          case 'put':
            setComanies(replaceItemInArray(companies, 'intervieweeID', data, data.intervieweeID));
            break;
          case 'delete':
            setComanies(removeItemFromArray(companies, 'intervieweeID', parseInt(data.id)));
            break;
          default:
            console.log('Invalid method');
            break;
        }
      });
    }
	}, [companies,props]);
  
   const { addAlert } = props;
  // const [isLoading, setIsLoading] = useState(true);

  const deleteCompany = useCallback(
    (oldcompanies) => {
      return new Promise((resolve, reject) => {
        deleteInterviewee(oldcompanies.intervieweeID)
              .then((response) => {
                  if (!response.error) {
                      addAlert({
                          message: "Interviewee deletion Successful!",
                      });
                      setComanies(removeItemFromArray(companies, 'intervieweeID', oldcompanies.intervieweeID, oldcompanies))
                      return resolve();
                  }
                  addAlert({
                    message: "Failed!",
                    severity: "error",
                  });
                  return reject();
              })
      });
    },
    [addAlert, companies]
  );

  const removeAlert = props.removeAlert;
    const handleAlertClose = useCallback((alertId) => {
        removeAlert(alertId);
    }, [removeAlert]);

  const updateCompany = useCallback(
    (newCompanies,oldCompanies) => {
      var data=({
        "intervieweeID": newCompanies.intervieweeID,
        "name": newCompanies.name,
        "dept": newCompanies.dept,
        "email": newCompanies.email,
        "contactNo": newCompanies.contactNo,
        "cv": newCompanies.cv,
        "intervieweeImg": imageUrl,
      })
      return new Promise((resolve, reject) => {
        updateInterviewee(oldCompanies.intervieweeID, data)
              .then((response) => {
                  if (!response.error) {
                      addAlert({
                          message: "Interviewee Updated Successfully!",
                      });
                      setComanies(replaceItemInArray(companies, 'intervieweeID', newCompanies, oldCompanies.intervieweeID))
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
    [addAlert, companies, imageUrl]
  );

  const saveCompany = useCallback(
    (newCompanies) => {
      var data=({
        "intervieweeID": newCompanies.intervieweeID,
        "name": newCompanies.name,
        "dept": newCompanies.dept,
        "email": newCompanies.email,
        "contactNo": newCompanies.contactNo,
        "cv": newCompanies.cv,
        "intervieweeImg": imageUrl,
      })
      return new Promise((resolve, reject) => {
        saveInterviewee(data)
              .then((response) => {
                  if (!response.error) {
                      addAlert({
                          message: "Interviewee Saved Successfully!",
                      });
                      setComanies(addItemToArray(companies, response.data))
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
    [addAlert, companies, imageUrl]
  );

  const uploadImage =useCallback((file) =>{
    var FormData = require('form-data');
    return new Promise((resolve, reject) => {
      var formdata =new FormData();
      formdata.append('file', file[0]);
      formdata.append('upload_preset','x66yntbe');
      // const cloudinaryURL ="https://api.cloudinary.com/v1_1/isuruieee/image/upload";
      Axios.post(
        "https://api.cloudinary.com/v1_1/isuruieee/image/upload",
        formdata
      ).then((response) => {
        setimageUrl(response.data.url)
      })
      .catch((error) => {
        console.log(error)
      })

      // const xhr = new XMLHttpRequest();
      // xhr.open('POST', cloudinaryURL, false);
      // xhr.send(formdata);
      // const imageResponse = JSON.parse(xhr.responseText);
    })
  },[]);
  
  // const renderCVBtn = useCallback(
  //   (rowData) => {
  //     <input type="file"/>
  //   },[]
  // );

  const renderImgBtn = useCallback(
    (rowData) => 
      <div>
        <input 
          type="file"
          onChange = {(event) => {
            uploadImage(event.target.files);
          }}
        />
        {/* <button onClick={() => uploadImage(imageSelected)}>Upload Images</button> */}
      </div>,
     [uploadImage]
  );

  const tableColumns = [
    { title: "Interviewee Id", field: "intervieweeID", editable:"never" },
    { title: "Name", field: "name", width: "10%", validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true},
    { title: "Department", field: "dept", validate: rowData => rowData.dept === '' ? { isValid: false, helperText: 'Department cannot be empty' } : true, },
    { title: "Email", field: "email", validate: rowData => rowData.email === '' ? { isValid: false, helperText: 'Email cannot be empty' } : true, },
    { title: "Contact Number", field: "contactNo", validate: rowData => rowData.contactNo === '' ? { isValid: false, helperText: 'Contact Number cannot be empty' } : true, },
    { title: "CV", field: "cv"},
    // { title: "Upload CV", render: renderCVBtn },
    { title: "Upload Image", render: renderImgBtn },
    { title: "Image", field: "intervieweeImg" ,  editable:"never"},
  ];

  if (false) {
    //return <Spinner />
  } else {
    return(
      <React.Fragment>
        <Navbar panel={panel}/>
        <Alert handleAlertClose={handleAlertClose} alerts={props.alerts} />
        <div className={classes.paper}>
          <Table
            data={companies}
            title={CompanyTable}
            columns={tableColumns}
            tableOptions={tableOptions}
            editable={{
              onRowAdd: newData =>saveCompany(newData),
              onRowUpdate: (newData, oldData) =>updateCompany(newData, oldData ),
              onRowDelete: oldData => deleteCompany(oldData),
            }}
          />
        </div>
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
      usertype:state.auth.usertype,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
      addAlert: (alert) => dispatch(actions.addAlert(alert)),
      removeAlert: (alertId) => dispatch(removeAlert(alertId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Companies);