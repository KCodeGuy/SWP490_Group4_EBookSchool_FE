import React from "react";
import PropTypes from "prop-types";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const PaginationComponent = ({ currentPage, totalPages, onPageChange, location }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const renderPagination = () => {
    const pagination = [];
    for (let i = 1; i <= totalPages; i++) {
      pagination.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className="animation-button"
          style={{
            background: currentPage === i ? "#247cd4" : "transparent",
            color: currentPage === i ? "#fff" : "#000",
            fontWeight: currentPage === i ? "bold" : "",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "40px",
            height: "40px",
            margin: "0 5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {i}
        </button>
      );
    }
    return pagination;
  };

  const getLocationStyle = () => {
    switch (location) {
      case "left":
        return "justify-start";
      case "right":
        return "justify-end";
      default:
        return "justify-center";
    }
  };

  const locationPagination = getLocationStyle();

  return (
    <div className={`w-full mt-8 flex ${locationPagination} jus`}>
      <button
        title="previous"
        className="text-2xl mr-1 border rounded h-10 w-10 animation-button"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <KeyboardArrowLeftIcon className="mb-1" />
      </button>
      {renderPagination()}
      <button
        title="next"
        className="text-2xl ml-1 border rounded h-10 w-10 animation-button"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <KeyboardArrowRightIcon />
      </button>
    </div>
  );
};

PaginationComponent.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  location: PropTypes.oneOf(["left", "right", "center"]),
};

PaginationComponent.defaultProps = {
  location: "center",
};

export default PaginationComponent;
