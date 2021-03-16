import React, {useEffect,useState, useCallback} from "react";
import { connect } from "react-redux";

import {
  ContactVolunteer,
} from "../../api/PanelAPI";
import {needHelp} from "../../api/OtherApi"
import * as actions from "../../store/actions/index";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Button from "../../components/UI/CustomButtons/Button";
import Card from "../../components/UI/Card/Card";
import CardBody from "../../components/UI/Card/CardBody";
import Navbar from "../../components/UI/Navbar/Navbar";
import { removeAlert } from "../../store/actions/index";
import Alert from '../../components/UI/FHAlert/FHAlert';
import Spinner from "../../components/UI/Spinner/Spinner";

// import avatar from "assets/img/faces/marc.jpg";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(2),
    width: '60%',
  },
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
}));

const UserProfile = (props) => {
  const classes = useStyles();

  const { addAlert } = props;

  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      ContactVolunteer(props.userId).then((response) => {
        if (!response.error) {
          // (response.data).forEach(user => setUsers(user));
          setParticipants(response.data);
        }
      }).finally(() => setIsLoading(false));
    }
  }, [props,isLoading]);

  const removeAlert = props.removeAlert;
    const handleAlertClose = useCallback((alertId) => {
        removeAlert(alertId);
    }, [removeAlert]);

  const askforVolunteer = useCallback(
    () => {
      let data ={
        "needHelp" : true,
      }
      needHelp(props.userId,data)
        .then((response) => {
            if (!response.error) {
                addAlert({
                    message: "Request sent Successfully!",
                });
            }
      })
    },
    [addAlert,props.userId]
  );

  if (isLoading) {
    return <Spinner />
  } else {
    return (
      <div  className={classes.root}>
            <Navbar companyName="ABC Company" link="uom.lk"/>
            <Alert handleAlertClose={handleAlertClose} alerts={props.alerts} />
            <div className={classes.paper}>
              <Card profile  className={classes.card}>
                {/* <CardAvatar profile>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img href={#} alt="..." />
                  </a>
                </CardAvatar> */}
                <CardBody profile>
                  <h4 className={classes.cardTitle}>{participants.name}</h4>
                  <h4 className={classes.cardTitle}>{participants.email}</h4>
                  <h4 className={classes.cardTitle}>{participants.contactNo}</h4>
                  <p className={classes.description}>
                    If you need to contact volunteer click ask for volunteer button. 
                    Volunteer will enter to your zoom breakout room. If there's a emergency 
                    need try to contact him through the mobile number
                  </p>
                  <Button color="success" round onClick={() => askforVolunteer()}>
                    Ask for Volunteer
                  </Button>
                </CardBody>
              </Card>
            </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        error: state.auth.error,
        userId: state.auth.userId,
        alerts: state.alert.alerts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAlert: (alert) => dispatch(actions.addAlert(alert)),
        removeAlert: (alertId) => dispatch(removeAlert(alertId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);