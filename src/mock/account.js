// ID	Username
// GV0001	Admin
// GV0002	HomeroomTeacher
// GV0003	SubjectTeacher
// GV0004	Supervisor
// TeacherLV1	TeacherLV1
// TeacherLV2	TeacherLV2
// TeacherLV3	TeacherLV3

const account = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    id: 1,
    userName: "Teacher001",
    password: "**********", // allow null
    fullName: "Nguyen Van A",
    role: "subject-teacher",
    createdDate: "20/05/2024",
    permission: "Giáo viên",
  },
};

const accounts = {
  code: 200,
  status: true,
  message: "ok",
  data: [
    {
      id: 1,
      userName: "Teacher001",
      password: "**********", // allow null
      fullName: "Nguyen Van B",
      role: "subject-teacher",
      createdDate: "20/05/2024",
      permission: "Giáo viên",
    },
    {
      id: 2,
      userName: "Admin01",
      password: "**********", // allow null
      fullName: "Nguyen Van N",
      role: "subject-teacher",
      createdDate: "20/05/2024",
      permission: "Giáo viên",
    },
    {
      id: 3,
      userName: "HeadeTeacher01",
      password: "**********", // allow null
      fullName: "Nguyen Van O",
      role: "subject-teacher",
      createdDate: "20/05/2024",
      permission: "Giáo viên",
    },
    {
      id: 4,
      userName: "HomeroomTeacher",
      password: "**********", // allow null
      fullName: "Nguyen Van U",
      role: "subject-teacher",
      createdDate: "20/05/2024",
      permission: "Giáo viên",
    },
    {
      id: 5,
      userName: "Teacher001",
      password: "**********", // allow null
      fullName: "Nguyen Van R",
      role: "subject-teacher",
      createdDate: "20/05/2024",
      permission: "Giáo viên",
    },
    {
      id: 6,
      userName: "SubjectTeacher",
      password: "**********", // allow null
      fullName: "Nguyen Van A",
      role: "subject-teacher",
      createdDate: "20/05/2024",
      permission: "Giáo viên",
    },
    {
      id: 7,
      userName: "Teacher12",
      password: "**********", // allow null
      fullName: "Nguyen Van C",
      role: "subject-teacher",
      createdDate: "20/05/2024",
      permission: "Giáo viên",
    },
    {
      id: 8,
      userName: "Teacher05",
      password: "**********", // allow null
      fullName: "Nguyen Van D",
      role: "subject-teacher",
      createdDate: "20/05/2024",
      permission: "Giáo viên",
    },
    {
      id: 9,
      userName: "Teacher008",
      password: "**********", // allow null
      fullName: "Nguyen Van E",
      role: "subject-teacher",
      createdDate: "20/05/2024",
      permission: "Giáo viên",
    },
    {
      id: 10,
      userName: "Teacher009",
      password: "**********", // allow null
      fullName: "Nguyen Van F",
      role: "subject-teacher",
      createdDate: "20/05/2024",
      permission: "Giáo viên",
    },
  ],
};

export { account, accounts };
