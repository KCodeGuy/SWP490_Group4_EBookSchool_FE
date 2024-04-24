import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../assets/css/base.scss";
import "./style.scss";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import Checkbox from "@mui/material/Checkbox";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";

function TableComponent({
  header,
  data,
  onEdit,
  onDelete,
  onDetails,
  onCheckboxChange,
  onSave,
  className,
  itemsPerPage,
  isOrdered,
  showCheckboxes,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);
  const isShowActions = onDelete != undefined || onEdit != undefined || onDetails != undefined;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (row) => {
    const isChecked = checkedItems.includes(row);
    let newCheckedItems = [...checkedItems];
    if (isChecked) {
      newCheckedItems = newCheckedItems.filter((item) => item !== row);
    } else {
      newCheckedItems.push(row);
    }
    setCheckedItems(newCheckedItems);
    if (onCheckboxChange) {
      onCheckboxChange(newCheckedItems);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(checkedItems);
    }
  };

  return (
    <div className={className}>
      <table>
        <thead>
          <tr>
            {isOrdered && <th className="w-10">STT.</th>}
            {header.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
            {showCheckboxes && <th className="w-28">Chọn</th>}
            {isShowActions && <th className="w-28">Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {isOrdered && <td>{startIndex + rowIndex + 1}</td>}
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
              {showCheckboxes && (
                <td className="max-w-28">
                  <Checkbox
                    checked={checkedItems.includes(row)}
                    onChange={() => handleCheckboxChange(row)}
                  />
                </td>
              )}
              {isShowActions && (
                <td className="max-w-28">
                  {onEdit && (
                    <button
                      title="Edit button"
                      className="text-xl primary-color"
                      onClick={() => onEdit(row)}
                    >
                      <ModeEditIcon />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      title="Delete button "
                      className="text-xl ml-3 error-color"
                      onClick={() => onDelete(row)}
                    >
                      <DeleteIcon />
                    </button>
                  )}
                  {onDetails && (
                    <button
                      title="Detail button "
                      className="text-xl ml-3 primary-color"
                      onClick={() => onDetails(row)}
                    >
                      <EditCalendarIcon />
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination border py-2 flex justify-between items-center px-3">
        <div>
          <span className="mr-4">Total items: {data.length}</span>
          {showCheckboxes && <ButtonComponent onClick={handleSave}>Save</ButtonComponent>}
        </div>
        <div>
          <span>Page items: {itemsPerPage}</span>
          <span className="ml-4">
            {currentPage} of {totalPages}
          </span>
          <button
            className="text-2xl ml-2 primary-color"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <KeyboardArrowLeftIcon />
          </button>
          <button
            className="text-2xl ml-2 primary-color"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <KeyboardArrowRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

TableComponent.propTypes = {
  header: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  onDetails: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  onSave: PropTypes.func,
  className: PropTypes.string,
  itemsPerPage: PropTypes.number,
  isOrdered: PropTypes.bool,
  showCheckboxes: PropTypes.bool,
};

TableComponent.defaultProps = {
  itemsPerPage: 10, // Default items per page
  isOrdered: true, // Default to not showing row numbers
  showCheckboxes: false, // Default to not showing checkboxes
};

export default TableComponent;