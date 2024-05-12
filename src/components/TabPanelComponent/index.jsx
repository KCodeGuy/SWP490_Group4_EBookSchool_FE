/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
const { Typography, Box } = require("@mui/material");

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tabpanel-${index}`}
      {...other}
      className="mt-10"
    >
      {value === index && <div className="w-full">{children}</div>}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};
