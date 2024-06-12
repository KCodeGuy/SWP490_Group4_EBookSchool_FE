const listSubjectTeachers =
  "congnghe,diali,gdcd,gdqpan,GV0003,hoahoc,lichsu,ngoaingu,nguvan,sinhhoc,theduc,tinhoc,toan,vatli";
const getUserRole = (userID, userName, permission) => {
  let userRole;
  if (userID.includes("HS")) {
    // Role student
    userRole = "Student";
  } else if (
    (permission.includes("Add Mark") && permission.includes("Delete Mark")) ||
    listSubjectTeachers.includes(userID)
  ) {
    // Role subject teacher
    userRole = "SubjectTeacher";
  } else if (userID.includes("homeroomteacher") || userName.toLowerCase() == "homeroomteacher") {
    // Role Homeroom teacher
    userRole = "HomeroomTeacher";
  } else if (permission.includes("Get Log") && userName.toLowerCase() !== "admin") {
    // Role Headteacher
    userRole = "Headteacher";
  } else if (
    (permission.includes("Add Teacher") && permission.includes("Delete Teacher")) ||
    userName.toLowerCase() === "admin"
  ) {
    // Role Principal
    userRole = "Principal";
  }
  return userRole;
};

export { getUserRole };
