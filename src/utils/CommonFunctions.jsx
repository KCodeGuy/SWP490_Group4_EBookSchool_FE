import * as XLSX from "xlsx";
// contains common methods
export const countDuplicateItemsInArray = (arr, schoolSemester) => {
  // Count occurrences of each key
  const counts = arr.reduce((acc, { key, semester }) => {
    // console.log(semester);
    if (semester == schoolSemester) {
      acc[key] = (acc[key] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert counts object to array of objects with key and count
  return Object.keys(counts).map((key) => ({ key, count: counts[key] }));
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDateYearsMonthsDates = (inputDate) => {
  const [day, month, year] = inputDate.split("/");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const handleImportData = (e, setData) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const workbook = XLSX.read(e.target.result, { type: "binary" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const importedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    setData(importedData.slice(1)); // Remove header row
  };
  reader.readAsBinaryString(file);
};

export const handleExportData = (data, sheetName = "Sheet", fileName = "Demo") => {
  if (data.length > 0) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
};
// Utility function to check if a given date is Sunday
export const isTodaySunday = (today) => {
  return today.getDay() === 0;
};

export const generateSchoolWeeks = (schoolYear) => {
  const schoolWeeks = [];
  const [startYear, endYear] = schoolYear.split("-").map(Number);

  // Start date is January 1st of the start year
  let startDate = new Date(startYear, 0, 1);

  // Adjust the start date to the nearest Monday
  const day = startDate.getDay();
  const dayOffset = (day === 0 ? -6 : 1) - day; // If Sunday (0), move to next day; otherwise, move to Monday
  startDate.setDate(startDate.getDate() + dayOffset);

  let weekCount = 0;

  // Generate weeks until the end of the first week of the next year
  while (
    startDate.getFullYear() <= endYear ||
    (startDate.getFullYear() === endYear && startDate.getDate() <= 7)
  ) {
    const weekStart = new Date(startDate);
    const weekEnd = new Date(startDate);
    weekEnd.setDate(weekStart.getDate() + 6); // End date is 6 days after start date

    const week = {
      id: weekCount,
      name: `Week ${weekCount + 1}`,
      startTime: formatDate(weekStart),
      endTime: formatDate(weekEnd),
    };
    schoolWeeks.push(week);
    // Move start date to the next week
    startDate.setDate(startDate.getDate() + 7);
    weekCount++;
  }

  return schoolWeeks;
};
export const generateClasses = (listClasses, year) => {
  const result = listClasses.find((item) => item.schoolYear == year);
  if (result) {
    return result.details;
  }
  return [];
};

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed in JavaScript
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${day}/${month}/${year}`;
  return { formattedDate, today };
};

export const isTodayInSchoolYear = (schoolYear) => {
  const { today } = getTodayDate();
  const [startYear, endYear] = schoolYear.split("-").map(Number);

  const schoolYearStart = new Date(startYear, 0, 1); // January 1st of start year
  const schoolYearEnd = new Date(endYear, 11, 31); // December 31st of end year

  return today >= schoolYearStart && today <= schoolYearEnd;
};

// New function to check which week today falls into
export const getWeekForDate = (weeks, date) => {
  for (let i = 0; i < weeks.length; i++) {
    const weekStart = new Date(dateFromFormat(weeks[i].startTime));
    const weekEnd = new Date(dateFromFormat(weeks[i].endTime));

    // Normalize times to compare dates only (ignore time part)
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);

    if (date >= weekStart && date <= weekEnd) {
      return weeks[i];
    }
  }
  return null; // Return null if the date doesn't fall within any week
};

// Helper function to parse a date from the formatted string
export const dateFromFormat = (formattedDate) => {
  const [day, month, year] = formattedDate.split("/").map(Number);
  return new Date(year, month - 1, day); // Months are zero-indexed in JavaScript
};

export const getCurrentSchoolYear = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  return `${currentYear}-${nextYear}`;
};

export const getUsernameSubString = (text) => {
  const regex = /Người dùng (\w+)/;
  const match = text.match(regex);
  if (match && match.length > 1) {
    return match[1];
  } else {
    return null; // or handle the case where the admin name is not found
  }
};

export const getClassFromClassRoom = (inputString) => {
  const match = inputString.match(/\d+\w+/);
  return match ? match[0] : "";
};

export const formatDateYYYYMMDD = (inputDate) => {
  // Check if the inputDate matches the "dd/MM/yyyy" format
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = inputDate.match(datePattern);

  if (!match) {
    throw new Error("The specified value does not conform to the format dd/MM/yyyy");
  }

  const [, day, month, year] = match;

  // Rearrange the date to "yyyy-MM-dd"
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

export const countNumberOfSlotsInWeek = (currentTimeTable) => {
  let numberOfSlotInWeek = 0;
  currentTimeTable.forEach((date) => {
    date.slots.forEach((slot) => {
      if (slot.classroom !== "" && slot.subject !== "") {
        numberOfSlotInWeek++;
      }
    });
  });
  return numberOfSlotInWeek;
};

export const formatUrlToFile = async (url, filename, mimeType) => {
  const proxyUrl = "https://cors-anywhere.herokuapp.com/"; // Using a public CORS proxy
  const finalUrl = proxyUrl + url;

  try {
    const response = await fetch(finalUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const blob = await response.blob();
    return new File([blob], filename, { type: mimeType });
  } catch (error) {
    console.error("Failed to fetch the image:", error);
    throw error;
  }
};
