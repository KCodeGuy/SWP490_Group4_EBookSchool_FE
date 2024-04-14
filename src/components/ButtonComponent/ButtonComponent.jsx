import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

const ButtonComponent = ({ type, size, children }) => {
  const buttonClasses = `button btn-${type} ${size}`;

  return <button className={buttonClasses}>{children}</button>;
};

ButtonComponent.propTypes = {
  type: PropTypes.oneOf(["primary", "success", "warning", "danger", "main"]),
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
  children: PropTypes.node.isRequired,
};

ButtonComponent.defaultProps = {
  type: "primary",
  size: "md",
};

export default ButtonComponent;
