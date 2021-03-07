import React , {useState, useEffect, useCallback } from "react";
import { connect } from 'react-redux';

import { Button } from "@material-ui/core";

import {getAllPanels, deletePanels, updatePanels, savePanels } from "../../api/PanelAPI"
import {replaceItemInArray, removeItemFromArray, addItemToArray} from "../../shared/utility";
import Table from "../../components/UI/Table/MaterialTable/Table";
import * as actions from '../../store/actions/index';
import {getSocket} from '../../services/socket';
import FHModal from "../../components/UI/FHModal/FHModal";
import ChangePassword from "../../containers/Admin/ChangePassword"

const CompanyTable = "Panel Table";

const tableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 30, 50]
};

const Companies = props => {

  const [companies, setComanies ] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurentUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    getAllPanels()
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
		socket.on('panel', (method, data) => {
			console.log(`interviewwee ${method}`);
			console.log(data);
			switch (method) {
				case 'post':
					setComanies(addItemToArray(companies, data));
					break;
				case 'put':
					setComanies(replaceItemInArray(companies, 'companyID', data, data.companyID));
					break;
				case 'delete':
					setComanies(removeItemFromArray(companies, 'companyID', parseInt(data.id)));
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
        deletePanels(oldcompanies.panelID)
              .then((response) => {
                console.log(response);
                  if (!response.error) {
                      addAlert({
                          message: "Panel deletion Successful!",
                      });
                      setComanies(removeItemFromArray(companies, 'panelID', oldcompanies.panelID, oldcompanies))
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
        "companyID": newCompanies.companyID,
        "name": newCompanies.name,
        "email": newCompanies.email,
        "link": newCompanies.link,
        "contactNo": newCompanies.contactNo,
        "Volunteer": [
          {
              "volunteerID" : newCompanies.volunteerID 
          }
      ]
      })
      return new Promise((resolve, reject) => {
        updatePanels(oldCompanies.panelID, data)
              .then((response) => {
                  if (!response.error) {
                      addAlert({
                          message: "Panel Updated Successfully!",
                      });
                      setComanies(replaceItemInArray(companies, 'panelID', newCompanies, oldCompanies.panelID))
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
        "companyID": newCompanies.companyID,
        "name": newCompanies.name,
        "email": newCompanies.email,
        "link": newCompanies.link,
        "contactNo": newCompanies.contactNo,
        "Volunteer": [
          {
              "volunteerID" : newCompanies.volunteerID 
          }
      ]
      })
      console.log("hiii")
      console.log(JSON.stringify(data))
      return new Promise((resolve, reject) => {
        savePanels(data)
              .then((response) => {
                  if (!response.error) {
                      addAlert({
                          message: "Panel Saved Successfully!",
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
    [addAlert, companies]
  );
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const renderPswdChange = useCallback(
    (rowData) => (
      <Button
        color="primary"
        onClick={() => {
          setCurentUser(rowData.panelID)
          setIsEdit(false);
          setIsModalOpen(true);
        }}
      >
        Change Password
      </Button>
    ),
    []
  );

  const tableColumns = [
    { title: "Panel Id", field: "panelID" },
    { title: "Company Id", field: "companyID", validate: rowData => rowData.companyID === '' ? { isValid: false, helperText: 'Company ID cannot be empty' } : true, },
    { title: "Name", field: "name", validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true, },
    { title: "Email", field: "email", validate: rowData => rowData.email === '' ? { isValid: false, helperText: 'Email cannot be empty' } : true, },
    { title: "Volunteer Id", field: "volunteerID", validate: rowData => rowData.volunteerID === '' ? { isValid: false, helperText: 'Volunteer ID cannot be empty' } : true, },
    { title: "Link", field: "link", validate: rowData => rowData.link === '' ? { isValid: false, helperText: 'Link cannot be empty' } : true, },
    { title: "Contact Number", field: "contactNo", validate: rowData => rowData.contactNo=== '' ? { isValid: false, helperText: 'Contact Number cannot be empty' } : true, },
    { title: "Settings", render: renderPswdChange },
  ];

  if (false) {
    //return <Spinner />
  } else {
    return (
      <div>
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
        <FHModal
            customWidth="60%"
            body={
              <ChangePassword
                data={currentUser}
                isEdit={isEdit}
                setIsModalOpen={setIsModalOpen}
              />
          }
          open={isModalOpen}
          handleClose={handleModalClose}
        />
      </div>
    )
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAlert: alert => dispatch(actions.addAlert(alert))
  };
}

export default connect(null, mapDispatchToProps)(Companies);
