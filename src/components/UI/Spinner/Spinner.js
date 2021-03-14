import React from 'react';
import { CircularProgress } from '@material-ui/core';
import Navbar from "../../../components/UI/Navbar/Navbar";

const Spinner = (props) => {
    return (
        <React.Fragment>
            <Navbar/>
            <CircularProgress />
        </React.Fragment>
    );
}

export default Spinner;