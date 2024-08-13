import React, { useState } from "react";
import PropTypes from "prop-types";
import SearchIcon from "@mui/icons-material/Search";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export default function SearchInputComponent({ onSearch, placeHolder, className }) {
  const [searchValue, setSearchValue] = useState("");

  const customClassName = `border pl-3 h-11 max-w-max rounded box-border flex justify-between items-center ${className} `;

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className={customClassName}>
      <input
        className="h-full outline-none text-base max-[639px]:w-28"
        placeholder={placeHolder}
        value={searchValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className="w-10 h-10 leading-10 bg-primary-color rounded text-white text-center cursor-pointer"
        onClick={handleSearch}
        type="button"
      >
        <SearchIcon className="text-3xl" />
      </button>
    </div>
  );
}

SearchInputComponent.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeHolder: PropTypes.string.isRequired,
  className: PropTypes.string,
};
