import React , {useState, useEffect, useCallback } from "react";
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import Axios from 'axios';
import Image from 'cloudinary-react';

import {getAllInterviewee, deleteInterviewee, updateInterviewee, saveInterviewee } from "../../api/IntervieweeAPI"
import {replaceItemInArray, removeItemFromArray, addItemToArray} from "../../shared/utility";
import Table from "../../components/UI/Table/MaterialTable/Table";
import * as actions from '../../store/actions/index';
import { Button } from "@material-ui/core";
import {getSocket} from '../../services/socket';

const CompanyTable = "Interviewee Table";

const tableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 30, 50]
};

const Companies = props => {
  let history = useHistory();

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
    [addAlert, companies]
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
                          message: "Company Saved Successfully!",
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
  });
  
  const renderCVBtn = useCallback(
    (rowData) => {
      <input type="file"/>
    },[]
  );

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
     []
  );

  const tableColumns = [
    { title: "Interviewee Id", field: "intervieweeID", editable:"never" },
    { title: "Name", field: "name" },
    { title: "Department", field: "dept" },
    { title: "Email", field: "email" },
    { title: "Contact Number", field: "contactNo" },
    { title: "CV", field: "cv"},
    // { title: "Upload CV", render: renderCVBtn },
    { title: "Image", field: "intervieweeImg" ,  editable:"never"},
    { title: "Upload Image", render: renderImgBtn },
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
