import React, {useEffect,useState} from "react";

import {
  getInterviewee,
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
}));

const UserProfile = (props) =>{
  const classes = useStyles();
  const { data } = props;

  const [participant, setParticipant] = useState([]);
  useEffect(() => {
    getInterviewee(data).then((response) => {
      if (!response.error) {
        // (response.data).forEach(user => setUsers(user));
        console.log(response);
        setParticipant(response.data);
      }
    });
  }, [data]);

  console.log(participant)

  return (
      <div className={classes.root}>
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
                <TextField
                  id="outlined-multiline-static"
                  label="Feedback"
                  multiline
                  variant="outlined"
                  fullWidth
                />
                <Button color="rgb(140, 217, 223)" round>
                  Add Feedback
                </Button>
              </CardBody>
            </Card>
      </div>
  );
}

export default UserProfile;