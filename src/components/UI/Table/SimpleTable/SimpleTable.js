import React from 'react';

import Table from '@material-ui/core/Table';
import { TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from '@material-ui/core';

import { getNestedValueByPath } from '../../../../shared/utility';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    tableHeading: {
        marginLeft: '14px',
    },
}));

const SimpleTable = props => {
    const classes = useStyles();
    return (
        <div className={props.tableWrapperClass}>
            {props.data.length === 0 ?
                <h3>No Data</h3>
                :
                <TableContainer component={Paper}>
                    <h4 className={classes.tableHeading}>{props.tableTitle}</h4>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {props.columns && props.columns.map(column =>
                                    <TableCell key={column.name}>{column.name}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.data && props.data.map(row =>
                                <TableRow key={row.id}>
                                    {props.columns && props.columns.map(column =>
                                        <TableCell key={column.field}>{getNestedValueByPath(row, column.field)}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
        </div>
    )
};

export default SimpleTable;