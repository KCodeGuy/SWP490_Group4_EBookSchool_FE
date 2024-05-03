/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

export default function SearchComponent({ data, option, className, placeHolder, onEnter }) {
  const [value, setValue] = React.useState(null);

  const handleChange = (event, newValue) => {
    if (typeof newValue === "string") {
      setValue({
        title: newValue,
      });
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      setValue({
        title: newValue.inputValue,
      });
    } else {
      setValue(newValue);
    }
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      if (value && value.title) {
        onEnter(value.title);
      }
    }
  };

  return (
    <Autocomplete
      value={value}
      className={className}
      onChange={handleChange}
      onKeyDown={handleEnter}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={data}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => <TextField {...params} label={placeHolder} />}
    />
  );
}

SearchComponent.propTypes = {
  option: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  className: PropTypes.string,
  placeHolder: PropTypes.string.isRequired,
  onEnter: PropTypes.func.isRequired, // New prop for handling Enter key
};
