/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import PropTypes from "prop-types";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { Link, useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getTodayDate } from "../../utils/CommonFunctions";
import { PRINCIPAL_ROLE } from "services/APIConfig";
import { HEADTEACHER_ROLE } from "services/APIConfig";
import { SUBJECT_ROLE } from "services/APIConfig";
import { HOMEROOM_ROLE } from "services/APIConfig";
import { STUDENT_ROLE } from "services/APIConfig";

const TableWeeklyTimeTableComponent = ({
  data,
  onDetails,
  className,
  userRole,
  onEdit,
  onDelete,
}) => {
  const dates = data.map((item) => item.date);
  const defaultSlots = Array.from({ length: 10 }, (_, index) => index + 1);
  const { formattedDate } = getTodayDate();
  const navigate = useNavigate();

  const renderSlotStatus = (status) => {
    switch (status) {
      case "Vắng có phép": {
        return <span className="font-bold warning-color">({status})</span>;
      }
      case "Vắng không phép": {
        return <span className="font-bold error-color">({status})</span>;
      }
      case "Vắng": {
        return <span className="font-bold error-color">({status})</span>;
      }
      case "Chưa bắt đầu": {
        return <span className="font-bold text-color">({status})</span>;
      }
      case "Có mặt": {
        return <span className="font-bold success-color">({status})</span>;
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
                        <p className="text-center text-white px-1 h-6 max-w-max max-[993px]:hidden lg:block leading-6 rounded bg-success-color">
                          <AccessAlarmsIcon className="mb-1 mr-1" />
                          {slotData.slotTime}
                        </p>
                        <div className="flex justify-between mt-2 items-center">
                          {userRole.includes(SUBJECT_ROLE) || userRole.includes(STUDENT_ROLE)
                            ? renderSlotStatus(slotData.status)
                            : ""}
                          {userRole.includes(SUBJECT_ROLE) || userRole.includes(HOMEROOM_ROLE) ? (
                            <Link to={`/register-notebook`}>
                              <button className="text-center text-white px-2 max-w-max h-6 leading-6 rounded bg-warning-color">
                                SĐB
                              </button>
                            </Link>
                          ) : (
                            ""
                          )}
                          {userRole.includes(PRINCIPAL_ROLE) ||
                          userRole.includes(HEADTEACHER_ROLE) ? (
                            <button
                              className="text-center text-white px-3 max-w-max h-6 leading-6 rounded bg-error-color"
                              onClick={() => onDelete(slotData)}
                            >
                              Xóa
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                        {userRole.includes(STUDENT_ROLE) || userRole.includes(SUBJECT_ROLE) ? (
                          <p className="text-center text-white px-1 max-w-max h-6 leading-6 rounded bg-warning-color mt-2">
                            <LocationOnIcon className="mb-0.5" />
                            {slotData.classroom}
                          </p>
                        ) : (
                          ""
                        )}
                        {userRole.includes(SUBJECT_ROLE) ? (
                          <>
                            <button
                              className="text-center text-white px-2 w-full h-6 leading-6 rounded bg-primary-color mt-2"
                              onClick={() => {
                                navigate(`/takeAttendance/${slotData.id}`);
                              }}
                            >
                              Điểm danh
                            </button>
                          </>
                        ) : (
                          ""
                        )}
                        {userRole.includes(PRINCIPAL_ROLE) ||
                        userRole.includes(HEADTEACHER_ROLE) ? (
                          <button
                            className="text-center text-white px-2 w-full h-6 leading-6 rounded bg-primary-color mt-3"
                            onClick={() => onEdit(slotData, date)}
                          >
                            Cập nhật
                          </button>
                        ) : (
                          ""
                        )}
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
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
  userRole: PropTypes.string,
};

TableWeeklyTimeTableComponent.defaultProps = {};

export default TableWeeklyTimeTableComponent;
