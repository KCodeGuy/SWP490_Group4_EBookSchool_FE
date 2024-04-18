const studentClass = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    id: 1,
    name: "12A2",
    description: "Phòng học", // allow null
    schoolYear: "2023-2024",
    classroom: "Phòng học A1",
  },
};

const studentClasses = {
  code: 200,
  status: true,
  message: "ok",
  data: [
    {
      id: 1,
      name: "12A2",
      description: "Phòng học", // allow null
      schoolYear: "2023-2024",
      classroom: "Phòng học A1",
    },
    {
      id: 2,
      name: "12A10",
      description: "Phòng học", // allow null
      schoolYear: "2023-2024",
      classroom: "Phòng học A9",
    },
    {
      id: 3,
      name: "12A2",
      description: "Phòng học", // allow null
      schoolYear: "2022-2023",
      classroom: "Phòng học A1",
    },
    {
      id: 4,
      name: "12A2",
      description: "Phòng học", // allow null
      schoolYear: "2021-2022",
      classroom: "Phòng học A1",
    },
    {
      id: 5,
      name: "12A6",
      description: "Phòng học", // allow null
      schoolYear: "2023-2024",
      classroom: "Phòng học A5",
    },
  ],
};

export { studentClass, studentClasses };
