import React, {useEffect,useState, useCallback} from "react";
import { connect } from 'react-redux';

import {
  getInterviewee,
  addFeedback,
} from "../../api/InterviewsAPI";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Button from "../../components/UI/CustomButtons/Button";
import Card from "../../components/UI/Card/Card";
import CardBody from "../../components/UI/Card/CardBody";
import CardMedia from '@material-ui/core/CardMedia';
// import {Cloudinary} from 'cloudinary-core';
// const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'isuruieee'});
import {Image} from 'cloudinary-react';
import TextField from '@material-ui/core/TextField';
import Alert from '../../components/UI/FHAlert/FHAlert';
import { removeAlert } from "../../store/actions/index";
import { addAlert } from '../../store/actions/index';


// import avatar from "assets/img/faces/marc.jpg";

const useStyles = makeStyles((theme) => ({
  root:{
    width:"100%",
    overFlow: "scroll",
    backgroundColor: "rgb(186, 192, 192)"
  },
  // card: {
  //   padding: theme.spacing(2),
  // },
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
  card:{
    backgroundColor: "rgb(186, 192, 192)",
  },
  cardName:{
    color: "black",
    fontSize : "30px",
  },
  cardemail:{
    color: "black"
  },
  cardnumber:{
    color: "black"
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
},
}));

const UserProfile = (props) =>{
  const classes = useStyles();
  const { data } = props;
  const { addAlert } = props;
  const [participant, setParticipant] = useState([]);
  useEffect(() => {
    getInterviewee(data).then((response) => {
      if (!response.error) {
        // (response.data).forEach(user => setUsers(user));
        setParticipant(response.data);
      }
    });
  }, [data]);

  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const removeAlert = props.removeAlert;
  const handleAlertClose = useCallback((alertId) => {
      removeAlert(alertId);
  }, [removeAlert]);


  const onSubmitHandler = useCallback((event) => {
      event.preventDefault()
      let datas={
        "interviewID":data,
        "feedback":value
      }
      addFeedback(data)
        .then((response) => {
            if (!response.error) {
                addAlert({
                    message: "Feedback Send Successfully!",
                });
            }
        })

    
  }, [value,  addAlert,data]);

  return (
      <div className={classes.root}>
        <Alert handleAlertClose={handleAlertClose} alerts={props.alerts} /> 
        <Card profile  className={classes.card}>
              {/* <CardAvatar profile>
                  <Image cloudName="isuruieee" publicId={participant.intervieweeImg} width="100%" height="100%" />
                <img src={cloudinaryCore.url(participant.intervieweeImg)} />
                  <Image href={participant.intervieweeImg} alt="..." width="50px" height="50px"/>
              </CardAvatar> */}
              <CardMedia
                className={classes.media}
                title="Paella dish"
              >
                <Image cloudName="isuruieee" publicId={participant.intervieweeImg} width="20%" height="20%" />
                </CardMedia>
              <CardBody profile>
                <h4 className={classes.cardName}>{participant.name}</h4>
                <h4 className={classes.cardemail}>Email : {participant.email}</h4>
                <h4 className={classes.cardnumber}>Contact Number : {participant.contactNo}</h4>
                <form noValidate autoComplete="off" className={classes.form} onSubmit={onSubmitHandler}>
                  <TextField
                    id="outlined-multiline-static"
                    label="Feedback"
                    multiline
                    variant="outlined"
                    fullWidth
                    value={value}
                    onChange={handleChange}
                  />
                  <Button color="info" round type="submit">
                    Add Feedback
                  </Button>
                </form>
              </CardBody>
            </Card>
      </div>
  );
}

const mapStateToProps = (state) => {
  return {
      error: state.auth.error,
      isAuthenticated: state.auth.token != null,
      alerts: state.alert.alerts,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addAlert: (alert) => dispatch(addAlert(alert)),
    removeAlert: (alertId) => dispatch(removeAlert(alertId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);