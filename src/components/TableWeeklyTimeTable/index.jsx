import React, { useState } from "react";
import PropTypes from "prop-types";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { Link } from "react-router-dom";

const TableWeeklyTimeTableComponent = ({ data, onDetails, className }) => {
  const dates = data.map((item) => item.date);
  const defaultSlots = Array.from({ length: 10 }, (_, index) => index + 1);
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
    <table className={className}>
      <thead>
        <tr>
          <th className="w-20">Buổi</th>
          <th className="w-20">Tiết</th>
          {dates.map((date) => (
            <th key={date}>
              {`${data.find((item) => item.date === date).weekDate}`}{" "}
              <p className="font-medium">{date}</p>
            </th>
          ))}
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
                <td key={`${date}-${slot}`} className="cell-hover">
                  {slotData ? (
                    <div className="mx-2 my-1 text-left">
                      <div
                        className="flex justify-between cursor-pointer hover:underline"
                        onClick={() => onDetails([slotData, date])}
                      >
                        <p className="font-bold">
                          {slotData.subject}{" "}
                          <span className="warning-color">({slotData.teacher})</span>
                        </p>
                      </div>
                      <p className="text-center text-white px-1 max-w-max h-6 leading-6 rounded bg-success-color">
                        <AccessAlarmsIcon className="mb-1 mr-1" />
                        {slotData.slotTime}
                      </p>
                      <div className="flex justify-between mt-1 items-center">
                        <p className="mt-1 font-medium">{slotData.classRoom}</p>
                        <Link to="/schoolBook">
                          <button className="text-center text-white px-2 max-w-max h-6 leading-6 rounded bg-warning-color">
                            SĐB
                          </button>
                        </Link>
                      </div>
                      <p>{renderSlotStatus(slotData.status)}</p>
                      <button className="text-center text-white px-2 w-full h-6 leading-6 rounded bg-primary-color">
                        Điểm danh
                      </button>
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
