import * as React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

export default function DataTable(props) {
  const { rows, columns } = props;

  // Custom class name for the header cell
  const headerClassName = "custom-header";

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        headerClassName={headerClassName} // Assigning custom class to header
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
      {/* CSS to style the custom header */}
      <style>
        {`
          .custom-header {
            background-color: #247cd4;
          }
        `}
      </style>
    </div>
  );
}

DataTable.defaultProps = {
  rows: [],
  columns: [],
};

// Typechecking props for the DataTable component
DataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
};
