const listSubjectTeachers =
  "congnghe,diali,gdcd,gdqpan,GV0003,hoahoc,lichsu,ngoaingu,nguvan,sinhhoc,theduc,tinhoc,toan,vatli";
const getUserRole = (userRole) => {
  let formattedRole = "";
  if (userRole === "Student") {
    formattedRole = "Student";
  } else if (userRole === "Subject Teacher") {
    formattedRole = "SubjectTeacher";
  } else if (userRole === "HemroomTeacher") {
    formattedRole = "SubjectTeacher";
  }
  return userRole;
};

export { getUserRole };
