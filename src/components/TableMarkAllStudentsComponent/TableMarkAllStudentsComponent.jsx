import React, { useState } from "react";
import PropTypes from "prop-types";
import "./style.scss";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
const TableMarkAllStudentsComponent = ({ data, onViewDetails, className, itemsPerPage }) => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className={`max-[1023px]:overflow-scroll lg:overflow-auto ${className}`}>
      <table className="rounded-md table-auto">
        <thead>
          <tr>
            <th className="" rowSpan={2}>
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
          {currentData.map((student, index) => (
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
      <div className="pagination border py-2 flex justify-between items-center px-3 text-base w-full">
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
};

TableMarkAllStudentsComponent.propTypes = {
  data: PropTypes.array.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  className: PropTypes.string,
  itemsPerPage: PropTypes.number,
};

TableMarkAllStudentsComponent.defaultProps = {
  itemsPerPage: 2, // Default items per page
  isOrdered: true, // Default to not showing row numbers
};

export default TableMarkAllStudentsComponent;
