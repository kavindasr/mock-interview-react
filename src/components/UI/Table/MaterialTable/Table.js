import React from 'react';
import MaterialTable from 'material-table';
import tableIcons from '../../../../helpers/tableIcons'

const Table = (props) => {
  return (
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
  );
}

export default Table;