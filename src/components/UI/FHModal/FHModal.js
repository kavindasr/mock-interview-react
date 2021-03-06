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
    height: props => props.customHeight ? props.customHeight : "70%",
    width: props => props.customWidth ? props.customWidth : "70%",
    // overflow: "scroll"
  },
});

const FHModal = ((props) => {
    const {customWidth, customHeight, open, handleClose, body} = props;
    const classes = useStyles({ customHeight,customWidth });

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