import React, { useState } from "react";
import PropTypes from "prop-types";
import "../../assets/css/base.scss";
import "./style.scss";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import { countDuplicateItemsInArray } from "../../utils/CommonFunctions";

function TableMarkOfSubjectComponent({
  data,
  isHideMark,
  onEdit,
  onDelete,
  onDetails,
  onCheckboxChange,
  semester,
  onSave,
  className,
  itemsPerPage,
  isOrdered,
  showCheckboxes,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const isShowActions = onDelete != undefined || onEdit != undefined || onDetails != undefined;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  let headerTable = [];
  if (currentData.length > 0 && semester) {
    headerTable = countDuplicateItemsInArray(currentData[0]?.scores, semester);
  }

  const renderAverageMark = (averageMark) => {
    let defaultStyles = "mx-auto text-center text-white px-3 py-1 rounded";
    if (averageMark >= 8) {
      defaultStyles = `${defaultStyles} bg-success-color`;
    } else if (averageMark >= 6.5 && averageMark < 8) {
      defaultStyles = `${defaultStyles} bg-primary-color`;
    } else if (averageMark >= 5 && averageMark < 6.5) {
      defaultStyles = `${defaultStyles} bg-warning-color`;
    } else if (averageMark < 5) {
      defaultStyles = `${defaultStyles} bg-error-color`;
    }
    return defaultStyles;
  };

  const renderRanking = (averageMark) => {
    let defaultStyles;
    if (averageMark >= 8) {
      defaultStyles = "mx-auto text-center text-white px-3 py-1 rounded bg-success-color";
    } else if (averageMark >= 6.5 && averageMark < 8) {
      defaultStyles = "mx-auto text-center text-white px-3 py-1 rounded bg-primary-color";
    } else if (averageMark >= 5 && averageMark < 6.5) {
      defaultStyles = "mx-auto text-center text-white px-3 py-1 rounded bg-warning-color";
    } else if (averageMark < 5) {
      defaultStyles = "mx-auto text-center text-white px-3 py-1 rounded bg-error-color";
    }
    return defaultStyles;
  };

  return (
    <div className={`max-[1023px]:overflow-scroll lg:overflow-auto ${className}`}>
      <table>
        <thead>
          <tr>
            {isOrdered && <th className="w-10">STT.</th>}
            <th className="w-28">Tên học sinh</th>
            <th className="w-28">Mã học sinh</th>
            {headerTable?.map((column, index) => (
              <th colSpan={column.count} key={index}>
                {column.key}
              </th>
            ))}
            <th className="w-28">Trung bình môn</th>
            {/* <th className="w-28">Xếp loại</th> */}
            {isShowActions && <th className="w-28">Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {isOrdered && <td>{startIndex + rowIndex + 1}</td>}
              <td>{row.fullName}</td>
              <td>{row.id}</td>
              {row.scores.map((item, index) =>
                item.semester == semester ? (
                  <td key={index} className="min-w-9">
                    {isHideMark || item.value == -1 ? "_" : item.value}
                  </td>
                ) : (
                  ""
                )
              )}
              <td>
                <span className={renderAverageMark(row.average)}>{row.average}</span>
              </td>
              {/* <td>
                <span>{renderRanking(row.average)}</span>
              </td> */}
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
      <div className="pagination border py-2 flex justify-between items-center px-3 text-base">
        <div className="text-sm">
          <span className="mr-4">Tổng: {data.length}</span>
        </div>
        <div className="text-sm">
          <span>Số lượng: {itemsPerPage}</span>
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

TableMarkOfSubjectComponent.propTypes = {
  header: PropTypes.array,
  data: PropTypes.array,
  onDetails: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  semester: PropTypes.string,
  onCheckboxChange: PropTypes.func,
  onSave: PropTypes.func,
  className: PropTypes.string,
  itemsPerPage: PropTypes.number,
  isOrdered: PropTypes.bool,
  showCheckboxes: PropTypes.bool,
  isHideMark: PropTypes.bool,
};

TableMarkOfSubjectComponent.defaultProps = {
  itemsPerPage: 10, // Default items per page
  isOrdered: true, // Default to not showing row numbers
  showCheckboxes: false, // Default to not showing checkboxes
};

export default TableMarkOfSubjectComponent;
