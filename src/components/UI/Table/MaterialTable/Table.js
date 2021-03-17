import React from 'react';
import MaterialTable from 'material-table';
import tableIcons from '../../../../helpers/tableIcons'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '80%'
  }
}));

const Table = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.paper}>
      <MaterialTable
      title={props.title}
      columns={props.columns}
      data={props.data}
      icons={tableIcons}
      onRowClick={props.onRowClick}
      detailPanel={props.detailPanel}
      options={props.tableOptions}
      editable={props.editable}
      actions={props.actions} />
    </div>
  );
}

export default Table;