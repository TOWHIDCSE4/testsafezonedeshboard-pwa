export const bodyUpdateRestricted = {
  enabled: false,
  limit: {
    monday: [
      {
        limitFrom: '08:00',
        limitTo: '16:00',
      },
      {
        limitFrom: '00:00',
        limitTo: '06:00',
      },
    ],
    tuesday: [
      {
        limitFrom: '08:00',
        limitTo: '16:00',
      },
    ],
    wednesday: [
      {
        limitFrom: '08:00',
        limitTo: '16:00',
      },
    ],
    thursday: [
      {
        limitFrom: '08:00',
        limitTo: '16:00',
      },
    ],
    friday: [
      {
        limitFrom: '08:00',
        limitTo: '16:00',
      },
    ],
    saturday: [
      {
        limitFrom: '08:00',
        limitTo: '16:00',
      },
    ],
    sunday: [
      {
        limitFrom: '08:00',
        limitTo: '16:00',
      },
    ],
  },
  triggers: {
    timesup: {
      lockNavigation: true,
      lockDevice: false,
      alertMe: true,
    },
  },
};

export const premiumFeatures = [
  {
    title: 'Đặt giới hạn thời gian và hoạt động',
    subtitle:
      'Tạo thói quen sử dụng thiết bị cho từng người trong gia đình bạn trên các thiết bị và trên mỗi ứng dụng.',
    icon: 'o_schedule',
  },
  {
    title: 'Chặn các ứng dụng và website độc hại',
    subtitle:
      'Bảo vệ không giới hạn đối với các trò chơi, ứng dụng và nội dung trực tuyến không phù hợp bao gồm cờ bạc và khiêu dâm.',
    icon: 'o_phonelink_lock',
  },
  {
    title: 'Báo cáo hoạt động',
    subtitle:
      'Truy cập theo yêu cầu vào tất cả các hoạt động trực tuyến của thành viên. Cộng với một bản tóm tắt email chi tiết, hàng ngày hoặc hàng tuần.',
    icon: 'o_lock',
  },
  {
    title: 'Cảnh báo theo thời gian thực',
    subtitle:
      'Nhận thông báo khi thành viên sử dụng một ứng dụng mới, đạt đến giới hạn thời gian, truy cập nội dung người lớn hoặc cần trợ giúp.',
    icon: 'o_error_outline',
  },
  {
    title: 'Theo dõi vị trí',
    subtitle:
      'Định vị địa lý: Xem vị trí của tất cả các thành viên gia đình bạn trên bản đồ và nhận thông báo khi họ đến hoặc rời khỏi những địa điểm được chỉ định. Có sẵn cho Android và iOS.',
    icon: 'o_place',
  },
  {
    title: 'Theo dõi tin nhắn',
    subtitle:
      'Xem thành viên gọi điện hoặc nhắn tin cho ai, khi nào, đồng thời chặn các tin nhắn đến. Có sẵn cho Android.',
    icon: 'o_sms',
  },
  {
    title: 'Youtube',
    subtitle:
      'Biết những gì thành viên xem và tìm kiếm trên YouTube. Có sẵn cho Android (web và ứng dụng), iOS, Windows & Mac (web).',
    icon: 'o_ondemand_video',
  },
];
