import React, { useState } from "react";
import PropTypes from "prop-types";
import "./style.scss";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { renderAverageMarkStyles } from "utils/RenderStyle";
import { renderRanking } from "utils/RenderStyle";
import { renderRankingStyles } from "utils/RenderStyle";
import { renderRankingStylesByRaking } from "utils/RenderStyle";

const TableMarkAllStudentsComponent = ({
  data,
  onViewDetails,
  className,
  itemsPerPage,
  semester,
  isPaginate,
}) => {
  const staticHeaders = [
    "STT.",
    "Tên học sinh",
    "Mã học sinh",
    "TBM",
    "Học lực",
    "Hạng",
    "Chi tiết",
  ];

  const subjectOrder = [
    "Ngữ Văn",
    "Toán",
    "Ngoại ngữ",
    "Vật lí",
    "Hóa học",
    "Sinh học",
    "Lịch sử",
    "Địa lí",
    "GDCD",
    "Tin học",
    "Công nghệ",
    "GD QP-AN",
    "Thể dục",
  ];

  const sortSubjects = (subjects) => {
    return subjects.sort(
      (a, b) => subjectOrder.indexOf(a.subject) - subjectOrder.indexOf(b.subject)
    );
  };

  // Calculate averages and add them to each student object

  const roundToNearestTenth = (num) => {
    return Math.round(num * 10) / 10;
  };

  const calculateAverages = (data, semester) => {
    let total = 0;
    let count = 0;

    data.forEach((subject) => {
      let value;
      switch (semester) {
        case "averageSemester1":
          value = subject.averageSemester1;
          break;
        case "averageSemester2":
          value = subject.averageSemester2;
          break;
        case "averageWholeYear":
          value = subject.averageWholeYear;
          break;
        default:
          return;
      }

      if (!isNaN(value) && value !== "Đ" && value !== "CĐ") {
        total += parseFloat(value);
        count += 1;
      }
    });
    const average = count === 0 ? 0 : total / count;
    return roundToNearestTenth(average).toFixed(1);
  };

  const calculateRankings = (students, key) => {
    const averages = students.map((student) => student[key]);
    const sortedAverages = [...averages].sort((a, b) => b - a);
    return students.map((student) => ({
      ...student,
      ranking: sortedAverages.indexOf(student[key]) + 1,
    }));
  };

  const sortedData = data.map((student) => {
    const sortedSubjects = sortSubjects(student.subjectAverages);
    // const totalAverage1 = calculateAverages(sortedSubjects, "averageSemester1");
    // const totalAverage2 = calculateAverages(sortedSubjects, "averageSemester2");
    // const totalAverage = calculateAverages(sortedSubjects, "averageWholeYear");

    return {
      ...student,
      subjectAverages: sortedSubjects,
    };
  });

  const rankedData = calculateRankings(sortedData, "totalAverage");

  const dynamicHeaders = sortedData[0].subjectAverages.map((subject) => subject.subject);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(rankedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = rankedData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`${className}`}>
      <div className="table-container">
        <table className="w-full">
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
                <td className="px-1">{student.fullName}</td>
                <td className="px-1">{student.id}</td>
                {student.subjectAverages.length > 0 ? (
                  student.subjectAverages.map((subject, index) =>
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
                ) : (
                  <td key={index}>_</td>
                )}
                <td>
                  {semester == "Học kỳ I" ? (
                    <span className={renderAverageMarkStyles(student.totalAverageSemester1)}>
                      {student.totalAverageSemester1}
                    </span>
                  ) : semester == "Học kỳ II" ? (
                    <span className={renderAverageMarkStyles(student.totalAverageSemester2)}>
                      {student.totalAverageSemester2}
                    </span>
                  ) : semester == "Cả năm" ? (
                    <span className={renderAverageMarkStyles(student.totalAverageWholeYear)}>
                      {student.totalAverageWholeYear}
                    </span>
                  ) : (
                    "_"
                  )}
                </td>
                <td>
                  {semester == "Học kỳ I" ? (
                    <span className={renderRankingStylesByRaking(student.performanceSemester1)}>
                      {student.performanceSemester1}
                    </span>
                  ) : semester == "Học kỳ II" ? (
                    <span className={renderRankingStylesByRaking(student.performanceSemester2)}>
                      {student.performanceSemester2}
                    </span>
                  ) : semester == "Cả năm" ? (
                    <span className={renderRankingStylesByRaking(student.performanceWholeYear)}>
                      {student.performanceWholeYear}
                    </span>
                  ) : (
                    "_"
                  )}
                </td>
                <td className="w-12">
                  {" "}
                  {semester == "Học kỳ I"
                    ? student.rankSemester1
                    : semester == "Học kỳ II"
                    ? student.rankSemester2
                    : semester == "Cả năm"
                    ? student.rankWholeYear
                    : "_"}
                </td>
                <td>
                  <button className="primary-color text-xl" onClick={() => onViewDetails(student)}>
                    <EditCalendarIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className={`pagination-table border py-2 flex justify-between items-center px-3 ${
            !isPaginate ? "hidden" : ""
          }`}
        >
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
  isPaginate: PropTypes.bool,
};

TableMarkAllStudentsComponent.defaultProps = {
  itemsPerPage: 200, // Default items per page
  isPaginate: true,
};

export default TableMarkAllStudentsComponent;
