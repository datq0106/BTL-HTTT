export const VAN_PHONG = {
  ten: 'Black Panther',
  slogan: 'Private residences, professionally leased',
  diaChi: 'Tầng 12, 27 Tràng Tiền, Quận Hoàn Kiếm, TP. Hà Nội',
  dienThoai: '024 3822 1908',
  email: 'leasing@blackpanther.vn',
  gio: 'T2–T7 · 08:30–18:00',
}

export const KHU_VUC = [
  {
    id: 'q1',
    ten: 'Quận 1',
    moTa: 'Trung tâm tài chính, view sông',
    anh: '/properties/01.jpg',
    giaTu: 12_900_000,
    giaDen: 45_000_000,
    khach: 'Chuyên gia nước ngoài, cặp đôi làm việc CBD',
    dacDiem: ['Đi bộ tới Nguyễn Huệ', 'Tòa dịch vụ full nội thất', 'An ninh 24/7'],
    pin: { x: 38, y: 48 },
  },
  {
    id: 'q3',
    ten: 'Quận 3',
    moTa: 'Phố cổ, gần bệnh viện & trường',
    anh: '/properties/02.jpg',
    giaTu: 18_000_000,
    giaDen: 32_000_000,
    khach: 'Designer, bác sĩ, hộ gia đình nhỏ',
    dacDiem: ['Loft cải tạo', 'Gần bệnh viện & trường', 'Yên hơn Quận 1'],
    pin: { x: 28, y: 44 },
  },
  {
    id: 'bt',
    ten: 'Bình Thạnh',
    moTa: 'Ven sông, kết nối cầu Sài Gòn',
    anh: '/properties/03.jpg',
    giaTu: 16_000_000,
    giaDen: 28_000_000,
    khach: 'Founder live-work, chuyên gia cầu Sài Gòn',
    dacDiem: ['Kết nối Thảo Điền', 'Loft họp khách', 'Giá mềm hơn CBD'],
    pin: { x: 48, y: 30 },
  },
  {
    id: 'td',
    ten: 'Thủ Đức',
    moTa: 'Khu đô thị mới, campus',
    anh: '/properties/04.jpg',
    giaTu: 16_800_000,
    giaDen: 55_000_000,
    khach: 'Gia đình, giáo viên quốc tế, chuyên gia campus',
    dacDiem: ['Compound & công viên', 'Gần trường quốc tế', 'Townhouse sân vườn'],
    pin: { x: 72, y: 36 },
  },
  {
    id: 'q7',
    ten: 'Quận 7',
    moTa: 'Phú Mỹ Hưng, cộng đồng quốc tế',
    anh: '/properties/05.jpg',
    giaTu: 22_000_000,
    giaDen: 85_000_000,
    khach: 'Gia đình ngoại giao, penthouse Thủ Thiêm',
    dacDiem: ['Cộng đồng quốc tế', 'Penthouse sông', 'Concierge & quản gia'],
    pin: { x: 52, y: 72 },
  },
]

export const DICH_VU = [
  {
    id: 'leasing',
    tieu: 'Leasing desk',
    moTa: 'Ghép khách, soạn hợp đồng song ngữ, đặt cọc và bàn giao có biên bản.',
    anh: '/properties/living.jpg',
    diem: ['Lọc nhu cầu trước khi mở lịch xem', 'Hợp đồng 12 tháng, điều khoản gia hạn rõ', 'Biên bản bàn giao kèm ảnh và chỉ số'],
  },
  {
    id: 'asset',
    tieu: 'Quản lý tài sản',
    moTa: 'Checklist 42 mục, bảo trì định kỳ, báo cáo occupancy cho chủ nhà.',
    anh: '/properties/interior.jpg',
    diem: ['Khảo sát hiện trạng trước khi nhận căn', 'Bảo trì theo lịch, không chờ sự cố', 'Báo cáo occupancy quý cho chủ nhà'],
  },
  {
    id: 'resident',
    tieu: 'Cổng cư dân',
    moTa: 'Hợp đồng, thông báo, đổi mật khẩu — vận hành như một property desk.',
    anh: '/properties/kitchen.jpg',
    diem: ['Hồ sơ thuê luôn mở trên cổng', 'Thông báo desk, không nhắn nhóm loạn', 'Concierge bảo trì trong giờ hành chính'],
  },
  {
    id: 'advisory',
    tieu: 'Tư vấn định giá',
    moTa: 'Niêm yết thống nhất, so sánh khu vực, gợi ý gia hạn trước 60 ngày.',
    anh: '/properties/office.jpg',
    diem: ['Đối chiếu occupancy cùng khu', 'Một mức giá trên mọi kênh', 'Nhắc gia hạn trước 60 ngày'],
  },
]

export const DOI_NGU = [
  {
    id: 'mai-chi',
    ten: 'Nguyễn Mai Chi',
    chucVu: 'Head of Leasing',
    khu: 'Quận 1 · Thủ Thiêm',
    anh: '/properties/office.jpg',
    email: 'chi@blackpanther.vn',
    nam: '12 năm',
    khuIds: ['q1', 'q7'],
    bio: 'Phụ trách quỹ prime CBD và penthouse. Lọc hồ sơ trước khi mở private viewing, không xếp lịch nhóm.',
  },
  {
    id: 'khoi-nguyen',
    ten: 'Trần Khôi Nguyên',
    chucVu: 'Senior Advisor',
    khu: 'Thảo Điền · Thủ Đức',
    anh: '/properties/living.jpg',
    email: 'nguyen@blackpanther.vn',
    nam: '9 năm',
    khuIds: ['td'],
    bio: 'Định giá compound, townhouse và căn 2 PN gần campus. Brief quý cho chủ nhà, không cắt giá lén trên kênh rao.',
  },
  {
    id: 'hoang-yen',
    ten: 'Lê Hoàng Yến',
    chucVu: 'Resident Manager',
    khu: 'Quận 3 · Bình Thạnh',
    anh: '/properties/interior.jpg',
    email: 'yen@blackpanther.vn',
    nam: '8 năm',
    khuIds: ['q3', 'bt'],
    bio: 'Bàn giao, bảo trì và cổng cư dân. Mọi work order đi qua desk — không nhắn nhóm loạn.',
  },
]

export const TUYEN_DUNG = [
  {
    id: 'leasing-officer',
    viTri: 'Leasing Officer',
    nhom: 'Desk',
    diaDiem: 'Nguyễn Huệ, Quận 1',
    loai: 'Toàn thời gian',
    tomTat: 'Ghép khách, dẫn xem nhà, soạn hợp đồng song ngữ. Quỹ nhỏ, mỗi officer chịu trách nhiệm căn từ viewing đến gia hạn.',
    yeuCau: ['3 năm môi giới hoặc leasing căn hộ dịch vụ', 'Tiếng Anh làm việc được với khách ngoại giao', 'Không chạy tin rao đại trà'],
  },
  {
    id: 'asset-analyst',
    viTri: 'Asset Analyst',
    nhom: 'Research',
    diaDiem: 'Nguyễn Huệ, Quận 1',
    loai: 'Toàn thời gian',
    tomTat: 'Viết market note, đối chiếu occupancy khu vực, đề xuất niêm yết. Brief nội bộ, không phải content marketing.',
    yeuCau: ['Am hiểu thuê Hà Nội 5 địa bàn Black Panther', 'Viết ngắn, có số, có hàm ý định giá', 'Excel / mô hình occupancy cơ bản'],
  },
  {
    id: 'resident-associate',
    viTri: 'Resident Associate',
    nhom: 'Operations',
    diaDiem: 'Xoay quỹ · Q1 / Thảo Điền',
    loai: 'Toàn thời gian',
    tomTat: 'Biên bản bàn giao, checklist 42 mục, concierge giờ hành chính. Tiếp xúc cư dân, không call center.',
    yeuCau: ['Kinh nghiệm property / hospitality', 'Cẩn thận biên bản và ảnh hiện trạng', 'Làm việc T2–T7 theo ca desk'],
  },
]

export const BAO_CHI_BAI = [
  {
    id: 'forbes',
    nguon: 'Forbes Vietnam',
    nam: '2025',
    tieu: 'Private leasing desks đang thay sàn rao ở phân khúc dịch vụ',
    trich: 'Black Panther giữ quỹ đủ nhỏ để một officer phụ trách từ xem nhà đến gia hạn — khác hẳn mô hình đăng ồ ạt.',
  },
  {
    id: 'savills',
    nguon: 'Savills Index',
    nam: '2025',
    tieu: 'Occupancy căn 1 PN CBD vẫn neo khi bàn giao chuẩn',
    trich: 'Khách chuyên gia chấp nhận premium nếu hợp đồng song ngữ, cọc rõ và biên bản điện nước đầy đủ.',
  },
  {
    id: 'knight',
    nguon: 'Knight Frank',
    nam: '2026',
    tieu: 'Penthouse Thủ Thiêm: vòng xem kéo dài, cọc phải chặt',
    trich: 'Private viewing sau khi lọc hồ sơ ngân sách là cách các desk uy tín bảo vệ vị thế quỹ prime.',
  },
  {
    id: 'cafeland',
    nguon: 'CaféLand',
    nam: '2026',
    tieu: 'Chủ nhà chọn độc quyền 12 tháng thay vì đa kênh',
    trich: 'Một mức giá trên mọi kênh giúp occupancy ổn định hơn cắt giá lén để lấp nhanh.',
  },
]

export const QUY_TRINH_THUE = [
  { so: '01', tieu: 'Lọc nhu cầu', moTa: 'Khu vực, ngân sách, số người, thời hạn ở. Desk không mở lịch nếu căn không khớp.' },
  { so: '02', tieu: 'Private viewing', moTa: 'Một officer dẫn xem. Penthouse chỉ mở sau khi lọc hồ sơ. Xác nhận trong 24 giờ.' },
  { so: '03', tieu: 'Hồ sơ & cọc', moTa: 'Hợp đồng song ngữ, cọc thường 2 tháng, điều khoản gia hạn trước 60 ngày.' },
  { so: '04', tieu: 'Bàn giao', moTa: 'Biên bản, ảnh, chỉ số điện nước. Cổng cư dân mở khi hợp đồng hiệu lực.' },
  { so: '05', tieu: 'Ở & gia hạn', moTa: 'Concierge bảo trì giờ hành chính. Desk nhắc gia hạn, không chờ trống căn.' },
]

export const LOI_KHACH = [
  { ten: 'Clara Bennett', vai: 'Cư dân The Marq', noi: 'Hợp đồng rõ, bàn giao đúng ảnh. Black Panther làm việc như private bank của nhà ở.' },
  { ten: 'Anh Minh Đức', vai: 'Chủ căn Empire City', noi: 'Không phải sàn rao. Một officer phụ trách từ xem nhà đến gia hạn, occupancy ổn định.' },
  { ten: 'Gia đình Sato', vai: 'Townhouse Thảo Điền', noi: 'Giấy tờ song ngữ, lịch xem nhà đúng giờ. Đúng chuẩn văn phòng leasing quốc tế.' },
  { ten: 'Léa Moreau', vai: 'Studio Pasteur', noi: 'Desk không đẩy căn không khớp. Xem một buổi, ký trong tuần — không inbox môi giới.' },
  { ten: 'Chị Lan Hương', vai: 'Chủ loft Bình Thạnh', noi: 'Báo cáo quý có số occupancy và bảo trì đã làm. Tôi không phải theo dõi tin rao.' },
  { ten: 'David Park', vai: 'Căn 2 PN Masteri', noi: 'Cổng cư dân đủ để xem hạn hợp đồng. Concierge trả lời trong giờ, không chatbot.' },
]

export const HUONG_DAN_O = [
  { so: '01', tieu: 'Trước ngày vào', moTa: 'Desk gửi biên bản mẫu, chỉ số điện nước gần nhất và hướng dẫn tòa. Cọc đã vào tài khoản chủ nhà trước khi giao chìa.' },
  { so: '02', tieu: 'Ngày bàn giao', moTa: 'Officer đi cùng. Chụp ảnh, ghi chỉ số, ký biên bản. Cổng cư dân mở khi hợp đồng hiệu lực.' },
  { so: '03', tieu: 'Tuần đầu', moTa: 'Báo desk nếu tiện nghi lệch hồ sơ. Work order bảo trì đi qua concierge, không nhắn nhóm tòa.' },
  { so: '04', tieu: 'Ở dài hạn', moTa: 'Thông báo khách lưu trú đêm cho quản lý tòa. Gia hạn trước 60 ngày — officer đề xuất mức cùng khu.' },
  { so: '05', tieu: 'Thanh lý', moTa: 'Hẹn kiểm tra hiện trạng, đối chiếu ảnh bàn giao, hoàn cọc trừ khấu trừ ghi trên biên bản.' },
]

export const BAO_CHI = ['Forbes VN', 'PropertyGuru', 'Savills Index', 'Knight Frank', 'CaféLand']

export const TIN_THI_TRUONG = [
  {
    id: 'note-q1',
    ngay: '2026-10-12',
    nhan: 'Market note',
    tieu: 'Quận 1: căn 1 PN dịch vụ vẫn hút chuyên gia nước ngoài',
    tomTat: 'Nhu cầu thuê 12 tháng quanh The Marq – Pasteur tăng, khách chấp nhận premium nếu bàn giao full nội thất.',
    anh: '/properties/01.jpg',
    noiDung: [
      'Leasing desk ghi nhận vòng xem nhà quanh The Marq và Pasteur kéo dài hơn quý trước. Khách chuyên gia 12 tháng chấp nhận premium 8–12% nếu căn bàn giao full nội thất, có biên bản và chỉ số điện nước rõ.',
      'Căn 1 PN dịch vụ hướng Đông Bắc lấp nhanh hơn căn view đường. Studio boutique Pasteur vẫn hút người độc thân làm việc CBD, miễn wifi ổn và giặt sấy tại chỗ.',
      'Hàm ý định giá: giữ niêm yết, không giảm cọc. Ưu tiên hợp đồng 12 tháng có điều khoản gia hạn 60 ngày thay vì cắt giá để lấp nhanh.',
    ],
  },
  {
    id: 'note-td',
    ngay: '2026-09-28',
    nhan: 'District brief',
    tieu: 'Thảo Điền – Thủ Đức: gia đình ưu tiên compound và trường',
    tomTat: 'Townhouse và căn 2 PN gần campus giữ tỷ lệ gia hạn cao. Giá niêm yết ổn định quý 3.',
    anh: '/properties/04.jpg',
    noiDung: [
      'Gia đình thuê Thảo Điền – Thủ Đức ưu tiên compound, chỗ để xe và khoảng cách tới trường quốc tế hơn là view sông. Townhouse sân vườn giữ tỷ lệ gia hạn trên 90% nếu bảo trì sân và máy lạnh đúng lịch.',
      'Căn 2 PN Vinhomes Grand Park và Masteri vẫn là hàng chạy cho hộ 3–4 người. Khách hỏi nhiều về smart home và chỗ gửi xe thứ hai.',
      'Hàm ý định giá: không tăng giá đột biến quý 4. Chủ nhà nên chốt gia hạn sớm thay vì để trống chờ khách mới trả cao hơn.',
    ],
  },
  {
    id: 'note-q7',
    ngay: '2026-09-04',
    nhan: 'Prime stock',
    tieu: 'Penthouse Thủ Thiêm: vòng xem nhà kéo dài, cọc chặt',
    tomTat: 'Khách yêu cầu wine cellar, concierge và hợp đồng quản gia. Black Panther chỉ mở lịch private viewing.',
    anh: '/properties/06.jpg',
    noiDung: [
      'Penthouse Thủ Thiêm không chạy theo lịch xem nhóm. Black Panther chỉ mở private viewing sau khi lọc hồ sơ: ngân sách, thời hạn ở, yêu cầu quản gia.',
      'Vòng xem kéo dài vì khách so sánh wine cellar, sân trời và chỗ đậu hầm. Cọc nên ghi rõ hoàn / giữ khi khách rút sau khi giữ chỗ.',
      'Hàm ý định giá: giữ mức premium. Không niêm yết song song trên kênh rao đại trà — làm loãng vị thế quỹ.',
    ],
  },
]

export const CAU_HOI = [
  { nhom: 'Thuê căn', q: 'Phí niêm yết đã gồm những gì?', a: 'Giá tháng đã gồm phí quản lý tòa nhà. Điện, nước, internet và gửi xe tính theo bảng dịch vụ gắn trên hợp đồng.' },
  { nhom: 'Thuê căn', q: 'Đặt cọc bao nhiêu?', a: 'Thông thường bằng 2 tháng tiền thuê, giữ đến khi thanh lý và đối chiếu biên bản bàn giao.' },
  { nhom: 'Thuê căn', q: 'Xem nhà mất bao lâu để xác nhận?', a: 'Leasing desk xác nhận khung giờ trong 24 giờ làm việc. Penthouse chỉ mở private viewing.' },
  { nhom: 'Chủ nhà', q: 'Black Panther nhận mọi căn?', a: 'Không. Căn phải đạt pháp lý, hiện trạng và vị trí. Chủ nhà ký độc quyền leasing tối thiểu 12 tháng.' },
  { nhom: 'Chủ nhà', q: 'Báo cáo occupancy gửi thế nào?', a: 'Desk gửi brief quý: tỷ lệ lấp, bảo trì đã làm, đề xuất gia hạn. Không spam tin rao.' },
  { nhom: 'Cư dân', q: 'Cổng cư dân dùng để làm gì?', a: 'Xem hồ sơ thuê, thông báo desk, gửi concierge và đổi mật khẩu. Không thay thế việc khẩn cấp ngoài giờ.' },
  { nhom: 'Cư dân', q: 'Gia hạn cần báo trước bao lâu?', a: 'Trước 60 ngày hết hạn. Officer phụ trách căn sẽ đề xuất mức giá cùng khu.' },
]

export const DIEU_KHOAN = [
  { tieu: 'Niêm yết', doan: 'Giá và mô tả trên website phản ánh hồ sơ đo đạc Black Panther tại thời điểm đăng. Căn có thể đổi trạng thái (trống, đặt cọc, bảo trì) mà không báo trước trên mọi kênh.' },
  { tieu: 'Xem nhà', doan: 'Lịch xem là đề xuất, desk xác nhận theo giờ hành chính. Khách không được quay phim nội thất để đăng lại nếu chưa được chủ nhà và Black Panther đồng ý.' },
  { tieu: 'Dữ liệu liên hệ', doan: 'Họ tên, điện thoại, email gửi qua form enquire chỉ dùng để leasing desk gọi lại. Không bán danh sách cho bên thứ ba.' },
  { tieu: 'Cổng thành viên', doan: 'Tài khoản Owner, Leasing và Resident do Black Panther cấp. Cư dân không chia sẻ phiên đăng nhập với người ở cùng.' },
]

export const LISTINGS = [
  {
    id: 'mc-river-01',
    ma: 'RIVER-1208',
    tieuDe: 'Riverfront Suite tại The Marq',
    khuVuc: 'q1',
    diaChi: 'The Marq, 29B Nguyễn Đình Chiểu, Quận 1',
    loai: 'Căn hộ dịch vụ',
    phongNgu: 1,
    phongTam: 1,
    dienTich: 52,
    tang: 12,
    gia: 28_000_000,
    datCoc: 56_000_000,
    trangThai: 'trong',
    noiBat: true,
    pin: { x: 40, y: 50 },
    anh: ['/properties/01.jpg', '/properties/living.jpg', '/properties/kitchen.jpg'],
    tienNghi: ['Ban công sông', 'Bếp đầy đủ', 'Máy giặt', 'Gym & hồ bơi', 'An ninh 24/7'],
    moTa: 'Căn góc hướng Đông Bắc, ánh sáng tự nhiên cả ngày. Nội thất gỗ sồi, trần cao 3,1 m. Phù hợp chuyên gia nước ngoài hoặc cặp đôi làm việc tại trung tâm.',
  },
  {
    id: 'mc-atelier-02',
    ma: 'ATELIER-805',
    tieuDe: 'Atelier Loft Nguyễn Thị Minh Khai',
    khuVuc: 'q3',
    diaChi: '805 Nguyễn Thị Minh Khai, Quận 3',
    loai: 'Loft',
    phongNgu: 1,
    phongTam: 1,
    dienTich: 68,
    tang: 8,
    gia: 22_500_000,
    datCoc: 45_000_000,
    trangThai: 'trong',
    noiBat: true,
    pin: { x: 30, y: 42 },
    anh: ['/properties/02.jpg', '/properties/interior.jpg'],
    tienNghi: ['Trần cao 4 m', 'Góc làm việc', 'Điều hòa inverter', 'Thang máy riêng'],
    moTa: 'Loft cải tạo từ tòa văn phòng cũ, giữ kết cấu bê tông lộ. Lý tưởng cho designer, photographer cần không gian mở.',
  },
  {
    id: 'mc-garden-03',
    ma: 'GARDEN-B2',
    tieuDe: 'Garden Residence Vinhomes',
    khuVuc: 'td',
    diaChi: 'Vinhomes Grand Park, Thủ Đức',
    loai: 'Căn hộ 2 PN',
    phongNgu: 2,
    phongTam: 2,
    dienTich: 76,
    tang: 18,
    gia: 16_800_000,
    datCoc: 33_600_000,
    trangThai: 'da_dat_coc',
    noiBat: true,
    pin: { x: 70, y: 34 },
    anh: ['/properties/04.jpg', '/properties/07.jpg'],
    tienNghi: ['Công viên 36 ha', 'Trường quốc tế', '2 chỗ xe', 'Smart home'],
    moTa: 'Căn 2 phòng ngủ đã hoàn thiện full nội thất Nhật. View công viên trung tâm, phù hợp gia đình nhỏ.',
  },
  {
    id: 'mc-sky-04',
    ma: 'SKY-PH01',
    tieuDe: 'Sky Penthouse Empire City',
    khuVuc: 'q7',
    diaChi: 'Empire City, Thủ Thiêm, TP. Thủ Đức',
    loai: 'Penthouse',
    phongNgu: 3,
    phongTam: 3,
    dienTich: 168,
    tang: 38,
    gia: 85_000_000,
    datCoc: 170_000_000,
    trangThai: 'trong',
    noiBat: true,
    pin: { x: 54, y: 70 },
    anh: ['/properties/06.jpg', '/properties/hero.jpg', '/properties/08.jpg'],
    tienNghi: ['Sân trời riêng', 'Wine cellar', 'Bếp đảo', 'Concierge', '2 chỗ đậu hầm B1'],
    moTa: 'Penthouse duplex với tầm nhìn toàn cảnh sông Sài Gòn. Black Panther vận hành leasing và quản gia theo gói năm.',
  },
  {
    id: 'mc-studio-05',
    ma: 'STUDIO-310',
    tieuDe: 'Studio Maison trên đường Pasteur',
    khuVuc: 'q1',
    diaChi: 'Maison Pasteur, 48 Pasteur, Quận 1',
    loai: 'Studio',
    phongNgu: 0,
    phongTam: 1,
    dienTich: 32,
    tang: 3,
    gia: 12_900_000,
    datCoc: 25_800_000,
    trangThai: 'trong',
    noiBat: false,
    pin: { x: 36, y: 54 },
    anh: ['/properties/09.jpg', '/properties/kitchen.jpg'],
    tienNghi: ['Giường Murphy', 'Bếp nhỏ', 'Wifi 300 Mbps', 'Giặt sấy tầng 1'],
    moTa: 'Studio boutique trong shophouse Pháp thuộc. Đi bộ 6 phút tới Nhà hát Thành phố.',
  },
  {
    id: 'mc-family-06',
    ma: 'FAMILY-15A',
    tieuDe: 'Townhouse sân vườn Thảo Điền',
    khuVuc: 'td',
    diaChi: '15A Quốc Hương, Thảo Điền',
    loai: 'Nhà phố',
    phongNgu: 4,
    phongTam: 4,
    dienTich: 220,
    tang: 3,
    gia: 55_000_000,
    datCoc: 110_000_000,
    trangThai: 'trong',
    noiBat: false,
    pin: { x: 76, y: 42 },
    anh: ['/properties/05.jpg', '/properties/living.jpg'],
    tienNghi: ['Sân vườn 40 m²', 'Phòng làm việc', 'Bếp ngoài trời', 'Garage 2 xe'],
    moTa: 'Nhà phố 3 tầng hướng Nam, khu compound yên tĩnh. Black Panther hỗ trợ hợp đồng dài hạn cho gia đình ngoại giao.',
  },
  {
    id: 'mc-river-07',
    ma: 'RIVER-604',
    tieuDe: 'Căn 2 PN Masteri Thảo Điền',
    khuVuc: 'td',
    diaChi: 'Masteri Thảo Điền, Xa lộ Hà Nội',
    loai: 'Căn hộ 2 PN',
    phongNgu: 2,
    phongTam: 2,
    dienTich: 70,
    tang: 6,
    gia: 18_500_000,
    datCoc: 37_000_000,
    trangThai: 'trong',
    noiBat: false,
    pin: { x: 66, y: 38 },
    anh: ['/properties/03.jpg', '/properties/07.jpg'],
    tienNghi: ['Metro gần nhà', 'Hồ bơi vô cực', 'Nội thất IKEA+', 'Ban công Đông'],
    moTa: 'Căn đã bàn giao, sẵn sàng vào ở. Hợp đồng 12 tháng, gia hạn linh hoạt.',
  },
  {
    id: 'mc-office-08',
    ma: 'LIVE-902',
    tieuDe: 'Live-work loft Bình Thạnh',
    khuVuc: 'bt',
    diaChi: '902 Xô Viết Nghệ Tĩnh, Bình Thạnh',
    loai: 'Live-work',
    phongNgu: 1,
    phongTam: 1,
    dienTich: 85,
    tang: 9,
    gia: 19_800_000,
    datCoc: 39_600_000,
    trangThai: 'bao_tri',
    noiBat: false,
    pin: { x: 50, y: 28 },
    anh: ['/properties/08.jpg', '/properties/office.jpg'],
    tienNghi: ['Zone họp 4 người', 'Cách âm', 'Fiber 1 Gbps', 'Terrace'],
    moTa: 'Đang hoàn thiện sàn gỗ mới. Nhận booking từ tháng sau. Phù hợp founder cần vừa ở vừa meeting khách.',
  },
]

export function listingTheoId(id) {
  return LISTINGS.find((x) => x.id === id)
}

export function doiNguTheoId(id) {
  return DOI_NGU.find((x) => x.id === id)
}

export function jobTheoId(id) {
  return TUYEN_DUNG.find((x) => x.id === id)
}

export function listingsTheoAdvisor(p) {
  const ids = p?.khuIds || []
  return LISTINGS.filter((x) => ids.includes(x.khuVuc))
}

export function khuVucTheoId(id) {
  return KHU_VUC.find((x) => x.id === id)
}

export function tinTheoId(id) {
  return TIN_THI_TRUONG.find((x) => x.id === id)
}

export function dichVuTheoId(id) {
  return DICH_VU.find((x) => x.id === id)
}

export function locListings({ khuVuc, loai, giaDen, keyword, phongNgu } = {}) {
  const q = (keyword || '').trim().toLowerCase()
  return LISTINGS.filter((x) => {
    if (khuVuc && x.khuVuc !== khuVuc) return false
    if (loai && x.loai !== loai) return false
    if (giaDen && x.gia > Number(giaDen)) return false
    if (phongNgu !== '' && phongNgu != null) {
      const pn = Number(phongNgu)
      if (pn >= 3) {
        if (x.phongNgu < 3) return false
      } else if (x.phongNgu !== pn) return false
    }
    if (q) {
      const hay = `${x.tieuDe} ${x.diaChi} ${x.ma} ${x.loai}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export function listingsTuongTu(item, gioiHan = 3) {
  return LISTINGS.filter((x) => x.id !== item.id && (x.khuVuc === item.khuVuc || x.loai === item.loai)).slice(0, gioiHan)
}

export const LOAI_CAN = [...new Set(LISTINGS.map((x) => x.loai))]


