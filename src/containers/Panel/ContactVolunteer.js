import React, {useEffect,useState} from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";

import {
  ContactVolunteer,
} from "../../api/PanelAPI";
import * as actions from "../../store/actions/index";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "../../components/UI/Grid/GridItem";
import GridContainer from "../../components/UI/Grid/GridContainer";
import CustomInput from "../../components/UI/CustomInput/CustomInput";
import Button from "../../components/UI/CustomButtons/Button";
import Card from "../../components/UI/Card/Card";
import CardHeader from "../../components/UI/Card/CardHeader";
import CardAvatar from "../../components/UI/Card/CardAvatar";
import CardBody from "../../components/UI/Card/CardBody";
import CardFooter from "../../components/UI/Card/CardFooter";
import Navbar from "../../components/UI/Navbar/Navbar";


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

  console.log(props.userId)

  const [participants, setParticipants] = useState([]);
  useEffect(() => {
    ContactVolunteer(11).then((response) => {
      if (!response.error) {
        // (response.data).forEach(user => setUsers(user));
        console.log(response);
        setParticipants(response.data);
      }
    });
  }, [props]);

  console.log(participants)

  console.log(participants)

  return (
    <div  className={classes.root}>
          <Navbar companyName="ABC Company" link="uom.lk"/>
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
                  Don{"'"}t be scared of the truth because we need to restart the
                  human foundation in truth And I love you like Kanye loves Kanye
                  I love Rick Owens’ bed design but the back is...
                </p>
                <Button color="primary" round>
                  Ask for Vounteer
                </Button>
              </CardBody>
            </Card>
          </div>
    </div>
  );
}

const mapStateToProps = (state) => {
    return {
        error: state.auth.error,
        userId: state.auth.userId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addAlert: (alert) => dispatch(actions.addAlert(alert)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);