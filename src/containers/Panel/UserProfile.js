import React, {useEffect,useState} from "react";
import { useParams } from "react-router-dom";

import {
  getInterviewee,
} from "../../api/InterviewsAPI";
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
import CardMedia from '@material-ui/core/CardMedia';
// import {Cloudinary} from 'cloudinary-core';
// const cloudinaryCore = new cloudinary.Cloudinary({cloud_name: 'isuruieee'});
import {Image} from 'cloudinary-react';


// import avatar from "assets/img/faces/marc.jpg";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(2),
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
  }, []);

  console.log(participant)

  return (
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
                <Image cloudName="isuruieee" publicId={participant.intervieweeImg} width="50%" height="50%" />
                </CardMedia>
              <CardBody profile>
                <h4 className={classes.cardTitle}>{participant.name}</h4>
                <h4 className={classes.cardTitle}>{participant.email}</h4>
                <h4 className={classes.cardTitle}>{participant.contactNo}</h4>
                <p className={classes.description}>
                  Don{"'"}t be scared of the truth because we need to restart the
                  human foundation in truth And I love you like Kanye loves Kanye
                  I love Rick Owens’ bed design but the back is...
                </p>
                <Button color="primary" round>
                  Add Feedback
                </Button>
              </CardBody>
            </Card>
  );
}

export default UserProfile;