import React, { useState, useCallback}  from 'react';
import { connect } from 'react-redux';

import {changepassword} from "../../api/OtherApi"
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { checkValidity } from '../../shared/validate';
import { updateObject } from '../../shared/utility';
import { buildTextFields } from '../../helpers/uiHelpers';
import { auth } from '../../store/actions/index';
import { addAlert } from '../../store/actions/index';

import Alert from '../../components/UI/FHAlert/FHAlert';
import { removeAlert } from "../../store/actions/index";



const inputDefinitions = {
    newPassword: {
        label: 'New Password*',
        type: 'password',
        validations: {
            required: true,
            minLength: 2,
            maxLength: 40,
            validationErrStr: 'Use between 6 and 40 characters for your password',
        }
    },
    confirmNewPassword: {
        label: 'Confirm Password*',
        type: 'password',
        validations: {
            required: true,
            minLength: 2,
            maxLength: 40,
            validationErrStr: 'Use between 6 and 40 characters for your password',
        }
    }
};

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundImage: '../../../public/loginback.svg',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  loginInput: {
    width: '100%',
    marginTop: '20px',
    color: 'white'
  },
}));

function SignIn(props) {
    const classes = useStyles();
    const { addAlert } = props;

    const [inputIsValid, setInputIsValid] = useState({
        newPassword: true,
        confirmNewPassword: true
    });

    const [authObj, setAuthObj] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });

    const inputProperties = {
        newPassword: {
            styleClass: classes.loginInput
        },
        confirmNewPassword: {
            styleClass: classes.loginInput
        }
    };

    const checkInputValidity = useCallback((inputId, newValue) => {
        let isValid = true;
        let validationConst = inputDefinitions[inputId].validations;
        isValid = checkValidity(validationConst, newValue ? newValue : authObj[inputId])

        return isValid;
    }, [authObj])

    const inputChangeHandler = useCallback((event, inputId) => {
        let validationConst = inputDefinitions[inputId].validations;
        let isValid = checkValidity(validationConst, event.target.value);
        setInputIsValid(updateObject(inputIsValid, { [inputId]: isValid }));
        setAuthObj(updateObject(authObj, { [inputId]: event.target.value }))
    }, [authObj, inputIsValid]);

    let inputFields = buildTextFields(inputDefinitions, inputProperties, inputChangeHandler, inputIsValid);

    const removeAlert = props.removeAlert;
    const handleAlertClose = useCallback((alertId) => {
        removeAlert(alertId);
    }, [removeAlert]);

    const onSubmitHandler = useCallback((event) => {
        event.preventDefault()

        let localInputIsValid = { ...inputIsValid };
        localInputIsValid['newPassword'] = checkInputValidity('newPassword');
        localInputIsValid['confirmNewPassword'] = checkInputValidity('confirmNewPassword');
        setInputIsValid(localInputIsValid);

        if (localInputIsValid['newPassword'] && localInputIsValid['confirmNewPassword'] && authObj.newPassword===authObj.confirmNewPassword) {
            console.log(authObj)
            changepassword(props.data,authObj)
                .then((response) => {
                    if (!response.error) {
                        addAlert({
                            message: "Password Changed Successfully!",
                        });
                    }else{
                        console.log(response)
                        addAlert({
                            message: response.error.response.data.message,
                        });
                    }
                    
                })
        }
    }, [authObj, checkInputValidity, inputIsValid, props,addAlert]);

    // const authError = props.error;
    // useEffect(() => {
    //     if (authError) {
    //         alert(authError)
    //     }
    // }, [authError,history]);

    // let errorMessage = null;
	// if (props.error) {
	// 	errorMessage = (
	// 		<div className={classes.errorLabel}>
	// 			<FormLabel error={true}>{parseErrorMessage(props.error)}</FormLabel>
	// 		</div>
	// 	);
	// }

  return (
    <React.Fragment>
        <div >
            <div className={classes.paper}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Alert handleAlertClose={handleAlertClose} alerts={props.alerts} /> 
                    <div >
                        <form noValidate autoComplete="off" className={classes.form} onSubmit={onSubmitHandler}>
                            <Avatar className={classes.avatar}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography variant="h5">
                                Change Password
                            </Typography>
                            {inputFields}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                            >
                                Sign In
                            </Button>
                        </form>
                    </div>
                </Container>
            </div>
        </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
    return {
        error: state.auth.error,
        loading: state.auth.loading,
        isAuthenticated: state.auth.token != null,
        authRedirectPath: state.auth.authRedirectPath,
        employeeID:state.auth.employeeID,
        isAdmin:state.auth.IsAdmin,
        isHrm:state.auth.IsHrm,
        IsSupervisor:state.auth.IsSupervisor,
        alerts: state.alert.alerts,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (gmail, password) => dispatch(auth(gmail, password)),
        addAlert: (alert) => dispatch(addAlert(alert)),
        removeAlert: (alertId) => dispatch(removeAlert(alertId))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);