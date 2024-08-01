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
import { renderAverageMarkStyles } from "utils/RenderStyle";
import { renderRankingStyles } from "utils/RenderStyle";
import { renderRanking } from "../../utils/RenderStyle";

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

  const extractHeaderTable = (scores, semester) => {
    const keyOrder = ["Miệng", "15p", "1 Tiết", "Cuối kỳ"];
    const filteredScores = scores.filter((score) => score.semester === semester);
    const uniqueScores = [];

    keyOrder.forEach((key) => {
      const seenIndexCols = new Set();
      filteredScores.forEach((score) => {
        if (score.key === key && !seenIndexCols.has(score.indexCol)) {
          uniqueScores.push(score);
          seenIndexCols.add(score.indexCol);
        }
      });
    });

    const keyCountMap = {};
    uniqueScores.forEach((score) => {
      if (!keyCountMap[score.key]) {
        keyCountMap[score.key] = 0;
      }
      keyCountMap[score.key]++;
    });

    return keyOrder.map((key) => ({
      key,
      count: keyCountMap[key] || 0,
    }));
  };

  let headerTable = [];
  if (currentData.length > 0 && semester) {
    headerTable = extractHeaderTable(currentData[0]?.scores, semester);
  }

  const sortScores = (scores) => {
    const keyOrder = ["Miệng", "15p", "1 Tiết", "Cuối kỳ"];
    const semesterOrder = ["Học kỳ I", "Học kỳ II"];

    let sortedScores = scores.sort((a, b) => {
      if (semesterOrder.indexOf(a.semester) !== semesterOrder.indexOf(b.semester)) {
        return semesterOrder.indexOf(a.semester) - semesterOrder.indexOf(b.semester);
      }
      if (keyOrder.indexOf(a.key) !== keyOrder.indexOf(b.key)) {
        return keyOrder.indexOf(a.key) - keyOrder.indexOf(b.key);
      }
      return a.indexCol - b.indexCol;
    });

    const seenIndices = new Set();
    return sortedScores.filter((score) => {
      const uniqueKey = `${score.semester}-${score.key}-${score.indexCol}`;
      if (seenIndices.has(uniqueKey)) {
        return false;
      }
      seenIndices.add(uniqueKey);
      return true;
    });
  };

  return (
    <div className={`max-[1023px]:overflow-scroll lg:overflow-auto ${className}`}>
      <table>
        <thead>
          <tr>
            {isOrdered && <th className="w-10">STT.</th>}
            <th className="w-32">Tên học sinh</th>
            <th className="w-28">Mã học sinh</th>
            {semester != "Cả năm" ? (
              headerTable?.map((column, index) => (
                <th colSpan={column.count} key={index}>
                  {column.key}
                </th>
              ))
            ) : (
              <>
                <th className="w-32">Học kỳ I</th>
                <th className="w-28">Học kỳ II</th>
              </>
            )}
            <th className="w-20">{semester == "Cả năm" ? "Cả năm" : "Trung bình môn"}</th>
            <th className="w-20">Xếp loại</th>
            {isShowActions && <th className="w-28">Chi tiết</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {isOrdered && <td>{startIndex + rowIndex + 1}</td>}
              <td className="w-fit px-1">{row.fullName}</td>
              <td>{row.id}</td>
              {row.scores.length > 0
                ? sortScores(row.scores).map((item, index) =>
                    item.semester === semester ? (
                      <td key={index} className="min-w-9">
                        {isHideMark || item.value == -1 ? "_" : item.value}
                      </td>
                    ) : (
                      ""
                    )
                  )
                : semester !== "Cả năm"
                ? headerTable?.map((column, index) => (
                    <td colSpan={column.count} key={index}>
                      _
                    </td>
                  ))
                : ""}
              {semester == "Cả năm" ? (
                <>
                  <td>
                    {row.averageSemester1 != -1 && row.averageSemester1 != 0
                      ? row.averageSemester1
                      : "_"}
                  </td>
                  <td>
                    {" "}
                    {row.averageSemester2 != -1 && row.averageSemester2 != 0
                      ? row.averageSemester2
                      : "_"}
                  </td>
                </>
              ) : (
                ""
              )}

              <td>
                {semester == "Học kỳ I" ? (
                  row.averageSemester1 != -1 && row.averageSemester1 != 0 ? (
                    <span className={renderAverageMarkStyles(row.averageSemester1)}>
                      {row.averageSemester1}
                    </span>
                  ) : (
                    "_"
                  )
                ) : semester == "Học kỳ II" ? (
                  row.averageSemester2 != -1 && row.averageSemester2 != 0 ? (
                    <span className={renderAverageMarkStyles(row.averageSemester2)}>
                      {row.averageSemester2}
                    </span>
                  ) : (
                    "_"
                  )
                ) : semester == "Cả năm" ? (
                  row.averageYear != -1 && row.averageYear != 0 ? (
                    <span className={renderAverageMarkStyles(row.averageYear)}>
                      {row.averageYear}
                    </span>
                  ) : (
                    "_"
                  )
                ) : (
                  "_"
                )}
              </td>
              <td>
                {semester == "Học kỳ I" ? (
                  row.averageSemester1 != -1 && row.averageSemester1 != 0 ? (
                    <span className={renderRankingStyles(row.averageSemester1)}>
                      {renderRanking(row.averageSemester1)}
                    </span>
                  ) : (
                    "_"
                  )
                ) : semester == "Học kỳ II" ? (
                  row.averageSemester2 != -1 && row.averageSemester2 != 0 ? (
                    <span className={renderRankingStyles(row.averageSemester2)}>
                      {renderRanking(row.averageSemester2)}
                    </span>
                  ) : (
                    "_"
                  )
                ) : semester == "Cả năm" ? (
                  row.averageYear != -1 && row.averageYear != 0 ? (
                    <span className={renderRankingStyles(row.averageYear)}>
                      {renderRanking(row.averageYear)}
                    </span>
                  ) : (
                    "_"
                  )
                ) : (
                  <span className="italic font-medium w-20">Chưa xếp loại</span>
                )}
              </td>
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
