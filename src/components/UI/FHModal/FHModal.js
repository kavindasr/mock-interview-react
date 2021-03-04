import React from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  paper: {
    position: "absolute",
    backgroundColor: "#ffff",
    // boxShadow: 5,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: props => props.customHeight ? props.customHeight : "50%",
    // overflow: "scroll"
  },
});

const FHModal = ((props) => {
    const { customHeight, open, handleClose, body} = props;
    const classes = useStyles({ customHeight });

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <div className={classes.paper}>
            {body}
            </div>
        </Modal>
    );
});

export default FHModal;