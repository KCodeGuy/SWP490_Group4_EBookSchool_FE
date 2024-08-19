import React, { useState } from "react";
import PropTypes from "prop-types";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import Checkbox from "@mui/material/Checkbox";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import ButtonComponent from "components/ButtonComponent/ButtonComponent";
import { getTodayDate } from "../../utils/CommonFunctions";

function TableRegisterBookComponent({
  header,
  data,
  onEdit,
  onDelete,
  onDetails,
  className,
  itemsPerPage,
  isPaginated,
  isOrdered,
  showCheckboxes,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const isShowActions = onDelete != undefined || onEdit != undefined || onDetails != undefined;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  let rowNumber = 1;

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

  const renderRating = (rating) => {
    const defaultStyles = "mx-auto text-center text-white w-12 h-8 leading-8 rounded";
    switch (rating) {
      case "A": {
        return <div className={`${defaultStyles} bg-success-color`}>{rating}</div>;
      }
      case "B": {
        return <div className={`${defaultStyles} bg-primary-color`}>{rating}</div>;
      }
      case "C": {
        return <div className={`${defaultStyles} bg-warning-color`}>{rating}</div>;
      }
      case "D": {
        return <div className={`${defaultStyles} bg-error-color`}>{rating}</div>;
      }
    }
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

  const { formattedDate } = getTodayDate();

  return (
    <div className={`max-[1023px]:overflow-scroll lg:overflow-auto ${className}`}>
      <table>
        <thead>
          <tr>
            {isOrdered && <th className="w-10">STT.</th>}
            {header.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
            {isShowActions && <th className="w-24">Chi tiết</th>}
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
            currentData.map((date, index) => {
              return (
                <tr key={index}>
                  {(index === 0 || date.date !== currentData[index - 1].date) && (
                    <>
                      <td rowSpan={renderRowSpan(index, date.date)}>{rowNumber++}</td>
                      {date.date == formattedDate ? (
                        <td
                          className="font-bold italic success-color px-2"
                          rowSpan={renderRowSpan(index, date.date)}
                        >
                          {date.weekDate} <br />
                          {date.date}
                        </td>
                      ) : (
                        <td rowSpan={renderRowSpan(index, date.date)} className="px-2">
                          {date.weekDate} <br />
                          {date.date}
                        </td>
                      )}
                    </>
                  )}
                  <td className="px-2">
                    {date.slot ? (
                      <>
                        <p className="font-bold">Tiết {date.slot}</p>
                        <p>
                          <AccessAlarmsIcon /> {renderSlotTime(date.slot)}
                        </p>
                      </>
                    ) : (
                      "_"
                    )}
                  </td>
                  <td className="px-2">{date.subject || "_"}</td>
                  <td className="px-2">{date.teacher || "_"}</td>
                  <td className="px-2">{date.slotByLessonPlan || "_"}</td>
                  <td className="px-2">{`${
                    date.numberOfAbsent > 0 ? date.numberOfAbsent : "_"
                  }`}</td>
                  <td className="px-2 hidden">{`${
                    date.numberOfAbsentConfirmed > 0 ? date.numberOfAbsentConfirmed : "_"
                  }`}</td>
                  <td className="text-center">
                    <span className="px-2 max-line-2 max-w-52 mx-auto">{date.title || "_"}</span>
                  </td>
                  <td>
                    <div className="px-2 max-line-4 max-w-56 mx-auto">{date.note || "_"}</div>
                  </td>
                  <td className="px-2">{renderRating(date.rating) || "_"}</td>
                  {isShowActions && (
                    <td className="max-w-28 text-center">
                      {onDetails && date.countSlots > 0 ? (
                        <button
                          title="Detail button "
                          className="text-xl primary-color"
                          onClick={() => onDetails(date)}
                        >
                          <EditCalendarIcon />
                        </button>
                      ) : (
                        "_"
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div
        className={`pagination border py-2 flex justify-between items-center px-3 text-base ${
          isPaginated ? "" : "hidden"
        }`}
      >
        <div className="text-sm">
          <span className="mr-4">Tổng: {data.length}</span>
          {showCheckboxes && <ButtonComponent onClick={handleSave}>Save</ButtonComponent>}
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

TableRegisterBookComponent.propTypes = {
  header: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.array,
  onDetails: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  className: PropTypes.string,
  itemsPerPage: PropTypes.number,
  isOrdered: PropTypes.bool,
  isPaginated: PropTypes.bool,
  showCheckboxes: PropTypes.bool,
};

TableRegisterBookComponent.defaultProps = {
  itemsPerPage: 70, // Default items per page
  isOrdered: true, // Default to not showing row numbers
  isPaginated: true,
  showCheckboxes: false, // Default to not showing checkboxes
};

export default TableRegisterBookComponent;
