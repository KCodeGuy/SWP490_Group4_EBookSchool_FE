import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const BootstrapDialog = styled(Dialog)(({ theme, width }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
  "& .MuiPaper-root": {
    width: width || "auto", // Default to 'auto' if no width prop is provided
  },
}));

export default function PopupComponent({
  title,
  icon,
  onSubmit,
  children,
  isOpen,
  onClose,
  description,
  rightNote,
  tabs,
}) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={isOpen}>
      <DialogTitle sx={{ m: 0, paddingX: 2, paddingY: 2 }} id="customized-dialog-title">
        {icon && <span className="mr-2 text-xl">{icon}</span>}
        {title}
        <div className="flex justify-between">
          {description && <p className="mt-0 text-sm font-medium">{description}</p>}
          {rightNote && <p className="mt-0 text-sm font-medium">{rightNote}</p>}
        </div>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      {tabs && (
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="standard"
          sx={{
            paddingX: 2,
            minHeight: 46,
            "& .Mui-selected": {
              backgroundColor: "#247cd4",
              color: "white !important",
              fontWeight: "bold",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              sx={{
                paddingX: 1,
                paddingY: 1.2,
                fontSize: 13,
              }}
              label={tab.label}
            />
          ))}
        </Tabs>
      )}
      <DialogContent
        sx={{ m: 0, paddingX: 3, paddingY: 3, width: "100%" }}
        md={{ m: 0, paddingX: 3, paddingY: 3, minWidth: 380 }}
        dividers
      >
        {tabs ? children[selectedTab] : children}
      </DialogContent>
    </BootstrapDialog>
  );
}

PopupComponent.propTypes = {
  onSubmit: PropTypes.func,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  rightNote: PropTypes.string,
  icon: PropTypes.node,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
    })
  ),
};
