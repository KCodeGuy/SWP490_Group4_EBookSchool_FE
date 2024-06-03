const subject = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    id: 1,
    name: "Toán",
    description: "Môn toán khối 12",
    grade: "Khối 12",
    points: [
      {
        semester: "Học kì 1",
        componentPoints: [
          {
            id: 1,
            name: "Kiểm tra miệng",
            scoreFactor: 1,
            count: 2,
          },
          {
            id: 2,
            name: "Kiểm tra 15 phút",
            scoreFactor: 1,
            count: 2,
          },
          {
            id: 3,
            name: "Kiểm tra 1 tiết",
            scoreFactor: 2,
            count: 1,
          },
          {
            id: 4,
            name: "Kiểm tra cuối kì",
            scoreFactor: 2,
            count: 1,
          },
        ],
      },
      {
        semester: "Học kì 2",
        componentPoints: [
          {
            id: 1,
            name: "Kiểm tra miệng",
            scoreFactor: 1,
            count: 2,
          },
          {
            id: 2,
            name: "Kiểm tra 15 phút",
            scoreFactor: 1,
            count: 2,
          },
          {
            id: 3,
            name: "Kiểm tra 1 tiết",
            scoreFactor: 2,
            count: 1,
          },
          {
            id: 4,
            name: "Kiểm tra cuối kì",
            scoreFactor: 2,
            count: 1,
          },
        ],
      },
    ],
    lessonPlans: [
      {
        id: 1,
        slot: 1,
        title: "Nhập môn toán",
        description: "Học cộng trừ nhân chia",
      },
      {
        id: 2,
        slot: 2,
        title: "Nhập môn toán",
        description: "Học cộng trừ nhân chia",
      },
      {
        id: 3,
        slot: 3,
        title: "Nhập môn toán",
        description: "Học cộng trừ nhân chia",
      },
      {
        id: 4,
        slot: 4,
        title: "Nhập môn toán",
        description: "Học cộng trừ nhân chia",
      },
      {
        id: 5,
        slot: 5,
        title: "Nhập môn toán",
        description: "Học cộng trừ nhân chia",
      },
      {
        id: 6,
        slot: 6,
        title: "Nhập môn toán",
        description: "Học cộng trừ nhân chia",
      },
      {
        id: 7,
        slot: 7,
        title: "Nhập môn toán",
        description: "Học cộng trừ nhân chia",
      },
      {
        id: 8,
        slot: 8,
        title: "Nhập môn toán",
        description: "Học cộng trừ nhân chia",
      },
      {
        id: 9,
        slot: 9,
        title: "Nhập môn toán",
        description: "Học cộng trừ nhân chia",
      },
    ],
  },
};

const subjects = {
  code: 200,
  status: true,
  message: "ok",
  data: [
    {
      id: 1,
      name: "Toán",
      description: "Môn toán khối 12",
      grade: "Khối 12",
    },
    {
      id: 2,
      name: "Ngữ Văn",
      description: "Môn ngữ văn khối 12",
      grade: "Khối 12",
    },
    {
      id: 3,
      name: "Tiếng Anh",
      description: "Môn tiếng anh khối 12",
      grade: "Khối 12",
    },
    {
      id: 4,
      name: "GDCD",
      description: "Môn toán khối 12",
      grade: "Khối 12",
    },
    {
      id: 5,
      name: "GDQP-An ninh",
      description: "Môn toán khối 12",
      grade: "Khối 12",
    },
    {
      id: 6,
      name: "Địa lý",
      description: "Môn toán khối 12",
      grade: "Khối 12",
    },
    {
      id: 7,
      name: "Lịch sử",
      description: "Môn toán khối 12",
      grade: "Khối 12",
    },
    {
      id: 8,
      name: "Vật lý",
      description: "Môn toán khối 12",
      grade: "Khối 12",
    },
    {
      id: 9,
      name: "Hóa học",
      description: "Môn toán khối 12",
      grade: "Khối 12",
    },
    {
      id: 10,
      name: "Tin học",
      description: "Môn toán khối 12",
      grade: "Khối 12",
    },
  ],
};

export { subject, subjects };
