import React from "react";
import PropTypes from "prop-types";

export default function TextValueComponent({
  label,
  value,
  className,
  icon,
  variantValue,
  customValue,
  maxWidth,
}) {
  const customClassName = `{${
    maxWidth ? maxWidth : "w-full"
  }  mb-2 flex items-center ${className}}`;
  let variantValueStyle = "";
  switch (variantValue) {
    case "primary": {
      variantValueStyle = "px-2 py-1 rounded text-white bg-primary-color";
      break;
    }
    case "success": {
      variantValueStyle = "px-2 py-1 rounded text-white bg-success-color";
      break;
    }
    case "warning": {
      variantValueStyle = "px-2 py-1 rounded text-white bg-warning-color";
      break;
    }
    case "error": {
      variantValueStyle = "px-2 py-1 rounded text-white bg-error-color";
      break;
    }
  }
  return (
    <div className={customClassName}>
      <div className="flex items-center text-md ">
        {icon}
        <label className="mx-2 font-medium w-36 text-wrap">{label}: </label>
      </div>
      <p className={`text-base break-words ${variantValueStyle} ${customValue}`}>{value}</p>
    </div>
  );
}
TextValueComponent.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  icon: PropTypes.any,
  maxWidth: PropTypes.string,
  variantValue: PropTypes.string,
  customValue: PropTypes.string,
};
