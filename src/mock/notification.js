// KhoaTD: Mới add vào
const notification = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    id: 1,
    title: "Thông báo lịch nghỉ tết năm 2024", // allow null
    startDate: "2024-03-04",
    thumbNail: "Ảnh demo",
    content: "Thông báo lịch nghỉ tết năm 2024",
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
      startDate: "2024-03-04",
      thumbNail: "Ảnh demo",
      content: "Thông báo lịch nghỉ tết năm 2024",
    },
    {
      id: 2,
      title: "Tham gia hội thao", // allow null
      startDate: "2024-05-04",
      thumbNail: "Ảnh demo",
      content: "Thông báo lịch nghỉ tết năm 2024",
    },
    {
      id: 3,
      title: "Nghĩ tết ", // allow null
      startDate: "2024-05-04",
      thumbNail: "Ảnh demo",
      content: "Thông báo lịch nghỉ tết năm 2024",
    },
  ],
};

export { notification, notifications };
