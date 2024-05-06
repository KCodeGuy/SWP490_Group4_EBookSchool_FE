// KhoaTD: Mới add vào
const notification = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    id: 1,
    title: "Thông báo lịch nghỉ tết năm 2024", // allow null
    startDate: "03/04/2024",
    endDate: "10/04/2024",
    content: {
      header: "Thông báo lịch nghỉ tết năm 2024",
      body: "Cụ thể như sau nhà trường thông báo toàn bộ học sinh của trường thpt X",
      footer: "Trân trọng",
    },
  },
};

const notifications = {
  code: 200,
  status: true,
  message: "ok",
  data: [
    {
      id: 1,
      title: "Thông báo lịch nghỉ tết năm 2024", // allow null
      startDate: "03/04/2024",
      endDate: "10/04/2024",
      content: {
        header: "Thông báo lịch nghỉ tết năm 2024",
        body: "Cụ thể như sau nhà trường thông báo toàn bộ học sinh của trường thpt X",
        footer: "Trân trọng",
      },
    },
    {
      id: 2,
      title: "Tham gia hội thao", // allow null
      startDate: "03/04/2024",
      endDate: "10/04/2024",
      content: {
        header: "Thông báo lịch nghỉ tết năm 2024",
        body: "Cụ thể như sau nhà trường thông báo toàn bộ học sinh của trường thpt X",
        footer: "Trân trọng",
      },
    },
    {
      id: 3,
      title: "", // allow null
      startDate: "03/04/2024",
      endDate: "10/04/2024",
      content: {
        header: "Thông báo lịch nghỉ tết năm 2024",
        body: "Cụ thể như sau nhà trường thông báo toàn bộ học sinh của trường thpt X",
        footer: "Trân trọng",
      },
    },
  ],
};
