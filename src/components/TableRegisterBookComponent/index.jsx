import React, { useState } from "react";
import PropTypes from "prop-types";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import Checkbox from "@mui/material/Checkbox";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";

function TableRegisterBookComponent({
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

  const renderRowSpan = (index, date) => {
    let count = 1;
    for (let i = index + 1; i < data.length; i++) {
      if (data[i].date === date) {
        count++;
      } else {
        break;
      }
    }
    return count;
  };

  const renderSlotTime = (slot) => {
    let slotTime = "";
    switch (slot) {
      case 1: {
        slotTime = "7h10-7h55 AM";
        break;
      }
      case 2: {
        slotTime = "8h00-8h45 AM";
        break;
      }
      case 3: {
        slotTime = "9h05-9h50 AM";
        break;
      }
      case 4: {
        slotTime = "9h55-10h40 AM";
        break;
      }
      case 5: {
        slotTime = "10h50-11h35 AM";
        break;
      }
      case 6: {
        slotTime = "12h35-13h20 PM";
        break;
      }
      case 7: {
        slotTime = "13h25-14h10 PM";
        break;
      }
      case 8: {
        slotTime = "14h30-15h15 PM";
        break;
      }
      case 9: {
        slotTime = "15h20-16h05 PM";
        break;
      }
      case 10: {
        slotTime = "16h15-17h00 PM";
        break;
      }
    }
    return slotTime;
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
            currentData.map(
              (date, index) => (
                <tr key={index}>
                  {(index === 0 || date.date !== data[index - 1].date) && (
                    <>
                      <td rowSpan={renderRowSpan(index, date.date)}>{index + 1}</td>
                      <td rowSpan={renderRowSpan(index, date.date)}>
                        {date.weekDate} <br />
                        {date.date}
                      </td>
                    </>
                  )}

                  <td>
                    {date.slot} <br /> {renderSlotTime(date.slot)}
                  </td>
                  <td>{date.teacher}</td>
                  <td>{date.slotByLessonPlans}</td>
                  <td>{date.slotByLessonPlans}</td>
                  <td>{date.numberOfAbsent}</td>
                  <td>{date.title}</td>
                  <td>{date.note}</td>
                  <td>{date.rating}</td>
                  {isShowActions && (
                    <td className="max-w-28">
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
              )
              /* <tr key={rowIndex}>
                {(rowIndex === 0 || (rowIndex % 5 === 0 && isOrdered)) && (
                  <td rowSpan={5}>{rowIndex / 5 + 1}</td>
                )}
                {(rowIndex === 0 || rowIndex % 5 === 0) && <td rowSpan={5}>Thứ 2 - 20/1/2024</td>}
                {row.map((cell, cellIndex) =>
                  cell ? <td key={cellIndex}>{cell}</td> : <td key={cellIndex}>Trống</td>
                )}
                {isShowActions && (
                  <td className="max-w-28">
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
               */
            )
          )}
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

TableRegisterBookComponent.propTypes = {
  header: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.array,
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

TableRegisterBookComponent.defaultProps = {
  itemsPerPage: 10, // Default items per page
  isOrdered: true, // Default to not showing row numbers
  showCheckboxes: false, // Default to not showing checkboxes
};

export default TableRegisterBookComponent;
