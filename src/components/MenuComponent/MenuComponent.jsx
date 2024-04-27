import React, { useState, useRef, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import "./style.scss";

/* eslint-disable react/prop-types */
const PopupMenu = ({ items, style, className }) => {
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const iconRef = useRef(null);

  const togglePopup = (event) => {
    event.stopPropagation();
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };

    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  // Combine the user's className with the default one
  const combinedClassName = ` menu-custom right rounded flex justify-center items-center w-10 cursor-pointer ${
    className || ""
  }`;

  return (
    <div>
      <div
        ref={iconRef}
        className={combinedClassName}
        onClick={togglePopup}
        style={{ ...style }} // Apply the user-defined inline styles
      >
        <MenuIcon className="icon" />
      </div>
      {showPopup && (
        <div ref={popupRef} className="absolute right-10 bg-white shadow-xl rounded z-50">
          <ul className="list-none m-0 p-0">
            {items.map((item, index) => (
              <li
                key={index}
                className="text-center font-bold py-2 px-4 hover cursor-pointer"
                onClick={() => {
                  item.action();
                  setShowPopup(false);
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PopupMenu;
