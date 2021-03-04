import React , {useState, useEffect, useCallback } from "react";
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

import {getAllUsers, deleteUsers, updateUsers, saveUsers } from "../../api/VolunteerAPI"
import {replaceItemInArray, removeItemFromArray, addItemToArray} from "../../shared/utility";
import Table from "../../components/UI/Table/MaterialTable/Table";
import * as actions from '../../store/actions/index';
import { Button } from "@material-ui/core";
import {getSocket} from '../../services/socket';

const UserTable = "User Table";

const tableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 30, 50]
};

const Users = props => {
  let history = useHistory();

  const [users, setUsers] = useState([]);
  useEffect(() => {
      getAllUsers()
        .then((response) => {
          if (!response.error) {
            // (response.data).forEach(user => setUsers(user));
            console.log(response)
            setUsers(response.data)
          }
        })
  }, []);
  useEffect(() => {
		let socket = getSocket();
		socket.on('user', (method, data) => {
      console.log(`interviewwee ${method}`);
			console.log(data);
			switch (method) {
				case 'post':
					setUsers(addItemToArray(users, data));
					break;
				case 'put':
					setUsers(replaceItemInArray(users, 'id', data, data.id));
					break;
				case 'delete':
					console.log("In");
					console.log(data.id);
					setUsers(removeItemFromArray(users, 'id', parseInt(data.id)));
					break;
				default:
					console.log('Invalid method');
					break;
			}
		});
	}, [users]);
   const { addAlert } = props;
  // const [isLoading, setIsLoading] = useState(true);

  const deleteUser = useCallback(
    (oldUser) => {
      return new Promise((resolve, reject) => {
        deleteUsers(oldUser.id)
              .then((response) => {
                console.log(response);
                  if (!response.error) {
                      addAlert({
                          message: "User deletion Successful!",
                      });
                      setUsers(removeItemFromArray(users, 'id', oldUser.id, oldUser))
                      return resolve();
                  }
                  addAlert({
                    message: "Failed!",
                  });
                  return reject();
              })
      });
    },
    [addAlert, users]
  );

  const updateUser = useCallback(
    (newUser,oldUser) => {
      return new Promise((resolve, reject) => {
          updateUsers(oldUser.id, newUser)
              .then((response) => {
                  if (!response.error) {
                      addAlert({
                          message: "User Updated Successfully!",
                      });
                      setUsers(replaceItemInArray(users, 'id', newUser, oldUser.id))
                      return resolve();
                  }
                  addAlert({
                    message: "Failed!",
                  });
                  return reject();
              })
      });
    },
    [addAlert, users]
  );

  const saveUser = useCallback(
    (newUser) => {
      var data=({
        "id": newUser.id,
        "name": newUser.name,
        "email": newUser.email,
        "role": newUser.role,
        "contactNo": newUser.contactNo,
      })
      return new Promise((resolve, reject) => {
        saveUsers(data)
              .then((response) => {
                  if (!response.error) {
                      addAlert({
                          message: "User Saved Successfully!",
                      });
                      setUsers(addItemToArray(users, response.data))
                      return resolve();
                  }
                  addAlert({
                    message: "Failed!",
                  });
                  return reject();
              })
        });
    },
    [addAlert, users]
  );
  
  const renderProfileBtn = useCallback(
    (rowData) => <Button color="primary" onClick={() => history.push(`users/${rowData.id}`)}>Profile</Button>,
    [history]
  );

  const tableColumns = [
    { title: "Id", field: "id", editable:"never" },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Role", field: "role", lookup: { Admin:"Admin", Volunteer:"Volunteer", Panel:"Panel"} },
    { title: "Contact Number", field: "contactNo" },
  ];

  if (false) {
    //return <Spinner />
  } else {
    return <Table
      data={users}
      title={UserTable}
      columns={tableColumns}
      tableOptions={tableOptions}
      editable={{
        onRowAdd: newData =>saveUser(newData),
        onRowUpdate: (newData, oldData) =>updateUser(newData, oldData ),
        onRowDelete: oldData => deleteUser(oldData),
      }}
    />
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAlert: alert => dispatch(actions.addAlert(alert))
  };
}

export default connect(null, mapDispatchToProps)(Users);

// export default (Users);
