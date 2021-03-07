import React , {useState, useEffect, useCallback } from "react";
import { connect } from 'react-redux';
import Axios from 'axios';

import {getAllInterviewee, deleteInterviewee, updateInterviewee, saveInterviewee } from "../../api/IntervieweeAPI"
import {replaceItemInArray, removeItemFromArray, addItemToArray} from "../../shared/utility";
import Table from "../../components/UI/Table/MaterialTable/Table";
import * as actions from '../../store/actions/index';
import {getSocket} from '../../services/socket';

const CompanyTable = "Interviewee Table";

const tableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 30, 50]
};

const Companies = props => {

  const [companies, setComanies ] = useState([]);
  const [imageUrl,setimageUrl] =useState("");
  useEffect(() => {
    getAllInterviewee()
        .then((response) => {
          if (!response.error) {
            // (response.data).forEach(user => setUsers(user));
            console.log(response)
            setComanies(response.data)
          }
        })
  }, []);

  useEffect(() => {
		let socket = getSocket();
		socket.on('interviewee', (method, data) => {
			console.log(`interviewwee ${method}`);
			console.log(data);
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
	}, [companies]);
  
   const { addAlert } = props;
  // const [isLoading, setIsLoading] = useState(true);

  const deleteCompany = useCallback(
    (oldcompanies) => {
      return new Promise((resolve, reject) => {
        deleteInterviewee(oldcompanies.intervieweeID)
              .then((response) => {
                console.log(response);
                  if (!response.error) {
                      addAlert({
                          message: "Interviewee deletion Successful!",
                      });
                      setComanies(removeItemFromArray(companies, 'intervieweeID', oldcompanies.intervieweeID, oldcompanies))
                      return resolve();
                  }
                  addAlert({
                    message: "Failed!",
                  });
                  return reject();
              })
      });
    },
    [addAlert, companies]
  );

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
      console.log(data)
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
        console.log(response.data.url)
        console.log(imageUrl)
      })
      .catch((error) => {
        console.log(error)
      })

      // const xhr = new XMLHttpRequest();
      // xhr.open('POST', cloudinaryURL, false);
      // xhr.send(formdata);
      // const imageResponse = JSON.parse(xhr.responseText);
    })
  },[imageUrl]);
  
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
          onChange = {(event) => uploadImage(event.target.files)}
        />
        {/* <button onClick={() => uploadImage(imageSelected)}>Upload Images</button> */}
      </div>,
     [uploadImage]
  );

  const tableColumns = [
    { title: "Interviewee Id", field: "intervieweeID", editable:"never" },
    { title: "Name", field: "name", validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true, },
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
    return <Table
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
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAlert: alert => dispatch(actions.addAlert(alert))
  };
}

export default connect(null, mapDispatchToProps)(Companies);
