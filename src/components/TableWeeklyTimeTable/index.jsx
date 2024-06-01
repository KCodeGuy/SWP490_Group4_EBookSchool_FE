import React, { useState } from "react";
import PropTypes from "prop-types";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { Link } from "react-router-dom";
import { getTodayDate } from "utils/CommonFunctions";

const TableWeeklyTimeTableComponent = ({ data, onDetails, className }) => {
  const dates = data.map((item) => item.date);
  const defaultSlots = Array.from({ length: 10 }, (_, index) => index + 1);
  const { formattedDate } = getTodayDate();

  const renderSlotStatus = (status) => {
    let formattedStatus = status.toLowerCase();
    switch (formattedStatus) {
      case "not-started": {
        return <span className={`error-color`}>({status})</span>;
      }
      case "on-going": {
        return <span className={`primary-color`}>({status})</span>;
      }
      case "completed": {
        return <span className={`success-color`}>({status})</span>;
      }
      default: {
        return <span className={`text-slate-400`}>({status})</span>;
      }
    }
  };
  return (
    <div className={`max-[1023px]:overflow-scroll lg:overflow-auto ${className}`}>
      <table>
        <thead>
          <tr>
            <th className="w-20">Buổi</th>
            <th className="w-20">Tiết</th>
            {dates.map((date) => {
              const isToday = date === formattedDate;
              return (
                <th
                  key={date}
                  className={isToday ? "font-bold italic bg-success-color" : "font-normal"}
                >
                  {`${data.find((item) => item.date === date).weekDate}`}{" "}
                  <p className={isToday ? "font-bold italic" : "font-normal"}>{date}</p>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {defaultSlots.map((slot, index) => (
            <tr key={slot} className="no-hover-table">
              {(index === 0 || index === 5) && (
                <>
                  <td rowSpan={5} className="font-bold">
                    {index === 0 ? "Sáng" : "Chiều"}
                  </td>
                </>
              )}
              <td>{slot}</td>
              {dates.map((date) => {
                const slotData = data
                  .find((item) => item.date === date)
                  ?.slots.find((s) => s.slot === slot);
                return (
                  <td key={`${date}-${slot}`} className="cell-hover min-w-28">
                    {slotData.classroom ? (
                      <div className="mx-2 my-1 text-left">
                        <div
                          className="cursor-pointer hover:underline"
                          onClick={() => onDetails([slotData, date])}
                        >
                          <p className="font-bold">{slotData.subject} </p>
                          <p className="warning-color">({slotData.teacher})</p>
                        </div>
                        <p className="text-center text-white px-1 max-w-max h-6 leading-6 rounded bg-success-color">
                          <AccessAlarmsIcon className="mb-1 mr-1" />
                          {slotData.slotTime}
                        </p>
                        <div className="flex justify-between mt-1 items-center">
                          {slotData.isAttendance ? (
                            <span className="font-bold success-color">(Có mặt)</span>
                          ) : (
                            <span className="font-bold error-color">(Vắng)</span>
                          )}
                          <Link to="/schoolBook">
                            <button className="text-center text-white px-2 max-w-max h-6 leading-6 rounded bg-warning-color">
                              SĐB
                            </button>
                          </Link>
                        </div>
                        <Link to="/takeAttendance">
                          <button className="text-center text-white px-2 w-full h-6 leading-6 rounded bg-primary-color mt-3">
                            Điểm danh
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <p>_</p>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TableWeeklyTimeTableComponent.propTypes = {
  data: PropTypes.any,
  className: PropTypes.string,
  onDetails: PropTypes.func,
};

TableWeeklyTimeTableComponent.defaultProps = {
  //   isOrdered: true, // Default to not showing row numbers
};

export default TableWeeklyTimeTableComponent;
