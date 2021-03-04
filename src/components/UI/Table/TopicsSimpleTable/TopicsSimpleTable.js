import { makeStyles } from "@material-ui/styles";
import SimpleTable from "../SimpleTable/SimpleTable";

const useStyles = makeStyles(theme => ({
    tableWrapper: {
        margin: '20px',
    }
}));

const simpleTableColumns = [
    {
        field: 'id',
        name: 'Id'
    },
    {
        field: 'title',
        name: 'Title'
    },
    {
        field: 'price',
        name: 'Price'
    }
];

const detailPanelTableHeading = "Topics"

const TopicsSimpleTable = props => {
    const classes = useStyles();

    return <SimpleTable
        tableWrapperClass={classes.tableWrapper}
        tableTitle={detailPanelTableHeading}
        data={props.topics}
        columns={simpleTableColumns} />
}

export default TopicsSimpleTable;