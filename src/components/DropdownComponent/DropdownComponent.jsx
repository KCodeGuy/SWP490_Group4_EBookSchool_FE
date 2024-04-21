import React, { useState } from "react";
import PropTypes from "prop-types";
import "./style.scss";

const DropdownComponent = ({ options, onSelectChange }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const selectClasses = `select`;
  const optionClasses = `option`;
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelectChange(value);
  };

  return (
    <select className={selectClasses} value={selectedOption} onChange={handleChange}>
      {options.map((option, index) => (
        <option className={optionClasses} key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

DropdownComponent.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectChange: PropTypes.func.isRequired,
};

export default DropdownComponent;
