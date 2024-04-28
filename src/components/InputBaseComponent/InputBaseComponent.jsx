/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { capitalizeFirstLetter } from "../../utils/HandleArray";

const InputBaseComponent = ({
  label,
  placeholder,
  type,
  control,
  name,
  errors,
  horizontalLabel,
  noLabel,
  validationRules, // Custom validation rules prop
}) => {
  const rules = validationRules || {};
  const isRequired = rules.required; // Check if 'required' rule exists

  return (
    <div className="flex flex-col mb-3">
      <div className={`flex ${horizontalLabel ? "items-end" : "flex-col"}`}>
        <label className={`mr-2 w-36 font-medium ${noLabel ? "hidden" : ""}`}>
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          rules={rules}
          render={({ field }) => (
            <input
              id={name}
              className={`outline-none w-full px-3 py-2  border rounded ${
                errors[name] ? "border-red-400" : "border-blue-500"
              }`}
              {...field}
              type={type}
              placeholder={placeholder}
            />
          )}
        />
      </div>
      {errors[name] && <p className="error-color mt-1">{errors[name].message}</p>}
    </div>
  );
};

InputBaseComponent.propTypes = {
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  noLabel: PropTypes.bool,
  label: PropTypes.string,
  horizontalLabel: PropTypes.bool,
  control: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  validationRules: PropTypes.object, // Custom validation rules prop
};

export default InputBaseComponent;
