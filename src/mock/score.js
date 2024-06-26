// Bảng điểm tất cả môn của cả lớp
const scoreByStudentsBySubjects = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    class: "12A1",
    schoolYear: "2023-2024",
    teacher: "Lê Thị B",
    semester: "Học kì 1",
    scores: [
      {
        id: 1,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        study: "Giỏi",
        conduct: "Tốt",
        rank: 1,
        detailScores: [
          {
            key: "Toán",
            value: 10,
          },
          {
            key: "Lý",
            value: 10,
          },
          {
            key: "Hóa",
            value: 10,
          },
          {
            key: "Sinh",
            value: 10,
          },
        ],
      },
      {
        id: 2,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        study: "Giỏi",
        conduct: "Tốt",
        rank: 1,
        detailScores: [
          {
            key: "Toán",
            value: 10,
          },
          {
            key: "Lý",
            value: 10,
          },
          {
            key: "Hóa",
            value: 10,
          },
          {
            key: "Sinh",
            value: 10,
          },
        ],
      },
      {
        id: 3,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        study: "Giỏi",
        conduct: "Tốt",
        rank: 1,
        detailScores: [
          {
            key: "Toán",
            value: 10,
          },
          {
            key: "Lý",
            value: 10,
          },
          {
            key: "Hóa",
            value: 10,
          },
          {
            key: "Sinh",
            value: 10,
          },
        ],
      },
    ],
  },
};

// Điểm 1 môn của cả lớp
// KhoaTD: Khúc này map ok
const scoreByStudentsBySubject = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    subject: "Toán",
    semester: "Học kì 1",
    class: "12A2",
    schoolYear: "2023-2024",
    teacherName: "Nguyên Thị B",
    score: [
      {
        id: 1,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
        ],
      },
      {
        id: 1,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
        ],
      },
      {
        id: 2,
        fullName: "Nguyễn Lê Văn B",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
        ],
      },
    ],
  },
};

// Điểm 1 môn của cả lớp môn tiếng anh (Ví dụ)
// KhoaTD: này chỉ t example, don't care cái này
const scoreByStudentsBySubjectEnlish = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    subject: "Ngoại ngữ",
    semester: "Học kì 1",
    class: "12A2",
    schoolYear: "2023-2024",
    teacherName: "Nguyên Thị B",
    score: [
      {
        id: 1,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 9,
          },
        ],
      },
      {
        id: 2,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 9,
          },
        ],
      },
      {
        id: 3,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 9,
          },
        ],
      },
      {
        id: 3,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 9,
          },
        ],
      },
      {
        id: 3,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 9,
          },
        ],
      },
      {
        id: 3,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 9,
          },
        ],
      },
      {
        id: 3,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 9,
          },
        ],
      },
      {
        id: 3,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 9,
          },
        ],
      },
      {
        id: 3,
        fullName: "Nguyễn Lê Văn A",
        average: 10,
        rank: 1,
        scores: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 9,
          },
        ],
      },
    ],
  },
};

// Điểm tất cả môn của 1 đứa
const scoreByStudent = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    id: 1,
    fullName: "Nguyễn Lê Văn A",
    average: 10,
    study: "Giỏi",
    conduct: "Tốt",
    rank: 1,
    class: "12A1",
    note: "Thông minh",
    schoolYear: "2023-2024",
    semester: "Học kì 1",
    scores: [
      {
        subject: "Toán",
        average: 10,
        scoreDetail: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
        ],
      },
      {
        subject: "Văn",
        scoreDetail: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
        ],
      },
      {
        subject: "Anh",
        scoreDetail: [
          {
            key: "Kiểm tra miệng",
            value: 10,
          },
          {
            key: "Kiểm tra 15 phút",
            value: 10,
          },
          {
            key: "Kiểm tra 1 tiết",
            value: 10,
          },
          {
            key: "Kiểm tra cuối kì",
            value: 10,
          },
        ],
      },
    ],
  },
};

// Điểm 1 môn của 1 đứa
const scoreByStudentBySubject = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    id: 1,
    fullName: "Nguyễn Lê Văn A",
    average: 10,
    rank: 1,
    class: "12A1",
    subject: "Toán",
    schoolYear: "2023-2024",
    semester: "Học kì 1",
    scores: [
      {
        key: "Kiểm tra miệng",
        value: 10,
      },
      {
        key: "Kiểm tra miệng",
        value: 10,
      },
      {
        key: "Kiểm tra 15 phút",
        value: 10,
      },
      {
        key: "Kiểm tra 15 phút",
        value: 10,
      },
      {
        key: "Kiểm tra 1 tiết",
        value: 10,
      },
      {
        key: "Kiểm tra cuối kì",
        value: 10,
      },
    ],
  },
};

// Thống kê điểm 1 môn theo khối
const scoreStatisticsBySubject = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    schoolYear: "2023-2024",
    semester: "Học kì 1",
    subject: "Toán",
    grade: "Khối 12",
    average: "7.6",
    max: 9,
    min: 6.5,
    scores: [
      {
        key: "12A1",
        value: "6.5",
      },
      {
        key: "12A2",
        value: "9",
      },
      {
        key: "12A3",
        value: "8",
      },
      {
        key: "12A4",
        value: "7",
      },
      {
        key: "12A5",
        value: "6",
      },
    ],
    detail: [
      {
        class: "12A1",
        subjectTeacher: "Nguyễn Thị B",
        average: "6.5",
        rank: "1",
      },
      {
        class: "12A2",
        subjectTeacher: "Nguyễn Thị B",
        average: "6.5",
        rank: "1",
      },
      {
        class: "12A3",
        subjectTeacher: "Nguyễn Thị B",
        average: "6.5",
        rank: "1",
      },
      {
        class: "12A4",
        subjectTeacher: "Nguyễn Thị B",
        average: "6.5",
        rank: "1",
      },
      {
        class: "12A5",
        subjectTeacher: "Nguyễn Thị B",
        average: "6.5",
        rank: "1",
      },
    ],
  },
};

// Thống kê điểm 1 môn
const scoreStatisticsAllGradeBySubject = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    schoolYear: "2023-2024",
    semester: "Học kì 1",
    subject: "Toán",
    average: "7.6",
    max: 9,
    min: 6.5,
    scores: [
      {
        key: "Khối 10",
        value: "6.5",
      },
      {
        key: "Khối 11",
        value: "9",
      },
      {
        key: "Khối 12",
        value: "8",
      },
    ],
    detail: [
      {
        grade: "Khối 10",
        count: 349,
        average: "6.5",
        rank: "1",
      },
      {
        grade: "Khối 11",
        count: 366,
        average: "6.5",
        rank: "1",
      },
      {
        grade: "Khối 12",
        count: 376,
        average: "6.5",
        rank: "1",
      },
    ],
  },
};

// Thống kê điểm 1 môn của 1 lớp
const scoreStatisticsByClassBySubject = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    schoolYear: "2023-2024",
    semester: "Học kì 1",
    subject: "Toán",
    class: "12A1",
    average: "7.6",
    max: 9,
    min: 6.5,
    scores: [
      {
        key: ">0 và <=1",
        value: "1",
      },
      {
        key: ">1 và <=2",
        value: "1",
      },
      {
        key: ">2 và <=3",
        value: "9",
      },
      {
        key: ">3 và <=4",
        value: "8",
      },
      {
        key: ">4 và <=5",
        value: "7",
      },
      {
        key: ">5 và <=6",
        value: "6",
      },
      {
        key: ">6 và <=7",
        value: "1",
      },
      {
        key: ">7 và <=8",
        value: "9",
      },
      {
        key: ">8 và <=9",
        value: "8",
      },
      {
        key: ">9 và <=10",
        value: "7",
      },
    ],
    detail: [
      {
        id: 1,
        fullName: "Lê Văn A",
        average: 10,
        rank: 1,
      },
      {
        id: 2,
        fullName: "Lê Văn A",
        average: 10,
        rank: 1,
      },
      {
        id: 3,
        fullName: "Lê Văn A",
        average: 10,
        rank: 1,
      },
      {
        id: 4,
        fullName: "Lê Văn A",
        average: 10,
        rank: 1,
      },
      {
        id: 5,
        fullName: "Lê Văn A",
        average: 10,
        rank: 1,
      },
      {
        id: 6,
        fullName: "Lê Văn A",
        average: 10,
        rank: 1,
      },
    ],
  },
};

// Thống kê điểm theo khối
const scoreStatisticsAllClassBySubject = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    schoolYear: "2023-2024",
    semester: "Học kì 1",
    grade: "Khối 12",
    average: "7.6",
    max: 9,
    min: 6.5,
    scores: [
      {
        key: "12A1",
        value: "6.5",
      },
      {
        key: "12A2",
        value: "9",
      },
      {
        key: "12A3",
        value: "8",
      },
      {
        key: "12A4",
        value: "7",
      },
      {
        key: "12A5",
        value: "6",
      },
    ],
    detail: [
      {
        class: "12A1",
        subjectTeacher: "Nguyễn Thị B",
        average: "6.5",
        rank: "1",
      },
      {
        class: "12A2",
        subjectTeacher: "Nguyễn Thị B",
        average: "6.5",
        rank: "1",
      },
      {
        class: "12A3",
        subjectTeacher: "Nguyễn Thị B",
        average: "6.5",
        rank: "1",
      },
      {
        class: "12A4",
        subjectTeacher: "Nguyễn Thị B",
        average: "6.5",
        rank: "1",
      },
      {
        class: "12A5",
        subjectTeacher: "Nguyễn Thị B",
        average: "6.5",
        rank: "1",
      },
    ],
  },
};

// Thống kê điểm tất cả môn theo lớp
const scoreStatisticsAllSubjectByClass = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    schoolYear: "2023-2024",
    semester: "Học kì 1",
    class: "12A2",
    average: "7.6",
    max: 9,
    min: 6.5,
    scores: [
      {
        key: "Toán",
        value: "6.5",
      },
      {
        key: "Lý",
        value: "9",
      },
      {
        key: "Hóa",
        value: "8",
      },
      {
        key: "Sinh",
        value: "7",
      },
      {
        key: "Ngữ Văn",
        value: "6",
      },
    ],
  },
};

const scoreByStudents = {
  code: 200,
  status: true,
  message: "ok",
  data: [
    {
      id: 1,
      fullName: "Nguyễn Lê Văn A",
      average: 10,
      study: "Giỏi",
      conduct: "Tốt",
      rank: 1,
      scores: [
        { key: "Toán", value: 10 },
        { key: "Vật lí", value: 10 },
        { key: "Hóa học", value: 10 },
        { key: "Sinh học", value: 10 },
        { key: "Tin học", value: 10 },
        { key: "Ngữ Văn", value: 10 },
        { key: "Lịch Sử", value: 10 },
        { key: "Địa lí", value: 10 },
        { key: "Ngoại ngữ", value: 10 },
        { key: "Công nghệ", value: 10 },
        { key: "GDCD", value: 10 },
        { key: "GDQP", value: 10 },
        { key: "Thể dục", value: 10 },
      ],
    },
    {
      id: 2,
      fullName: "Nguyễn Lê Văn A",
      average: 10,
      study: "Giỏi",
      conduct: "Tốt",
      rank: 1,
      scores: [
        { key: "Toán", value: 10 },
        { key: "Vật lí", value: 10 },
        { key: "Hóa học", value: 10 },
        { key: "Sinh học", value: 10 },
        { key: "Tin học", value: 10 },
        { key: "Ngữ Văn", value: 10 },
        { key: "Lịch Sử", value: 10 },
        { key: "Địa lí", value: 10 },
        { key: "Ngoại ngữ", value: 10 },
        { key: "Công nghệ", value: 10 },
        { key: "GDCD", value: 10 },
        { key: "GDQP", value: 10 },
        { key: "Thể dục", value: 10 },
      ],
    },
    {
      id: 3,
      fullName: "Nguyễn Lê Văn A",
      average: 10,
      study: "Giỏi",
      conduct: "Tốt",
      rank: 1,
      scores: [
        { key: "Toán", value: 10 },
        { key: "Vật lí", value: 10 },
        { key: "Hóa học", value: 10 },
        { key: "Sinh học", value: 10 },
        { key: "Tin học", value: 10 },
        { key: "Ngữ Văn", value: 10 },
        { key: "Lịch Sử", value: 10 },
        { key: "Địa lí", value: 10 },
        { key: "Ngoại ngữ", value: 10 },
        { key: "Công nghệ", value: 10 },
        { key: "GDCD", value: 10 },
        { key: "GDQP", value: 10 },
        { key: "Thể dục", value: 10 },
      ],
    },
    // Additional student data...
  ],
};

export {
  scoreByStudent,
  scoreByStudents,
  scoreByStudentBySubject,
  scoreByStudentsBySubject,
  scoreByStudentsBySubjectEnlish,
  scoreByStudentsBySubjects,
  scoreStatisticsAllClassBySubject,
  scoreStatisticsAllGradeBySubject,
  scoreStatisticsAllSubjectByClass,
  scoreStatisticsByClassBySubject,
  scoreStatisticsBySubject,
};
