import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../assets/css/base.scss";
import "./style.scss";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import Checkbox from "@mui/material/Checkbox";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

function TableComponent({
  header,
  data,
  onEdit,
  onDelete,
  onDetails,
  onGet,
  onCheckboxChange,
  onSave,
  className,
  itemsPerPage,
  isOrdered,
  isShowImage,
  showCheckboxes,
  isCheckedAll,
  isImage,
  sortOption,
  isLimitLine,
  hiddenColumns,
  saveName = "Lưu",
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    if (isCheckedAll) {
      setCheckedItems(data);
    } else {
      setCheckedItems([]);
    }
  }, [isCheckedAll, data]);

  // console.log("data", data);
  // console.log("sortOption trong table", sortOption);

  const isShowActions =
    onDelete !== undefined ||
    onEdit !== undefined ||
    onDetails !== undefined ||
    onGet !== undefined;

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

  const isColumnHidden = (index) => {
    return hiddenColumns && hiddenColumns.includes(index);
  };

  return (
    <div className={`max-[1023px]:overflow-scroll lg:overflow-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr>
            {isOrdered && <th className="w-8">STT.</th>}
            {header.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
            {showCheckboxes && <th className="w-28">Có mặt</th>}
            {isShowActions && <th className="w-28">Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td
                className="font-medium"
                colSpan={
                  header.length +
                  (isOrdered ? 1 : 0) +
                  (showCheckboxes ? 1 : 0) +
                  (isShowActions ? 1 : 0)
                }
              >
                Chưa có dữ liệu...!
              </td>
            </tr>
          ) : (
            currentData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {isOrdered && <td>{startIndex + rowIndex + 1}</td>}
                {isShowImage && (
                  <td className="text-center">
                    <div className="text-4xl primary-color">
                      <AccountCircleIcon />
                    </div>
                  </td>
                )}
                {row.map(
                  (cell, cellIndex) =>
                    !isColumnHidden(cellIndex) && (
                      <td key={cellIndex} className="px-2">
                        {isImage === cellIndex ? (
                          <img
                            src={cell}
                            alt="Thumbnail"
                            className="w-28 h-28 rounded-sm object-cover object-center mx-auto my-2"
                          />
                        ) : (
                          <div
                            className={`max-line-4 max-w-56 mx-auto ${
                              cell === "Vắng" ? "error-color font-bold" : ""
                            } ${cell === "Có mặt" ? "success-color font-bold" : ""}`}
                          >
                            {cell}
                          </div>
                        )}
                      </td>
                    )
                )}
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
                    {onGet && (
                      <ButtonComponent
                        action="button"
                        type="success"
                        size="sm"
                        onClick={() => onGet(row)}
                      >
                        <AddCircleOutlineIcon className="text-3xl mr-1" />
                        Thêm
                      </ButtonComponent>
                    )}
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
            ))
          )}
        </tbody>
      </table>
      <div className="pagination border py-2 flex justify-between items-center px-3 w-full">
        <div>
          <span className="mr-4 text-sm">
            <span className="font-bold">Tổng:</span> {data.length}
          </span>
          {showCheckboxes && (
            <ButtonComponent onClick={handleSave}>
              {" "}
              <BorderColorIcon className="mr-2" />
              {saveName}
            </ButtonComponent>
          )}
        </div>
        <div className="text-sm">
          <span className="font-bold">Số lượng: {itemsPerPage}</span>
          <span className="ml-4">
            {currentPage} / {totalPages}
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
  data: PropTypes.array,
  onDetails: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onGet: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  onSave: PropTypes.func,
  className: PropTypes.string,
  itemsPerPage: PropTypes.number,
  isOrdered: PropTypes.bool,
  isShowImage: PropTypes.bool,
  showCheckboxes: PropTypes.bool,
  isCheckedAll: PropTypes.bool,
  isImage: PropTypes.number,
  hiddenColumns: PropTypes.array,
  isLimitLine: PropTypes.object,
  sortOption: PropTypes.object,
  saveName: PropTypes.string,
};

TableComponent.defaultProps = {
  data: [],
  itemsPerPage: 10, // Default items per page
  isOrdered: true, // Default to not showing row numbers
  showCheckboxes: false, // Default to not showing checkboxes
  isCheckedAll: false, // Default to not all rows checked
};

export default TableComponent;
