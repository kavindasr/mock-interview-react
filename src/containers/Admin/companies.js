import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getAllCompanies, deleteCompanies, updateCompanies, saveCompamies } from '../../api/CompaniesAPI';
import { replaceItemInArray, removeItemFromArray, addItemToArray } from '../../shared/utility';
import Table from '../../components/UI/Table/MaterialTable/Table';
import * as actions from '../../store/actions/index';
import { Button } from '@material-ui/core';
import {getSocket} from '../../services/socket';

const CompanyTable = 'Company Table';

const tableOptions = {
	pageSize: 10,
	pageSizeOptions: [10, 30, 50],
};

const Companies = (props) => {
	let history = useHistory();

	const [companies, setComanies] = useState([]);
	useEffect(() => {
		getAllCompanies().then((response) => {
			if (!response.error) {
				// (response.data).forEach(user => setUsers(user));
				console.log(response);
				setComanies(response.data);
			}
		});
	}, []);
	useEffect(() => {
		let socket = getSocket();
		socket.on('company', (method, data) => {
			console.log("Event triggered");
			console.log(method);
			console.log(data);
			switch (method) {
				case 'post':
					setComanies(addItemToArray(companies, data));
					break;
				case 'put':
					setComanies(replaceItemInArray(companies, 'companyID', data, data.companyID));
					break;
				case 'delete':
					console.log("In");
					console.log(data.id);
					setComanies(removeItemFromArray(companies, 'companyID', parseInt(data.id)));
					break;
				default:
					console.log('Invalid method');
					break;
			}
		});
	}, [companies]);
	useEffect(() => {
		let socket = getSocket();
		socket.on('user', (method) => {
			console.log("Event triggered");
			console.log(method);
		});
	}, []);
	const { addAlert } = props;
	// const [isLoading, setIsLoading] = useState(true);

	const deleteCompany = useCallback(
		(oldcompanies) => {
			return new Promise((resolve, reject) => {
				deleteCompanies(oldcompanies.companyID).then((response) => {
					console.log(response);
					if (!response.error) {
						addAlert({
							message: 'Company deletion Successful!',
						});
						setComanies(removeItemFromArray(companies, 'companyID', oldcompanies.companyID, oldcompanies));
						return resolve();
					}
					addAlert({
						message: 'Failed!',
					});
					return reject();
				});
			});
		},
		[addAlert, companies]
	);

	const updateCompany = useCallback(
		(newCompanies, oldCompanies) => {
			return new Promise((resolve, reject) => {
				updateCompanies(oldCompanies.companyID, newCompanies).then((response) => {
					if (!response.error) {
						addAlert({
							message: 'Company Updated Successfully!',
						});
						setComanies(replaceItemInArray(companies, 'companyID', newCompanies, oldCompanies.companyID));
						return resolve();
					}
					addAlert({
						message: 'Failed!',
					});
					return reject();
				});
			});
		},
		[addAlert, companies]
	);

	const saveCompany = useCallback(
		(newCompanies) => {
			var data = {
				companyID: newCompanies.companyID,
				companyName: newCompanies.companyName,
				email: newCompanies.email,
				contactNo: newCompanies.contactNo,
			};
			return new Promise((resolve, reject) => {
				saveCompamies(data).then((response) => {
					if (!response.error) {
						addAlert({
							message: 'Company Saved Successfully!',
						});
						setComanies(addItemToArray(companies, response.data));
						return resolve();
					}
					addAlert({
						message: 'Failed!',
					});
					return reject();
				});
			});
		},
		[addAlert, companies]
	);

	const renderProfileBtn = useCallback(
		(rowData) => (
			<Button color="primary" onClick={() => history.push(`users/${rowData.officerID}`)}>
				Profile
			</Button>
		),
		[history]
	);

	const tableColumns = [
		{ title: 'Company Id', field: 'companyID', editable: 'never' },
		{ title: 'Name', field: 'companyName' },
		{ title: 'Email', field: 'email' },
		{ title: 'Contact Number', field: 'contactNo' },
	];

	if (false) {
		//return <Spinner />
	} else {
		return (
			<Table
				data={companies}
				title={CompanyTable}
				columns={tableColumns}
				tableOptions={tableOptions}
				editable={{
					onRowAdd: (newData) => saveCompany(newData),
					onRowUpdate: (newData, oldData) => updateCompany(newData, oldData),
				}}
			/>
		);
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		addAlert: (alert) => dispatch(actions.addAlert(alert)),
	};
};

export default connect(null, mapDispatchToProps)(Companies);
