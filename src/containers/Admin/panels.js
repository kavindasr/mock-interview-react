import React , {useState, useEffect, useCallback } from "react";
import { connect } from 'react-redux';

import {getAllPanels, deletePanels, updatePanels, savePanels } from "../../api/PanelAPI"
import {replaceItemInArray, removeItemFromArray, addItemToArray} from "../../shared/utility";
import Table from "../../components/UI/Table/MaterialTable/Table";
import * as actions from '../../store/actions/index';
import {getSocket} from '../../services/socket';

const CompanyTable = "Panel Table";

const tableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 30, 50]
};

const Companies = props => {

  const [companies, setComanies ] = useState([]);
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
                          message: "Company deletion Successful!",
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
      return new Promise((resolve, reject) => {
        updatePanels(oldCompanies.panelID, newCompanies)
              .then((response) => {
                  if (!response.error) {
                      addAlert({
                          message: "Company Updated Successfully!",
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
    [addAlert, companies]
  );
  
  // const renderProfileBtn = useCallback(
  //   (rowData) => <Button color="primary" onClick={() => history.push(`users/${rowData.officerID}`)}>Profile</Button>,
  //   [history]
  // );

  const tableColumns = [
    { title: "Panel Id", field: "panelID" },
    { title: "Company Id", field: "companyID" },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Volunteer Id", field: "volunteerID" },
    { title: "Link", field: "link" },
    { title: "Contact Number", field: "contactNo" },
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
