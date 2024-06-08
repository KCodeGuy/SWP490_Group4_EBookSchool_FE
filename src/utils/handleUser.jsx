const getUserRole = (userID, userName, permission) => {
  let userRole;
  if (userID.includes("HS")) {
    userRole = "Student";
  } else if (permission.includes("Add Mark") && permission.includes("Delete Mark")) {
    userRole = "SubjectTeacher";
  } else if (permission.includes("Add Teacher") && permission.includes("Delete Teacher")) {
    userRole = "Principal";
  } else if (userID.includes("homeroomteacher") || userName.toLowerCase() == "homeroomteacher") {
    userRole = "HomeroomTeacher";
  } else {
    userRole = "Headteacher";
  }
  return userRole;
};

export { getUserRole };
