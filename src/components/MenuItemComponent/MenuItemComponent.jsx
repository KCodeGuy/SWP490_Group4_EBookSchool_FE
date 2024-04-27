import React from "react";
import PropTypes from "prop-types";

export default function MenuItemComponent({ data, onChange }) {
  return (
    <div className="absolute right-10 bg-white shadow-xl rounded z-50 cursor-pointer">
      <ul className="list-none m-0 p-0">
        {data.map((item, index) => (
          // eslint-disable-next-line react/jsx-key
          <li key={index} className="text-center font-bold py-2 px-4 hover">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

MenuItemComponent.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.string,
};
