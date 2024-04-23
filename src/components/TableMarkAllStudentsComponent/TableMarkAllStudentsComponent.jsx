import React from "react";
import PropTypes from "prop-types";
import "./style.scss";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
const TableMarkAllStudentsComponent = ({ data, onViewDetails, className }) => {
  const headers = [
    "STT.",
    "Tên học sinh",
    "Mã học sinh",
    "Điểm trung bình các môn",
    "Toán",
    "Vật lí",
    "Hóa học",
    "Sinh học",
    "Tin học",
    "Ngữ văn",
    "Lịch sử",
    "Địa lí",
    "Ngoại ngữ",
    "GDCD",
    "Công nghệ",
    "GDQP",
    "Thể dục",
    "Học lực",
    "TBM",
    "Hạnh kiểm",
    "Xếp hạng",
    "Chi tiet",
  ];
  return (
    <div className={className}>
      <table>
        <thead>
          <tr>
            <th className="w-10" rowSpan={2}>
              {headers[0]}
            </th>
            <th rowSpan={2}>{headers[1]}</th>
            <th rowSpan={2}>{headers[2]}</th>
            <th rowSpan={1} colSpan={13}>
              {headers[3]}
            </th>
            <th rowSpan={2}>{headers[17]}</th>
            <th rowSpan={2}>{headers[18]}</th>
            <th rowSpan={2}>{headers[19]}</th>
            <th rowSpan={2}>{headers[20]}</th>
            <th rowSpan={2}>{headers[21]}</th>
          </tr>
          <tr>
            <th>{headers[4]}</th>
            <th>{headers[5]}</th>
            <th>{headers[6]}</th>
            <th>{headers[7]}</th>
            <th>{headers[8]}</th>
            <th>{headers[9]}</th>
            <th>{headers[10]}</th>
            <th>{headers[11]}</th>
            <th>{headers[12]}</th>
            <th>{headers[13]}</th>
            <th>{headers[14]}</th>
            <th>{headers[15]}</th>
            <th>{headers[16]}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.fullName}</td>
              <td>{student.id}</td>
              {student.scores.map((score, index) => (
                <td key={score.key}>{score.value}</td>
              ))}
              <td>{student.study}</td>
              <td>{student.average}</td>
              <td>{student.conduct}</td>
              <td>{student.rank}</td>
              <td>
                <button className="primary-color text-xl" onClick={() => onViewDetails(student)}>
                  <EditCalendarIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TableMarkAllStudentsComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default TableMarkAllStudentsComponent;
