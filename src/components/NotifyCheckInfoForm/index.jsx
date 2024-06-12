import React from "react";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import PropTypes from "prop-types";

export default function NotifyCheckInfoForm({ actionText }) {
  return (
    <div>
      <NewReleasesIcon />
      {actionText ? (
        <span className="text-base mt-2 font-bold ml-1">
          Hãy kiểm tra kĩ thông tin trước khi {actionText}!
        </span>
      ) : (
        <span className="text-base mt-2 font-bold ml-1">Hãy kiểm tra kĩ thông tin!</span>
      )}
    </div>
  );
}

NotifyCheckInfoForm.propTypes = {
  actionText: PropTypes.string,
};
