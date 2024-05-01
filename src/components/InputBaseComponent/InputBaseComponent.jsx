import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

const InputBaseComponent = ({
  label,
  placeholder,
  type,
  control,
  name,
  errors,
  horizontalLabel,
  className,
  noLabel,
  setValue,
  validationRules,
  options,
}) => {
  const rules = validationRules || {};
  const isRequired = rules.required;
  const customClassName = `flex flex-col mb-3 ${className}`;

  const handleSetValue = (value) => {
    setValue(name, value); // Set the value for the input field with name
  };

  return (
    <div className={customClassName}>
      <div
        className={`flex 
        ${horizontalLabel ? "items-end" : "flex-col"} 
        ${type === "checkbox" ? "items-center" : ""} `}
      >
        <label
          className={`mr-2 font-medium 
          ${horizontalLabel ? "min-w-28" : "w-full"} 
          ${noLabel ? "hidden" : ""}`}
        >
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Controller
          name={name}
          defaultValue=""
          control={control}
          rules={rules}
          render={({ field }) =>
            type === "select" ? (
              <select
                id={name}
                className={`outline-none px-3 py-2 h-11 border rounded 
                ${errors[name] ? "border-red-400" : "border-blue-500"}`}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  handleSetValue(e.target.value);
                }}
              >
                {options.map((option, index) => (
                  <option key={index} className="py-2" value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : type === "checkbox" ? (
              <input
                id={name}
                className={`outline-none px-3 py-2 border rounded w-5 h-5 accent-blue-500
                ${errors[name] ? "border-red-400" : "border-blue-500"}`}
                {...field}
                type="checkbox"
                onChange={(e) => {
                  field.onChange(e);
                  handleSetValue(e.target.checked); // For checkboxes, set the value to the checked state
                }}
                placeholder={placeholder}
              />
            ) : type === "radio" ? (
              // Radio buttons logic goes here
              // For radio buttons, you should handle the checked state based on the field value
              options.map((option, index) => (
                <div key={index} className="flex items-center mr-3">
                  <input
                    id={`${name}-${index}`}
                    className={`outline-none px-3 py-2 border rounded w-5 h-5 accent-blue-500
                    ${errors[name] ? "border-red-400" : "border-blue-500"}`}
                    {...field}
                    type="radio"
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={(e) => {
                      field.onChange(e);
                      handleSetValue(option.value);
                    }}
                  />
                  <label htmlFor={`${name}-${index}`} className="ml-1">
                    {option.label}
                  </label>
                </div>
              ))
            ) : (
              <input
                id={name}
                className={`outline-none px-3 py-2 border rounded w-full
                ${errors[name] ? "border-red-400" : "border-blue-500"}`}
                {...field}
                type={type}
                onChange={(e) => {
                  field.onChange(e);
                  handleSetValue(e.target.value);
                }}
                placeholder={placeholder}
              />
            )
          }
        />
      </div>
      {errors[name] && <p className="error-color mt-1">{errors[name].message}</p>}
    </div>
  );
};

InputBaseComponent.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  validationRules: PropTypes.object,
  label: PropTypes.string,
  className: PropTypes.string,
  noLabel: PropTypes.bool,
  setValue: PropTypes.func,
  horizontalLabel: PropTypes.bool,
};

export default InputBaseComponent;
