import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

const InputEmailComponent = ({ placeholder, type, control, name, errors }) => {
  // Define validation rules and error messages based on input name
  const validationRules = {
    email: {
      required: `${name} is required!`,
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: `Invalid ${name} format!`,
      },
    },
    password: {
      required: `${name} is required!`,
      minLength: {
        value: 8,
        message: `${name} min length is 8!`,
      },
      maxLength: {
        value: 20,
        message: `${name} max length is 20!`,
      },
    },
    phone: {
      required: `${name} is required!`,
      pattern: {
        value: /^[0-9]{10}$/,
        message: `Invalid ${name} format!`,
      },
    },
    address: {
      required: `${name} is required!`,
    },
    // Add more validation rules for other input names as needed
  };

  const rules = validationRules[name];

  return (
    <div className="flex flex-col max-w-64 mb-1">
      <label>{name}</label>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={rules}
        render={({ field }) => (
          <input
            id={name}
            className={`outline-none px-3 py-2  border border rounded ${
              errors[name] ? "border-red-400" : "border-blue-500"
            }`}
            {...field}
            type={type}
            placeholder={placeholder}
          />
        )}
      />
      {errors[name] && <span className="error-color mt-1">{errors[name].message}</span>}
    </div>
  );
};

InputEmailComponent.propTypes = {
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired, // Add errors propType
};

export default InputEmailComponent;
