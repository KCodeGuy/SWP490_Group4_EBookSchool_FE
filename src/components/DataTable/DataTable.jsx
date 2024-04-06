import * as React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

export default function DataTable(props) {
  const { rows, columns } = props;
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}

DataTable.defaultProps = {
  rows: [],
  columns: [],
};

// Typechecking props for the Footer
DataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
};
