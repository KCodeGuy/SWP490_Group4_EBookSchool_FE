import * as XLSX from "xlsx";

// contains common methods
export function countDuplicateItemsInArray(array, semester) {
  const keyOrder = ["Miệng", "15p", "1 Tiết", "Cuối kỳ"];
  const itemCounts = {};

  array.forEach((item) => {
    if (item.semester === semester) {
      if (itemCounts[item.key]) {
        itemCounts[item.key]++;
      } else {
        itemCounts[item.key] = 1;
      }
    }
  });

  return keyOrder.map((key) => ({
    key,
    count: itemCounts[key] || 0,
  }));
}

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
    // console.error("Failed to fetch the image:", error);
    // throw error;
  }
};

// Function to remove HTML tags from a string
export const getInnerTextInsideHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

// utils/getRouteName.js
export const getRouteName = (path) => {
  // Function to check if a string is a GUID
  const isGuid = (str) => {
    // Regular expression to match GUID format
    const guidPattern =
      /^[{]?[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}[}]?$/;
    return guidPattern.test(str);
  };
  const routes = [
    {
      title: "Học tập",
      key: "studying",
    },
    {
      name: "Trang chủ",
      key: "dashboard",
      route: "/dashboard",
    },
    {
      name: "Sổ đầu bài",
      key: "register-notebook",
      route: "/register-notebook",
    },
    {
      name: "Thời khóa biểu",
      key: "weeklyTimeTable",
      route: "/weeklyTimeTable",
    },
    {
      name: "Điểm danh",
      key: "takeAttendance",
      route: "/takeAttendance/:attendanceID",
    },
    {
      name: "Thông báo",
      key: "notificationDetails",
      route: "/notificationDetails/:notificationID",
    },
    {
      title: "Thống kê",
      key: "statistic",
    },
    {
      name: "Thống kê sổ đầu bài",
      key: "registerNotebookStatistics",
      route: "/registerNotebookStatistics",
    },
    {
      name: "Thống kê lượt vắng",
      key: "attendanceStatistics",
      route: "/attendanceStatistics",
    },
    {
      name: "Thống kê điểm",
      key: "markStatistics",
      route: "/markStatistics",
    },
    {
      name: "Thống kê học lực",
      key: "academicPerformanceStatistics",
      route: "/academicPerformanceStatistics",
    },
    {
      title: "Quản lí",
      key: "management",
    },
    {
      name: "Báo cáo điểm",
      key: "markReportStudent",
    },
    {
      name: "Báo cáo điểm danh",
      key: "attendanceReportStudent",
    },
    {
      name: "Quản lí điểm",
      key: "markManagement",
      route: "/markManagement",
    },
    {
      name: "Quản lí lớp",
      key: "classManagement",
      route: "/classManagement",
    },
    {
      name: "Quản lí môn",
      key: "subjectManagement",
      route: "/subjectManagement",
    },
    {
      name: "Quản lí thông báo",
      key: "notificationManagement",
      route: "/notificationManagement",
    },
    {
      name: "Quản lí giáo viên",
      key: "accountManagement",
      route: "/accountManagement",
    },
    {
      name: "Quản lí học sinh",
      key: "studentAccountManagement",
      route: "/studentAccountManagement",
    },
    {
      title: "Demo",
      key: "demoExample",
    },
    {
      name: "Wiki",
      key: "wiki",
      route: "/wiki",
    },
    {
      name: "Demo",
      key: "demo",
      route: "/demo",
    },
    {
      title: "Hệ thống",
      key: "system",
    },
    {
      name: "Đăng nhập",
      key: "sign-in",
      route: "/authentication/sign-in",
    },
    {
      name: "Đổi mật khẩu",
      key: "reset-password",
      route: "/authentication/reset-password",
    },
    {
      name: "Ghi log",
      key: "logHistory",
      route: "/logHistory",
    },
    {
      name: "Ghi log",
      key: "logHistoryDetails",
      route: "/logHistory/:id",
    },
    {
      name: "Cài đặt hệ thống",
      key: "systemSetting",
      route: "/systemSetting",
    },
    {
      name: "Tài khoản",
      key: "profile",
      route: "/profile",
    },
  ];

  const foundRoute = routes.find((route) => route.key.toLowerCase().includes(path.toLowerCase()));
  if (path == ":attendanceID") {
    return "Điểm danh";
  }

  if (path == ":notificationID") {
    return "Chi tiết thông báo";
  }

  if (path == ":id") {
    return "Ghi log";
  }

  if (isGuid(path)) {
    return "";
  }
  return foundRoute ? foundRoute.name : path;
};

export const splitStringBySecondWord = (input) => {
  // Split the input string into words
  const words = input.split(" ");

  // Check if there are at least two words
  if (words.length < 2) {
    return [input]; // If not enough words, return the original string in an array
  }

  // The second word is the one we need to find the last occurrence of
  const secondWord = words[1];

  // Find the last occurrence of the second word in the input string
  const index = input.lastIndexOf(secondWord);

  // If the second word is not found, return the original string in an array
  if (index === -1) {
    return [input];
  }

  // Split the input string into two parts based on the last occurrence of the second word
  const part1 = input.substring(0, index + secondWord.length).trim();
  const part2 = input.substring(index + secondWord.length).trim();

  return [part1, part2];
};

// Helper function to check if the file is an .xlsx file
export const isXlsxFile = (file) => {
  return (
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.name.endsWith(".xlsx")
  );
};

export const isImageFie = (file) => {
  // List of image MIME types
  const imageMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/svg+xml",
    "image/x-icon",
    "image/tiff",
  ];

  return imageMimeTypes.includes(file.type);
};
