import React , {useState, useEffect, useCallback } from "react";
import { connect } from 'react-redux';

import { Button } from "@material-ui/core";

import {getAllUsers, deleteUsers, updateUsers, saveUsers } from "../../api/VolunteerAPI"
import {replaceItemInArray, removeItemFromArray, addItemToArray} from "../../shared/utility";
import Table from "../../components/UI/Table/MaterialTable/Table";
import * as actions from '../../store/actions/index';
import {getSocket} from '../../services/socket';
import FHModal from "../../components/UI/FHModal/FHModal";
import ChangePassword from "../../containers/Admin/ChangePassword"

const UserTable = "User Table";

const tableOptions = {
  pageSize: 10,
  pageSizeOptions: [10, 30, 50]
};

const Users = props => {

  const [users, setUsers] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurentUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);

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
      console.log(JSON.stringify(newUser))
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
      console.log(JSON.stringify(data))
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

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  
  const renderPswdChange = useCallback(
    (rowData) => (
      <Button
        color="primary"
        onClick={() => {
          setCurentUser(rowData.id)
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
    { title: "Id", field: "id", editable:"never" },
    { title: "Name", field: "name", validate: rowData => rowData.name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true, },
    { title: "Email", field: "email", validate: rowData => rowData.email === '' ? { isValid: false, helperText: 'Emal cannot be empty' } : true, },
    { title: "Role", field: "role", lookup: { admin:"Admin", Volunteer:"Volunteer", Panel:"Panel"} },
    { title: "Contact Number", field: "contactNo", validate: rowData => rowData.contactNo === '' ? { isValid: false, helperText: 'Contact Number cannot be empty' } : true, },
    { title: "Settings", render: renderPswdChange },
  ];

  if (false) {
    //return <Spinner />
  } else {
    return (
      <div>
        <Table
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

export default connect(null, mapDispatchToProps)(Users);

// export default (Users);
