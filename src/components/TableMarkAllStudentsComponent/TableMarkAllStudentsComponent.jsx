import React, { useState } from "react";
import PropTypes from "prop-types";
import "./style.scss";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { renderAverageMarkStyles } from "utils/RenderStyle";
import { renderRanking } from "utils/RenderStyle";
import { renderRankingStyles } from "utils/RenderStyle";

const TableMarkAllStudentsComponent = ({
  data,
  onViewDetails,
  className,
  itemsPerPage,
  semester,
}) => {
  const staticHeaders = [
    "STT.",
    "Tên học sinh",
    "Mã học sinh",
    "TBM",
    "Học lực",
    "Hạnh kiểm",
    "Xếp hạng",
    "Chi tiết",
  ];
  const dynamicHeaders = data[0].subjectAverages.map((subject) => subject.subject);

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
            {staticHeaders.slice(0, 3).map((header, index) => (
              <th key={index} rowSpan={2}>
                {header}
              </th>
            ))}
            <th rowSpan={1} colSpan={dynamicHeaders.length}>
              Điểm trung bình các môn
            </th>
            {staticHeaders.slice(3).map((header, index) => (
              <th key={index} rowSpan={2}>
                {header}
              </th>
            ))}
          </tr>
          <tr>
            {dynamicHeaders.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.fullName}</td>
              <td>{student.id}</td>
              {student.subjectAverages.length > 0
                ? student.subjectAverages.map((subject, index) =>
                    semester == "Học kỳ I" ? (
                      <td key={index}>
                        {subject.averageSemester1 != -1 && subject.averageSemester1 != 0 ? (
                          <span>{subject.averageSemester1}</span>
                        ) : (
                          "_"
                        )}
                      </td>
                    ) : semester == "Học kỳ II" ? (
                      <td key={index}>
                        {subject.averageSemester2 != -1 && subject.averageSemester2 != 0 ? (
                          <span>{subject.averageSemester2}</span>
                        ) : (
                          "_"
                        )}
                      </td>
                    ) : semester == "Cả năm" ? (
                      <td key={index}>
                        {subject.averageWholeYear != -1 && subject.averageWholeYear != 0 ? (
                          <span>{subject.averageWholeYear}</span>
                        ) : (
                          "_"
                        )}
                      </td>
                    ) : (
                      <td key={index}>_</td>
                    )
                  )
                : "_"}
              <td>
                <span className={renderAverageMarkStyles(10)}>10</span>
              </td>
              <td>
                <span className={renderRankingStyles(10)}>Giỏi</span>
              </td>
              <td className="font-medium">
                {" "}
                <span className={renderRankingStyles(10)}>Tốt</span>
              </td>
              <td>1</td>
              <td>
                <button className="primary-color text-xl" onClick={() => onViewDetails(student)}>
                  <EditCalendarIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-container">
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
    </div>
  );
};

TableMarkAllStudentsComponent.propTypes = {
  data: PropTypes.array.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  className: PropTypes.string,
  itemsPerPage: PropTypes.number,
  semester: PropTypes.string,
};

TableMarkAllStudentsComponent.defaultProps = {
  itemsPerPage: 2, // Default items per page
};

export default TableMarkAllStudentsComponent;
