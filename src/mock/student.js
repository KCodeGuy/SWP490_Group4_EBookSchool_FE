const student = {
  code: 200,
  status: true,
  message: "ok",
  data: {
    id: 1,
    fullName: "Nguyễn Lê Văn A",
    class: "12A2",
    birthday: "01/01/2024",
    birthplace: "Ninh Kiều, Cần Thơ",
    gender: "Nam",
    nation: "Kinh",
    isMartyrs: false,
    address: "Ninh Kiều, Cần Thơ",
    homeTown: "Bình Thủy, Cần Thơ",
    avater: "http://",
    fatherFullName: "Nguyễn Văn B",
    fatherProfession: "Bác sĩ",
    fatherPhone: "0123456789",
    motherFullName: "Lê Thị C",
    motherProfession: "Giáo Viên",
    motherPhone: "0987654321",
  },
};

const nationOptions = [
  { label: "Kinh", value: "Kinh" },
  { label: "Tày", value: "Tày" },
  { label: "Thái", value: "Thái" },
  { label: "Mường", value: "Mường" },
  { label: "Khơ me", value: "Khơ me" },
  { label: "Hoa", value: "Hoa" },
  { label: "Nùng", value: "Nùng" },
  { label: "H'Mông", value: "H'Mông" },
  { label: "Dao", value: "Dao" },
  { label: "Gia Rai", value: "Gia Rai" },
  { label: "Ê Đê", value: "Ê Đê" },
  { label: "Ba Na", value: "Ba Na" },
  { label: "Sán Chay", value: "Sán Chay" },
  { label: "Chăm", value: "Chăm" },
  { label: "Xê Đăng", value: "Xê Đăng" },
  { label: "Sán Dìu", value: "Sán Dìu" },
  { label: "Hrê", value: "Hrê" },
  { label: "Ra Glai", value: "Ra Glai" },
  { label: "MNông", value: "MNông" },
  { label: "X'Tiêng", value: "X'Tiêng" },
  { label: "Bru-Vân Kiều", value: "Bru-Vân Kiều" },
  { label: "Thổ", value: "Thổ" },
  { label: "Giáy", value: "Giáy" },
  { label: "Cơ Ho", value: "Cơ Ho" },
  { label: "Tà Ôi", value: "Tà Ôi" },
  { label: "Mạ", value: "Mạ" },
  { label: "Gié-Triêng", value: "Gié-Triêng" },
  { label: "Co", value: "Co" },
  { label: "Chơ Ro", value: "Chơ Ro" },
  { label: "Xinh Mun", value: "Xinh Mun" },
  { label: "Hà Nhì", value: "Hà Nhì" },
  { label: "Chu Ru", value: "Chu Ru" },
  { label: "Lào", value: "Lào" },
  { label: "La Chí", value: "La Chí" },
  { label: "Kháng", value: "Kháng" },
  { label: "Phù Lá", value: "Phù Lá" },
  { label: "La Hủ", value: "La Hủ" },
  { label: "La Ha", value: "La Ha" },
  { label: "Pà Thẻn", value: "Pà Thẻn" },
  { label: "Lự", value: "Lự" },
  { label: "Ngái", value: "Ngái" },
  { label: "Chứt", value: "Chứt" },
  { label: "Lô Lô", value: "Lô Lô" },
  { label: "Mảng", value: "Mảng" },
  { label: "Cơ Lao", value: "Cơ Lao" },
  { label: "Bố Y", value: "Bố Y" },
  { label: "Cống", value: "Cống" },
  { label: "Si La", value: "Si La" },
  { label: "Pu Péo", value: "Pu Péo" },
  { label: "Brâu", value: "Brâu" },
  { label: "Ơ Đu", value: "Ơ Đu" },
  { label: "Rơ Măm", value: "Rơ Măm" },
  { label: "Dân tộc Khác", value: "Khác" },
];

const students = {
  code: 200,
  status: true,
  message: "ok",
  data: [
    {
      id: 1,
      fullName: "Nguyen Van A",
      birthday: "01/01/2024",
      birthplace: "Ninh Kiều, Cần Thơ",
      gender: "Nam",
      nation: "Kinh",
      isMartyrs: false,
      address: "Ninh Kiều, Cần Thơ",
    },
    {
      id: 2,
      fullName: "Tran Thi B",
      birthday: "01/01/2024",
      birthplace: "Ninh Kiều, Cần Thơ",
      gender: "Nam",
      nation: "Kinh",
      isMartyrs: false,
      address: "Ninh Kiều, Cần Thơ",
    },
    {
      id: 3,
      fullName: "Nguyen Thi C",
      birthday: "01/01/2024",
      birthplace: "Ninh Kiều, Cần Thơ",
      gender: "Nam",
      nation: "Kinh",
      isMartyrs: false,
      address: "Ninh Kiều, Cần Thơ",
    },
    {
      id: 4,
      fullName: "Quach Tuan D",
      birthday: "01/01/2024",
      birthplace: "Ninh Kiều, Cần Thơ",
      gender: "Nam",
      nation: "Kinh",
      isMartyrs: false,
      address: "Ninh Kiều, Cần Thơ",
    },
    {
      id: 5,
      fullName: "Nguyễn Lê Văn A",
      birthday: "01/01/2024",
      birthplace: "Ninh Kiều, Cần Thơ",
      gender: "Nam",
      nation: "Kinh",
      isMartyrs: false,
      address: "Ninh Kiều, Cần Thơ",
    },
  ],
};

export { student, students, nationOptions };
