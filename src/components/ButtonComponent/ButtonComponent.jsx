import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

const ButtonComponent = ({ type, size, children, onClick, style, action, className }) => {
  const buttonClasses = `button ${type} ${size} ${className}`;

  return (
    <button className={buttonClasses} onClick={onClick} style={style} type={action}>
      {children}
    </button>
  );
};

ButtonComponent.propTypes = {
  type: PropTypes.oneOf(["primary", "success", "error", "warning", "red", "dark", "light"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  style: PropTypes.object,
  onClick: PropTypes.func,
  action: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

ButtonComponent.defaultProps = {
  type: "primary",
  size: "md",
};

export default ButtonComponent;
