import { Issue } from '../types/issue';

export const DEFAULT_ISSUES: Issue[] = [
  // --- IPHONE / IOS ---
  {
    id: 'iphone-passcode-forgotten',
    title: 'Cách xử lý khi quên mật khẩu iPhone (Passcode)',
    platform: 'iphone',
    category: 'security',
    severity: 'medium',
    estimatedTime: '10 - 15 phút',
    summary: 'Hướng dẫn khôi phục và mở khóa iPhone khi bị quên mật khẩu màn hình hoặc máy báo "iPhone không khả dụng" mà không làm hư hại thiết bị.',
    symptoms: [
      'Màn hình hiện thông báo "iPhone không khả dụng" hoặc "Security Lockout"',
      'Bị đếm ngược thời gian thử lại: 1 phút, 5 phút, 15 phút, 1 giờ',
      'Không thể truy cập vào màn hình chính'
    ],
    causes: [
      'Nhập sai mật khẩu màn hình quá 5 lần liên tiếp',
      'Đổi mật khẩu mới nhưng không nhớ chính xác',
      'Trẻ em hoặc người khác bấm loạn phím số trên màn hình khóa'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Sử dụng tính năng "Xóa iPhone" trực tiếp (iOS 15.2 trở lên)',
        instructions: 'Khi nhập sai đến khi máy hiện "iPhone không khả dụng" hoặc "Khóa bảo mật", nhìn xuống góc dưới bên phải màn hình sẽ có nút "Xóa iPhone" (Erase iPhone). Nhấn vào nút này, sau đó nhập mật khẩu tài khoản Apple ID (iCloud) đang đăng nhập trên máy để xác nhận xóa toàn bộ dữ liệu và mật khẩu.',
        tip: 'Cách này không cần cắm vào máy tính, chỉ yêu cầu iPhone có kết nối mạng Wi-Fi hoặc 4G/5G.',
        warning: 'Mọi dữ liệu trên máy sẽ được xóa về trạng thái ban đầu. Bạn có thể khôi phục lại dữ liệu từ bản sao lưu iCloud sau khi cài đặt lại.'
      },
      {
        stepNumber: 2,
        title: 'Mở khóa từ xa bằng iCloud Tìm (Find My)',
        instructions: 'Dùng một thiết bị khác (điện thoại hoặc máy tính) truy cập trang web iCloud.com/find. Đăng nhập Apple ID của chiếc iPhone đó, chọn "Tất cả thiết bị" > chọn chiếc iPhone bị khóa > nhấn "Xóa iPhone" (Erase iPhone). Khi iPhone kết nối mạng, máy sẽ tự động xóa mật khẩu.',
        tip: 'Cách này cực kỳ hữu ích khi bạn không có máy tính bên cạnh.'
      },
      {
        stepNumber: 3,
        title: 'Đưa máy về Chế độ Khôi phục (Recovery Mode) qua máy tính',
        instructions: 'Nếu máy không có mạng hoặc không hiện nút Xóa: Cắm cáp kết nối iPhone với máy tính có cài iTunes hoặc Finder (trên Mac). Đưa iPhone về Recovery Mode:\n- iPhone 8 trở lên: Bấm thả Nhanh Tăng âm lượng > Bấm thả Nhanh Giảm âm lượng > Nhấn và giữ nút Nguồn cho đến khi màn hình hiện biểu tượng sợi cáp và máy tính.\nTrên máy tính sẽ xuất hiện thông báo: chọn "Khôi phục" (Restore).',
        warning: 'Giữ kết nối cáp liên tục trong suốt quá trình tải firmware và nạp lại hệ điều hành.'
      }
    ],
    requiredTools: ['Apple ID & Mật khẩu', 'Máy tính có cài iTunes/Finder (nếu dùng cáp)', 'Cáp sạc chính hãng'],
    tags: ['iphone', 'quên mật khẩu', 'passcode', 'khóa màn hình', 'ios', 'apple id', 'restore'],
    sourceUrl: 'https://www.thegioididong.com/tin-tuc/nhung-loi-iphone-thuong-gap-1456405',
    author: 'Kỹ thuật viên Apple Care',
    createdAt: '2026-03-01',
    helpfulCount: 342
  },
  {
    id: 'iphone-check-genuine-parts',
    title: 'Cách kiểm tra linh kiện iPhone chính hãng & lịch sử sửa chữa',
    platform: 'iphone',
    category: 'hardware',
    severity: 'easy',
    estimatedTime: '3 - 5 phút',
    summary: 'Cách kiểm tra xem iPhone đã từng bị thay màn hình, thay pin hay camera chưa, và linh kiện đó có phải đồ chính hãng Apple hay hàng linh kiện trôi nổi.',
    symptoms: [
      'Máy có hiện tượng hao pin bất thường hoặc không hiện phần trăm dung lượng tối đa',
      'Màn hình mất tính năng True Tone trong Trung tâm điều khiển',
      'Xuất hiện thông báo lạ trong phần Cài đặt'
    ],
    causes: [
      'Mua iPhone cũ qua tay hoặc từ cửa hàng chưa rõ uy tín',
      'Máy đã qua sửa chữa, thay thế vỏ, màn hình lô hoặc pin kích'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Kiểm tra mục "Lịch sử linh kiện và dịch vụ" (iOS 15.2+)',
        instructions: 'Mở Cài đặt (Settings) > Cài đặt chung (General) > Giới thiệu (About). Nếu máy đã từng thay thế linh kiện, mục "Lịch sử linh kiện và dịch vụ" (Parts and Service History) sẽ tự động hiển thị bên dưới số sê-ri:\n- Nếu hiện "Linh kiện chính hãng của Apple" (Genuine Apple Part): Linh kiện đã được thay thế chính hãng chuẩn xác.\n- Nếu hiện "Linh kiện không xác định" (Unknown Part) kèm dấu chấm than tam giác: Linh kiện đã bị thay thế bằng hàng không chính hãng hoặc linh kiện lấy từ máy khác không được ghép đôi.',
        tip: 'Đối với iPhone XR, XS trở lên kiểm tra được Pin; iPhone 11 trở lên kiểm tra thêm Màn hình; iPhone 12 trở lên kiểm tra thêm cụm Camera.'
      },
      {
        stepNumber: 2,
        title: 'Kiểm tra tính năng True Tone của màn hình',
        instructions: 'Vuốt mở Trung tâm điều khiển (Control Center) > Nhấn giữ thanh điều chỉnh độ sáng màn hình. Kiểm tra góc dưới bên phải xem có biểu tượng "True Tone" hay không. Nếu bị mất biểu tượng True Tone hoặc bật lên nhưng màu sắc màn hình không thay đổi theo môi trường, khả năng rất cao màn hình đã bị thay và chưa được chép mã serial IC.',
      },
      {
        stepNumber: 3,
        title: 'Kiểm tra Tình trạng Pin trong Cài đặt',
        instructions: 'Vào Cài đặt > Pin > Tình trạng pin & Sạc. Nếu mục "Dung lượng tối đa" hiện dấu gạch ngang (--) hoặc kèm thông báo bảo trì "Không thể xác minh iPhone này có pin Apple chính hãng", pin đã bị can thiệp thay thế.',
      },
      {
        stepNumber: 4,
        title: 'Sử dụng phần mềm chuyên sâu 3uTools trên máy tính (Tùy chọn)',
        instructions: 'Kết nối iPhone với máy tính qua phần mềm 3uTools, nhấn vào mục "View Verification Report" (Xem báo cáo xác minh). Phần mềm sẽ đối chiếu mã serial gốc xuất xưởng của bo mạch chủ, camera trước/sau, màn hình, cảm ứng Touch ID/Face ID và pin. Mục nào hiện màu xanh lá là nguyên bản, màu đỏ là đã bị tráo đổi.',
        tip: 'Nên kết hợp kiểm tra cả ngoại quan (ốc đít có bị toét hay không, viền gioăng cao su kháng nước).'
      }
    ],
    requiredTools: ['iPhone chạy iOS 15.2 trở lên', 'Máy tính cài 3uTools (tùy chọn)'],
    tags: ['iphone', 'check linh kiện', 'linh kiện chính hãng', 'pin', 'màn hình', 'camera', 'true tone', '3utools'],
    sourceUrl: 'https://www.thegioididong.com/tin-tuc/nhung-loi-iphone-thuong-gap-1456405',
    author: 'Chuyên gia thẩm định iPhone',
    createdAt: '2026-03-02',
    helpfulCount: 512
  },
  {
    id: 'iphone-bootloop-apple-logo',
    title: 'iPhone bị treo logo Apple (Treo Táo / Bootloop)',
    platform: 'iphone',
    category: 'system',
    severity: 'hard',
    estimatedTime: '15 - 30 phút',
    summary: 'Cách xử lý triệt để khi iPhone khởi động lại liên tục chỉ hiện quả Táo cắn dở rồi tắt ngúm hoặc sáng màn hình mờ.',
    symptoms: [
      'Máy khởi động lên logo Apple khoảng 10-20 giây rồi tự tắt hoặc khởi động lại',
      'Màn hình nhấp nháy logo liên tục không thể vào màn hình khóa',
      'Máy nóng lên xung quanh vùng vi xử lý'
    ],
    causes: [
      'Bộ nhớ trong bị đầy 100% dẫn đến hệ thống iOS không đủ dung lượng ghi tệp tạm',
      'Lỗi khi đang cập nhật phần mềm OTA bị gián đoạn mạng hoặc hết pin',
      'Xung đột dữ liệu hệ điều hành hoặc lỗi phần cứng (hở chân IC ổ cứng / đường cáp loa trong)'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Thực hiện khởi động lại cưỡng bức (Hard Reset)',
        instructions: 'Thực hiện thao tác bấm nút theo từng dòng máy:\n- iPhone 8, X, 11, 12, 13, 14, 15, 16: Nhấn và nhả nhanh phím Tăng âm lượng > Nhấn và nhả nhanh phím Giảm âm lượng > Nhấn và GIỮ phím Nguồn (phím sườn) trong khoảng 15-20 giây cho đến khi màn hình tắt hẳn và quả Táo xuất hiện trở lại mới thả tay.\n- iPhone 7/7 Plus: Nhấn giữ đồng thời phím Nguồn + Giảm âm lượng.\n- iPhone 6s trở về trước: Nhấn giữ phím Nguồn + phím Home.',
        tip: 'Khoảng 60% trường hợp treo táo nhẹ sẽ tự khôi phục sau khi Hard Reset.'
      },
      {
        stepNumber: 2,
        title: 'Cập nhật lại iOS qua máy tính (Giữ nguyên dữ liệu)',
        instructions: 'Cắm cáp kết nối iPhone với máy tính. Thực hiện thao tác phím ở Bước 1 nhưng GIỮ PHÍM NGUỒN LIÊN TỤC cho đến khi máy hiện biểu tượng dây cáp và chiếc máy tính (màn hình Recovery Mode). Trên máy tính, iTunes/Finder sẽ hiện bảng thông báo hỏi: CHỌN "CẬP NHẬT" (Update), TUYỆT ĐỐI KHÔNG CHỌN "Khôi phục" (Restore) vì Restore sẽ xóa sạch dữ liệu.',
        tip: 'Hệ thống sẽ tự động tải phiên bản iOS mới nhất về và nạp đè lên phân vùng hệ thống để sửa lỗi tệp tin hỏng.'
      },
      {
        stepNumber: 3,
        title: 'Xử lý trường hợp treo do đầy bộ nhớ',
        instructions: 'Nếu máy báo không đủ dung lượng để cập nhật, bạn cần sử dụng phần mềm hỗ trợ sửa chữa hệ thống như 3uTools ở chế độ "Retain User\'s Data Flash". Nếu vẫn không thành công, bắt buộc phải chọn Khôi phục xuất xưởng (Restore).',
        warning: 'Nếu đã Restore nhưng máy vẫn báo lỗi số 4013, 9 hoặc 14, đây là dấu hiệu hỏng phần cứng (thường do cáp loa trong bị ẩm hoặc hỏng cảm biến tiệm cận).'
      }
    ],
    requiredTools: ['Cáp Lightning/Type-C chính hãng', 'Máy tính PC có iTunes hoặc MacBook'],
    tags: ['iphone', 'treo táo', 'bootloop', 'hard reset', 'recovery mode', 'lỗi 4013', 'ios update'],
    sourceUrl: 'https://www.thegioididong.com/tin-tuc/nhung-loi-iphone-thuong-gap-1456405',
    author: 'Kỹ thuật viên Phần mềm',
    createdAt: '2026-03-03',
    helpfulCount: 428
  },
  {
    id: 'iphone-touch-unresponsive',
    title: 'iPhone bị đơ, loạn cảm ứng hoặc không nhận thao tác vuốt',
    platform: 'iphone',
    category: 'screen',
    severity: 'easy',
    estimatedTime: '5 phút',
    summary: 'Khắc phục nhanh tình trạng màn hình iPhone nhảy lung tung (Ghost Touch) hoặc bị liệt đơ cảm ứng ở một vùng.',
    symptoms: [
      'Màn hình tự động nhảy ứng dụng mà không ai chạm vào',
      'Vuốt thanh điều hướng hoặc gõ bàn phím bị trễ hoặc lệch vị trí',
      'Màn hình đơ cứng hoàn toàn khi vừa cắm sạc'
    ],
    causes: [
      'Kính cường lực bị nứt, bám mồ hôi hoặc có bong bóng khí gây loạn điện dung',
      'Củ sạc hoặc cáp sạc kém chất lượng gây dòng điện rò',
      'Ứng dụng bị xung đột hoặc bộ nhớ tạm quá tải'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Rút sạc ngay lập tức và kiểm tra bề mặt',
        instructions: 'Nếu hiện tượng loạn cảm ứng chỉ xảy ra khi cắm sạc, hãy rút củ sạc ra ngay. Dòng điện rò từ củ sạc kém chất lượng không có IC ổn áp sẽ làm sai lệch xung điện từ trên tấm cảm ứng.',
        tip: 'Luôn sử dụng củ sạc chuẩn MFi hoặc của các thương hiệu uy tín (Apple, Anker, Belkin, Ugreen).'
      },
      {
        stepNumber: 2,
        title: 'Vệ sinh màn hình và gỡ thử miếng dán cường lực',
        instructions: 'Dùng khăn vi sợi chuyên dụng tẩm một chút cồn y tế 70 độ để lau sạch dầu mỡ, mồ hôi trên màn hình. Nếu góc cạnh kính cường lực bị nứt mẻ hoặc bong keo, hãy nhẹ nhàng bóc kính cường lực ra để kiểm tra cảm ứng nguyên bản.',
      },
      {
        stepNumber: 3,
        title: 'Khởi động lại cưỡng bức máy',
        instructions: 'Bấm nhanh Tăng âm lượng > Bấm nhanh Giảm âm lượng > Giữ phím Nguồn cho đến khi hiện logo Apple. Thao tác này sẽ làm mới bộ nhớ đệm cảm ứng của chip IC màn hình.',
      }
    ],
    requiredTools: ['Khăn lau microfiber mềm', 'Cồn y tế 70 độ'],
    tags: ['iphone', 'loạn cảm ứng', 'đơ màn hình', 'ghost touch', 'sạc rò điện', 'kính cường lực'],
    sourceUrl: 'https://www.thegioididong.com/tin-tuc/nhung-loi-iphone-thuong-gap-1456405',
    author: 'Bảo hành Di Động',
    createdAt: '2026-03-04',
    helpfulCount: 295
  },
  {
    id: 'iphone-no-sim-error',
    title: 'iPhone báo "Không có thẻ SIM" (No SIM) hoặc "Lỗi thẻ SIM"',
    platform: 'iphone',
    category: 'network',
    severity: 'easy',
    estimatedTime: '3 - 5 phút',
    summary: 'Cách xử lý nhanh khi iPhone đột ngột mất sóng, không nhận SIM vật lý hoặc eSIM.',
    symptoms: [
      'Thanh trạng thái hiện chữ "Không có thẻ SIM" hoặc biểu tượng dấu chấm than',
      'Không thể nghe gọi, nhận tin nhắn SMS hay bật dữ liệu di động 4G',
      'Máy liên tục nhảy sang trạng thái "Đang tìm kiếm..."'
    ],
    causes: [
      'Chân tiếp xúc lá đồng trên SIM bị oxy hóa hoặc bám bụi bẩn',
      'Khay SIM bị cong vênh làm lỏng chân tiếp xúc',
      'Xung đột cấu hình nhà mạng hoặc lỗi modem sóng baseband'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Bật và tắt Chế độ máy bay (Airplane Mode)',
        instructions: 'Vuốt mở Control Center, bấm vào biểu tượng Máy bay để bật lên, chờ khoảng 10 giây rồi bấm tắt đi để buộc iPhone quét lại sóng mạng và nhận diện lại khe cắm SIM.',
      },
      {
        stepNumber: 2,
        title: 'Tháo thẻ SIM và vệ sinh mặt đồng',
        instructions: 'Dùng que chọc SIM chính xác cắm vào lỗ chọc SIM để đẩy khay SIM ra. Lấy thẻ SIM ra kiểm tra mặt tiếp xúc đồng có vết ố hay xước nặng không. Dùng cục tẩy bút chì (gôm) chà nhẹ lên bề mặt lá đồng để đánh bay lớp oxy hóa, sau đó lau sạch bụi và lắp lại đúng chiều khay SIM.',
        tip: 'Khay SIM có gioăng cao su chống nước, hãy kiểm tra gioăng không bị rách hay lệch ra ngoài.'
      },
      {
        stepNumber: 3,
        title: 'Đặt lại cài đặt mạng (Reset Network Settings)',
        instructions: 'Vào Cài đặt > Cài đặt chung > Chuyển hoặc đặt lại iPhone > Đặt lại > chọn "Đặt lại cài đặt mạng". Thao tác này sẽ xóa các cấu hình mạng APN và mật khẩu Wi-Fi bị lỗi mà không làm mất ảnh hay ứng dụng của bạn.',
      }
    ],
    requiredTools: ['Que chọc SIM', 'Gôm tẩy bút chì', 'Khăn lau'],
    tags: ['iphone', 'không có sim', 'no sim', 'mất sóng', 'khay sim', 'đặt lại cài đặt mạng'],
    sourceUrl: 'https://www.thegioididong.com/tin-tuc/nhung-loi-iphone-thuong-gap-1456405',
    author: 'Kỹ thuật viên Mạng Viễn Thông',
    createdAt: '2026-03-05',
    helpfulCount: 210
  },

  // --- ANDROID ---
  {
    id: 'android-frozen-unresponsive',
    title: 'Điện thoại Android bị đơ, treo cứng màn hình không thao tác được',
    platform: 'android',
    category: 'system',
    severity: 'easy',
    estimatedTime: '3 phút',
    summary: 'Cách xử lý tức thì khi điện thoại Samsung, Xiaomi, OPPO, Realme bị đứng hình, không bấm được phím ảo lẫn nút cảm ứng.',
    symptoms: [
      'Màn hình đứng im ở một ứng dụng hoặc giao diện màn hình chính',
      'Bấm nút Nguồn màn hình không tắt, nút Tăng Giảm âm lượng không phản hồi',
      'Máy có dấu hiệu nóng lên ở mặt lưng'
    ],
    causes: [
      'Tràn bộ nhớ RAM do mở quá nhiều tác vụ nặng cùng lúc',
      'Ứng dụng bên thứ ba bị crash ngầm ở vòng lặp vô tận',
      'Bộ nhớ trong còn dưới 1GB khiến hệ điều hành Android bị khóa I/O'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Thực hiện khởi động lại cưỡng bức bằng tổ hợp phím',
        instructions: 'Tùy theo hãng điện thoại, nhấn giữ tổ hợp phím sau trong 10 đến 15 giây liên tục (không thả tay khi màn hình tối, chỉ thả khi rung lên và hiện logo hãng):\n- Samsung: Nhấn giữ đồng thời nút Nguồn + Giảm âm lượng trong 10 giây.\n- Xiaomi / Redmi / POCO: Nhấn giữ nút Nguồn trong khoảng 15 giây.\n- OPPO / Realme / OnePlus: Nhấn giữ nút Nguồn + Tăng âm lượng trong 10 giây.\n- Vivo: Nhấn giữ nút Nguồn + Giảm âm lượng.',
        tip: 'Thao tác này tương đương việc tháo pin ra lắp lại ở các dòng điện thoại nắp lưng ngày xưa, hoàn toàn an toàn cho dữ liệu.'
      },
      {
        stepNumber: 2,
        title: 'Khởi động vào Chế độ an toàn (Safe Mode) để kiểm tra',
        instructions: 'Nếu máy vừa mở lên lại tiếp tục bị treo: Tắt nguồn máy, sau đó nhấn giữ nút Nguồn để bật. Khi logo máy xuất hiện, thả nút Nguồn ra và lập tức nhấn giữ nút Giảm âm lượng cho đến khi máy vào được màn hình chính. Ở góc dưới cùng bên trái sẽ hiện chữ "Chế độ an toàn" (Safe Mode).\nỞ chế độ này mọi app tải về sẽ bị vô hiệu hóa. Nếu máy chạy mượt, hãy gỡ ngay các ứng dụng vừa cài đặt gần đây.',
        tip: 'Để thoát Safe Mode, chỉ cần khởi động lại máy bình thường.'
      },
      {
        stepNumber: 3,
        title: 'Dọn dẹp bộ nhớ trống tối thiểu 5GB - 10GB',
        instructions: 'Vào Cài đặt > Chăm sóc thiết bị (hoặc Quản lý dung lượng) > Xóa các tệp tải về thừa, video quay dung lượng lớn. Luôn duy trì bộ nhớ trống tối thiểu 10% tổng dung lượng máy để Android phân bổ tệp hoán đổi Swap RAM.',
      }
    ],
    requiredTools: ['Không cần công cụ'],
    tags: ['android', 'samsung', 'xiaomi', 'oppo', 'treo máy', 'đơ màn hình', 'safe mode', 'buộc khởi động lại'],
    sourceUrl: 'https://www.thegioididong.com/tin-tuc/nhung-loi-kho-chiu-tren-android-va-cach-giai-quyet-triet-de-960744',
    author: 'Kỹ thuật viên Android Master',
    createdAt: '2026-03-01',
    helpfulCount: 489
  },
  {
    id: 'android-playstore-download-pending',
    title: 'Lỗi Google Play (CH Play) bị kẹt "Đang chờ tải xuống..." hoặc không tải được app',
    platform: 'android',
    category: 'system',
    severity: 'easy',
    estimatedTime: '5 phút',
    summary: 'Cách khắc phục triệt để lỗi không tải hoặc không cập nhật được ứng dụng trên CH Play.',
    symptoms: [
      'Ứng dụng quay vòng tròn kèm chữ "Đang chờ tải xuống..." mãi không chạy %',
      'Báo mã lỗi Error 403, 492, 504 hoặc "Đã xảy ra sự cố"',
      'Tải được 99% thì báo không thể cài đặt'
    ],
    causes: [
      'Bộ nhớ đệm (Cache) của ứng dụng Google Play Store hoặc Dịch vụ Google Play bị hỏng',
      'Đang có hàng đợi tải xuống ngầm nhiều bản cập nhật hệ thống',
      'Ngày giờ trên điện thoại bị sai lệch so với múi giờ thực tế'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Kiểm tra và hủy hàng đợi tải xuống ngầm',
        instructions: 'Mở ứng dụng CH Play > Bấm vào ảnh đại diện tài khoản Google góc trên bên phải > Chọn "Quản lý ứng dụng và thiết bị" > Nhấn vào "Có bản cập nhật" hoặc "Đang xem chi tiết". Nếu thấy có danh sách nhiều ứng dụng đang tự động cập nhật, hãy nhấn "Hủy tất cả" (Cancel all) rồi tải ứng dụng bạn cần trước.',
      },
      {
        stepNumber: 2,
        title: 'Xóa bộ nhớ đệm (Cache) và dữ liệu của CH Play',
        instructions: 'Vào Cài đặt (Settings) trên điện thoại > Ứng dụng (Apps) > Tìm và chọn "Cửa hàng Google Play" (Google Play Store) > Chọn mục "Lưu trữ" (Storage) > Nhấn "Xóa bộ nhớ đệm" (Clear Cache) và "Xóa dữ liệu" (Clear Data).\nLàm tương tự với ứng dụng "Dịch vụ của Google Play" (Google Play Services).',
        tip: 'Sau khi xóa dữ liệu, mở lại CH Play và đăng nhập lại nếu cần, ứng dụng sẽ khởi động mới tinh và sửa sạch lỗi kẹt phiên tải.'
      },
      {
        stepNumber: 3,
        title: 'Đồng bộ lại Ngày & Giờ tự động',
        instructions: 'Vào Cài đặt > Quản lý chung > Ngày và giờ > Bật tùy chọn "Ngày và giờ tự động" (Sử dụng thời gian do nhà mạng cung cấp). Chứng chỉ bảo mật SSL của Google sẽ từ chối kết nối nếu đồng hồ của máy chạy sai.',
      }
    ],
    requiredTools: ['Kết nối Wi-Fi/4G ổn định'],
    tags: ['android', 'ch play', 'google play', 'đang chờ tải xuống', 'lỗi tải app', 'clear cache'],
    sourceUrl: 'https://www.thegioididong.com/tin-tuc/nhung-loi-kho-chiu-tren-android-va-cach-giai-quyet-triet-de-960744',
    author: 'Cộng tác viên Google Android',
    createdAt: '2026-03-02',
    helpfulCount: 367
  },
  {
    id: 'android-phantom-storage-full',
    title: 'Điện thoại Android báo "Bộ nhớ đầy" ảo dù đã xóa hết ảnh và video',
    platform: 'android',
    category: 'system',
    severity: 'medium',
    estimatedTime: '8 phút',
    summary: 'Cách tìm ra các tệp tin "ma" chiếm hàng chục GB dung lượng lưu trữ trên Android mà mục Cài đặt thường không hiển thị rõ.',
    symptoms: [
      'Điện thoại liên tục hiện thông báo "Dung lượng bộ nhớ sắp hết"',
      'Đã xóa hàng nghìn bức ảnh nhưng dung lượng trống không hề tăng',
      'Không thể chụp ảnh mới hoặc nhận tin nhắn Zalo'
    ],
    causes: [
      'Ảnh đã xóa vẫn nằm trong thư mục Thùng rác (Trash) lưu trữ trong 30 ngày',
      'Dữ liệu bộ nhớ tạm khổng lồ của ứng dụng nhắn tin (Zalo, Telegram, TikTok, Facebook)',
      'Thư mục tệp tin ẩn .thumbnails trong thẻ nhớ hoặc bộ nhớ trong'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Dọn sạch Thùng rác trong Bộ sưu tập & Google Photos',
        instructions: 'Nhiều người nghĩ bấm xóa ảnh là đã xóa, nhưng thực chất ảnh được chuyển vào Thùng rác:\n- Mở Bộ sưu tập (Gallery) > Nhấn biểu tượng menu 3 gạch hoặc Dấu ba chấm > Chọn "Thùng rác" (Trash/Bin) > Nhấn "Dọn sạch" (Empty).\n- Mở Google Photos > Thư viện > Thùng rác > Dọn sạch.',
        tip: 'Bước này thường giải phóng ngay lập tức từ 5GB đến 20GB dung lượng!'
      },
      {
        stepNumber: 2,
        title: 'Dọn dẹp dữ liệu đệm của Zalo và Telegram',
        instructions: 'Các ứng dụng chat lưu trữ toàn bộ ảnh, video đã xem vào bộ nhớ đệm:\n- Trong Zalo: Vào Cá nhân > Cài đặt (bánh răng) > Quản lý dữ liệu và bộ nhớ > Nhấn "Xóa bộ nhớ đệm".\n- Trong Telegram: Cài đặt > Dữ liệu và bộ nhớ > Sử dụng bộ nhớ > Nhấn "Xóa bộ nhớ cache Telegram".',
        warning: 'Thao tác xóa bộ nhớ đệm không làm mất tin nhắn văn bản của bạn.'
      },
      {
        stepNumber: 3,
        title: 'Dùng ứng dụng Google Files để quét tệp trùng lặp',
        instructions: 'Tải ứng dụng Files by Google (chính hãng của Google) > Vào tab "Dọn dẹp" (Clean). Ứng dụng sẽ tự động phân loại tệp rác, tệp trùng lặp, tệp tải về có dung lượng cực lớn và ảnh chụp màn hình cũ để xóa an toàn trong 1 chạm.',
      }
    ],
    requiredTools: ['Ứng dụng Files by Google'],
    tags: ['android', 'bộ nhớ đầy', 'dọn rác', 'thùng rác', 'zalo', 'telegram', 'dung lượng ảo'],
    sourceUrl: 'https://www.thegioididong.com/tin-tuc/nhung-loi-kho-chiu-tren-android-va-cach-giai-quyet-triet-de-960744',
    author: 'Kỹ thuật viên Phần mềm',
    createdAt: '2026-03-03',
    helpfulCount: 415
  },
  {
    id: 'android-charging-moisture-slow',
    title: 'Android báo độ ẩm cổng sạc hoặc không nhận sạc nhanh',
    platform: 'android',
    category: 'battery',
    severity: 'easy',
    estimatedTime: '10 phút',
    summary: 'Cách xử lý an toàn khi máy Samsung hoặc Android cảnh báo phát hiện độ ẩm cổng USB hoặc sạc rất chậm chập chờn.',
    symptoms: [
      'Máy rung lên kèm biểu tượng giọt nước và âm thanh cảnh báo khi cắm sạc',
      'Máy từ chối nạp điện để bảo vệ bo mạch',
      'Chỉ sạc được ở tốc độ thường, mất tính năng Super Fast Charging'
    ],
    causes: [
      'Cổng Type-C bị dính mồ hôi, nước mưa hoặc độ ẩm môi trường cao',
      'Xơ vải quần bò và bụi bẩn nén chặt đáy cổng Type-C làm cản trở tiếp xúc chân sạc',
      'Cảm biến độ ẩm bị lỗi lưu dữ liệu đệm'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Tuyệt đối KHÔNG sấy bằng máy sấy tóc nhiệt độ cao',
        instructions: 'Nhiệt độ nóng từ máy sấy tóc sẽ làm chảy keo chống nước của màn hình và biến dạng các chân kim loại nhỏ li ti trong cổng Type-C. Hãy cầm điện thoại chúc cổng sạc xuống dưới và vỗ nhẹ vào lòng bàn tay để văng nước ra.',
      },
      {
        stepNumber: 2,
        title: 'Làm khô tự nhiên bằng quạt gió mát',
        instructions: 'Đặt điện thoại trước một chiếc quạt máy bật gió mát trong khoảng 20-30 phút. Không cắm sạc trong thời gian này. Nếu có gói hút ẩm silica gel, bạn có thể cho điện thoại vào túi zip kín kèm 2-3 gói hút ẩm.',
      },
      {
        stepNumber: 3,
        title: 'Vệ sinh xơ vải nén ở đáy cổng Type-C',
        instructions: 'Dùng một chiếc tăm tre vuốt thật mỏng đầu (tuyệt đối không dùng kim loại như kim may vì sẽ gây đoản mạch), nhẹ nhàng luồn vào hai bên khe chân sạc Type-C và gắp xơ vải tích tụ lâu ngày ra ngoài.',
        tip: 'Khi cắm cáp sạc nghe tiếng "tách" giòn rụm và chân cáp cắm khít sát viền máy là đạt chuẩn.'
      },
      {
        stepNumber: 4,
        title: 'Xóa bộ nhớ đệm hệ thống USBSettings (Nếu máy khô ráo nhưng vẫn báo ảo)',
        instructions: 'Vào Cài đặt > Ứng dụng > Bật "Hiện ứng dụng hệ thống" > Tìm mục "USBSettings" > Lưu trữ > Xóa dữ liệu và khởi động lại máy.',
      }
    ],
    requiredTools: ['Tăm tre vót mỏng', 'Quạt gió làm mát'],
    tags: ['android', 'cảnh báo độ ẩm', 'sạc chậm', 'cổng sạc type-c', 'samsung', 'giọt nước'],
    sourceUrl: 'https://www.thegioididong.com/tin-tuc/nhung-loi-kho-chiu-tren-android-va-cach-giai-quyet-triet-de-960744',
    author: 'Kỹ thuật viên Phần cứng',
    createdAt: '2026-03-04',
    helpfulCount: 284
  },

  // --- WINDOWS (PC & LAPTOP) ---
  {
    id: 'windows-bsod-blue-screen',
    title: 'Sửa lỗi Màn hình xanh chết chóc (BSOD - Blue Screen of Death)',
    platform: 'windows',
    category: 'system',
    severity: 'hard',
    estimatedTime: '20 - 30 phút',
    summary: 'Phân tích mã lỗi dừng (Stop Code) và quy trình chuẩn từng bước khắc phục triệt để lỗi màn hình xanh trên Windows 10 và Windows 11.',
    symptoms: [
      'Máy tính đột ngột crash, màn hình chuyển sang màu xanh dương cùng biểu tượng mặt buồn :(',
      'Máy báo kèm Stop Code: CRITICAL_PROCESS_DIED, MEMORY_MANAGEMENT, KMODE_EXCEPTION_NOT_HANDLED, hoặc PAGE_FAULT_IN_NONPAGED_AREA',
      'Máy tự động khởi động lại liên tục'
    ],
    causes: [
      'Driver phần cứng (đặc biệt là driver Card đồ họa VGA hoặc Wi-Fi) bị xung đột sau khi Windows Update',
      'Thanh RAM bị lỏng chân tiếp xúc, bám bụi hoặc bị lỗi chip nhớ vật lý',
      'Tệp tin hệ thống Windows bị hỏng do tắt nguồn đột ngột',
      'Ổ cứng SSD/HDD xuất hiện bad sector'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Ghi lại Stop Code và tên tệp tin gây lỗi',
        instructions: 'Khi màn hình xanh xuất hiện, nhìn vào dòng chữ in hoa dưới cùng để biết mã lỗi. Ví dụ:\n- MEMORY_MANAGEMENT: Thường do RAM.\n- VIDEO_TDR_FAILURE hoặc nvlddmkm.sys: Do driver card màn hình NVIDIA.\n- INACCESSIBLE_BOOT_DEVICE: Lỗi ổ cứng hoặc thiết lập AHCI/RAID trong BIOS.',
        tip: 'Dùng điện thoại chụp ảnh lại màn hình để đối chiếu khi cần.'
      },
      {
        stepNumber: 2,
        title: 'Chạy công cụ quét và sửa tệp tin hệ thống SFC & DISM',
        instructions: 'Vào Windows (hoặc vào Chế độ Safe Mode). Nhấn phím Windows gõ "cmd", nhấp chuột phải vào Command Prompt chọn "Run as administrator" (Chạy dưới quyền quản trị viên).\n1. Nhập lệnh: sfc /scannow rồi nhấn Enter. Chờ chạy đến 100% để Windows tự động tìm và vá các tệp DLL bị hỏng.\n2. Tiếp tục nhập lệnh: DISM /Online /Cleanup-Image /RestoreHealth rồi nhấn Enter.',
        tip: 'Lệnh này sửa được hơn 70% các lỗi màn hình xanh do tệp hệ thống xung đột.'
      },
      {
        stepNumber: 3,
        title: 'Kiểm tra lỗi RAM bằng Windows Memory Diagnostic',
        instructions: 'Nhấn tổ hợp phím Windows + R, gõ "mdsched.exe" rồi nhấn Enter. Chọn "Restart now and check for problems". Máy tính sẽ khởi động lại và chạy trình quét phần cứng chuyên sâu để phát hiện xem thanh RAM có bị lỗi ô nhớ hay không.',
      },
      {
        stepNumber: 4,
        title: 'Vệ sinh và cắm lại thanh RAM vật lý',
        instructions: 'Nếu máy tính bàn (PC) hoặc laptop tháo được nắp: Rút nguồn điện, tháo thanh RAM ra. Dùng gôm tẩy bút chì chà sạch chân tiếp xúc mạ vàng trên thanh RAM, thổi sạch bụi trong khe cắm rồi cắm chặt lại vào khe.',
        warning: 'Nhớ ngắt nguồn điện và xả tĩnh điện trước khi chạm vào linh kiện bo mạch.'
      }
    ],
    requiredTools: ['Quyền Administrator trên Windows', 'Gôm tẩy bút chì (để vệ sinh chân RAM)', 'Tua vít (nếu mở máy)'],
    tags: ['windows', 'bsod', 'màn hình xanh', 'sfc scannow', 'dism', 'ram', 'stop code', 'driver'],
    sourceUrl: 'https://www.thegioididong.com/hoi-dap/loi-thuong-gap-tren-laptop-may-tinh-1590255',
    author: 'Kỹ sư Phần cứng & Hệ thống Microsoft',
    createdAt: '2026-03-01',
    helpfulCount: 654
  },
  {
    id: 'windows-no-sound-audio-x',
    title: 'Windows bị mất âm thanh / Biểu tượng loa có dấu gạch chéo đỏ',
    platform: 'windows',
    category: 'hardware',
    severity: 'easy',
    estimatedTime: '5 - 10 phút',
    summary: 'Cách khắc phục nhanh khi loa laptop hoặc tai nghe không phát ra tiếng dù âm lượng đã bật 100%.',
    symptoms: [
      'Góc phải thanh Taskbar có biểu tượng loa kèm dấu gạch chéo đỏ (x)',
      'Xem video YouTube hay nghe nhạc không có âm thanh',
      'Hiện thông báo "No Audio Output Device is installed"'
    ],
    causes: [
      'Driver Realtek High Definition Audio bị lỗi hoặc bị Windows Update ghi đè driver không tương thích',
      'Windows Audio service bị dừng chạy đột ngột',
      'Cổng cắm jack 3.5mm bị kẹt lẫy nhận diện tai nghe ảo'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Chạy Trình khắc phục sự cố âm thanh tự động (Troubleshooter)',
        instructions: 'Nhấp chuột phải vào biểu tượng chiếc Loa ở góc dưới bên phải thanh Taskbar > Chọn "Troubleshoot sound problems" (hoặc Cài đặt > Hệ thống > Âm thanh > Khắc phục sự cố). Windows sẽ tự kiểm tra và kích hoạt lại thiết bị phát bị tắt.',
      },
      {
        stepNumber: 2,
        title: 'Cài đặt lại Driver âm thanh trong Device Manager',
        instructions: 'Nhấn tổ hợp phím Windows + X > Chọn "Device Manager". Tìm mục "Sound, video and game controllers".\n- Nhấp chuột phải vào driver âm thanh (thường là Realtek Audio hoặc High Definition Audio Device) > Chọn "Update driver".\n- Chọn "Browse my computer for drivers" > "Let me pick from a list of available drivers on my computer".\n- Chọn "High Definition Audio Device" rồi nhấn Next để cài đặt lại driver gốc ổn định.',
        tip: 'Khởi động lại máy tính sau khi hoàn tất bước này.'
      },
      {
        stepNumber: 3,
        title: 'Khởi động lại dịch vụ Windows Audio',
        instructions: 'Nhấn phím Windows + R, gõ "services.msc" rồi nhấn Enter. Tìm mục "Windows Audio", nhấp chuột phải chọn "Restart". Đảm bảo mục Startup type được đặt là "Automatic".',
      }
    ],
    requiredTools: ['Không cần công cụ'],
    tags: ['windows', 'mất âm thanh', 'loa gạch chéo đỏ', 'realtek', 'device manager', 'driver audio'],
    sourceUrl: 'https://www.thegioididong.com/hoi-dap/loi-thuong-gap-tren-laptop-may-tinh-1590255',
    author: 'Kỹ thuật viên IT Support',
    createdAt: '2026-03-02',
    helpfulCount: 388
  },
  {
    id: 'windows-100-percent-disk',
    title: 'Lỗi Full Disk 100% trên Windows làm máy tính bị đơ giật',
    platform: 'windows',
    category: 'system',
    severity: 'medium',
    estimatedTime: '10 phút',
    summary: 'Cách xử lý tình trạng ổ cứng liên tục bị đẩy lên 100% trong Task Manager khiến máy tính giật lag đơ cứng.',
    symptoms: [
      'Mở Task Manager (Ctrl + Shift + Esc) thấy cột Disk luôn báo màu đỏ 100%',
      'Mở ứng dụng hoặc mở trình duyệt Chrome mất 1-2 phút',
      'Đèn báo ổ cứng trên laptop sáng liên tục không nhấp nháy'
    ],
    causes: [
      'Dịch vụ SysMain (tên cũ là Superfetch) quét ngầm dữ liệu liên tục',
      'Windows Search Indexer tạo chỉ mục tìm kiếm gây quá tải ổ đĩa HDD',
      'Tính năng cập nhật tự động Windows Update đang tải ngầm bản cập nhật lớn'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Vô hiệu hóa dịch vụ SysMain (Superfetch)',
        instructions: 'Nhấn phím Windows + R, gõ "services.msc" rồi nhấn Enter. Cuộn danh sách xuống tìm dịch vụ tên "SysMain".\n- Nhấp đúp chuột vào SysMain > Nhấn nút "Stop" để dừng ngay.\n- Ở mục Startup type, chuyển từ Automatic thành "Disabled" > Nhấn Apply > OK.',
        tip: 'Dịch vụ này ban đầu thiết kế để tăng tốc nạp app, nhưng trên thực tế lại gây nghẽn cổ chai cực lớn cho ổ đĩa.'
      },
      {
        stepNumber: 2,
        title: 'Tắt tính năng Connected User Experiences and Telemetry',
        instructions: 'Cũng trong cửa sổ services.msc, tìm dịch vụ "Connected User Experiences and Telemetry" (dịch vụ thu thập dữ liệu chẩn đoán của Microsoft). Chuyển Startup type thành "Disabled" và nhấn Stop.',
      },
      {
        stepNumber: 3,
        title: 'Kiểm tra sức khỏe ổ đĩa bằng CrystalDiskInfo',
        instructions: 'Tải công cụ miễn phí CrystalDiskInfo để kiểm tra trạng thái ổ đĩa. Nếu mục Health Status báo màu vàng (Caution) hoặc màu đỏ (Bad), ổ cứng của bạn đã bị hỏng cung từ vật lý (Bad Sector) và cần sao lưu dữ liệu ngay để nâng cấp lên SSD.',
        warning: 'Nếu bạn đang dùng ổ cứng cơ HDD truyền thống để chạy Windows 10/11, nâng cấp lên ổ SSD là giải pháp triệt để duy nhất.'
      }
    ],
    requiredTools: ['Công cụ CrystalDiskInfo (kiểm tra sức khỏe ổ cứng)'],
    tags: ['windows', 'full disk 100', 'sysmain', 'superfetch', 'hdd', 'ssd', 'giật lag'],
    sourceUrl: 'https://www.thegioididong.com/hoi-dap/loi-thuong-gap-tren-laptop-may-tinh-1590255',
    author: 'Chuyên viên Tối ưu Windows',
    createdAt: '2026-03-03',
    helpfulCount: 520
  },
  {
    id: 'windows-black-screen-cursor',
    title: 'Màn hình đen chỉ thấy con trỏ chuột sau khi khởi động Windows',
    platform: 'windows',
    category: 'screen',
    severity: 'medium',
    estimatedTime: '5 phút',
    summary: 'Cách kích hoạt lại giao diện màn hình chính khi khởi động vào Windows nhưng không thấy thanh Taskbar hay icon.',
    symptoms: [
      'Màn hình hoàn toàn tối đen, chỉ di chuyển được con trỏ chuột màu trắng',
      'Không bấm được nút Start hay mở bất kỳ cửa sổ nào'
    ],
    causes: [
      'Tiến trình quản lý giao diện Windows Explorer (explorer.exe) bị treo hoặc không tự khởi động',
      'Bản cập nhật Windows Update gần nhất bị lỗi nạp Shell'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Khởi chạy lại tiến trình Windows Explorer bằng Task Manager',
        instructions: 'Nhấn đồng thời tổ hợp 3 phím: Ctrl + Shift + Esc để mở cửa sổ Task Manager (nếu không được, nhấn Ctrl + Alt + Delete rồi chọn Task Manager).\n- Trên thanh menu của Task Manager, nhấp vào "File" > chọn "Run new task".\n- Trong ô Open, gõ chính xác: explorer.exe rồi nhấn Enter (hoặc bấm OK).\nGiao diện màn hình nền, thanh Taskbar và các icon sẽ lập tức xuất hiện trở lại!',
        tip: 'Đây là mẹo nhanh nhất và hiệu quả đến 90% cho lỗi này.'
      },
      {
        stepNumber: 2,
        title: 'Khởi động lại driver đồ họa bằng phím tắt',
        instructions: 'Nhấn tổ hợp 4 phím: Windows + Ctrl + Shift + B. Màn hình sẽ chớp nháy đen trong 1 giây và phát ra tiếng bíp ngắn. Thao tác này sẽ khởi động lại toàn bộ driver card màn hình mà không làm mất các ứng dụng đang mở.',
      }
    ],
    requiredTools: ['Bàn phím hoạt động bình thường'],
    tags: ['windows', 'màn hình đen', 'con trỏ chuột', 'explorer exe', 'task manager', 'driver vga'],
    sourceUrl: 'https://www.thegioididong.com/hoi-dap/loi-thuong-gap-tren-laptop-may-tinh-1590255',
    author: 'Kỹ sư Cấp cứu Máy tính',
    createdAt: '2026-03-04',
    helpfulCount: 476
  },
  {
    id: 'windows-wifi-globe-icon',
    title: 'Laptop mất biểu tượng Wi-Fi / Chỉ hiện biểu tượng quả cầu không kết nối mạng',
    platform: 'windows',
    category: 'network',
    severity: 'easy',
    estimatedTime: '5 - 10 phút',
    summary: 'Sửa lỗi mất hoàn toàn nút bật Wi-Fi trên thanh công cụ Windows, máy không quét được bất kỳ mạng internet nào.',
    symptoms: [
      'Góc phải Taskbar hiện biểu tượng hình quả địa cầu gạch chéo',
      'Mở cài đặt mạng không còn công tắc gạt bật/tắt Wi-Fi',
      'Hiện thông báo "No Internet Access" hoặc "Not Connected"'
    ],
    causes: [
      'Card mạng Wi-Fi (WLAN Adapter) bị đưa vào trạng thái ngủ đông Deep Sleep hoặc bị tắt nhầm',
      'Driver card mạng Intel/Realtek Wi-Fi bị xung đột sau khi gập máy',
      'Bộ nhớ đệm giao thức mạng TCP/IP bị nghẽn'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Tắt và kích hoạt lại Card Wi-Fi trong Device Manager',
        instructions: 'Nhấn phím Windows + X > Chọn "Device Manager" > Mở rộng mục "Network adapters".\n- Nhấp chuột phải vào card Wi-Fi của bạn (ví dụ Intel Wi-Fi 6 AX200 hoặc Realtek Wireless LAN) > Chọn "Disable device" > Chờ 5 giây > Nhấp chuột phải lại chọn "Enable device".',
        tip: 'Nếu có dấu chấm than màu vàng cạnh tên card Wi-Fi, hãy nhấp đúp vào đó để xem mã lỗi Code 10 hoặc Code 43.'
      },
      {
        stepNumber: 2,
        title: 'Chạy lệnh Reset toàn bộ Card mạng bằng Command Prompt',
        instructions: 'Gõ "cmd" vào thanh tìm kiếm Windows > Nhấp chuột phải chọn "Run as administrator". Nhập lần lượt các lệnh sau (nhấn Enter sau mỗi lệnh):\n1. netsh winsock reset\n2. netsh int ip reset\n3. ipconfig /release\n4. ipconfig /renew\n5. ipconfig /flushdns',
        tip: 'Khởi động lại máy tính sau khi chạy xong để các thiết lập mạng nhận diện mới.'
      },
      {
        stepNumber: 3,
        title: 'Xả nguồn tĩnh điện trên Laptop (Hard Power Cycle)',
        instructions: 'Rút sạc pin laptop, rút toàn bộ chuột, USB cắm ngoài. Nhấn và GIỮ NÚT NGUỒN liên tục trong 45 - 60 giây. Thao tác này giúp xả toàn bộ điện tích tĩnh còn đọng trong chip card Wi-Fi trên bo mạch chủ. Sau đó cắm sạc lại và mở máy.',
      }
    ],
    requiredTools: ['Không cần công cụ'],
    tags: ['windows', 'mất wifi', 'biểu tượng quả cầu', 'network adapter', 'flushdns', 'intel wifi', 'laptop'],
    sourceUrl: 'https://www.thegioididong.com/hoi-dap/loi-thuong-gap-tren-laptop-may-tinh-1590255',
    author: 'Kỹ sư Mạng & Hạ tầng',
    createdAt: '2026-03-05',
    helpfulCount: 412
  },

  // --- MACBOOK / MACOS ---
  {
    id: 'macbook-app-frozen-rainbow',
    title: 'MacBook bị đơ ứng dụng / Con trỏ chuột xoay vòng cầu vồng',
    platform: 'mac',
    category: 'system',
    severity: 'easy',
    estimatedTime: '2 phút',
    summary: 'Cách buộc dừng ngay lập tức (Force Quit) ứng dụng bị treo trên macOS mà không cần khởi động lại toàn bộ máy.',
    symptoms: [
      'Con trỏ chuột chuyển thành hình quả bóng xoay nhiều màu (Spinning Beach Ball)',
      'Cửa sổ ứng dụng không bấm được nút đỏ thoát ở góc trên',
      'Máy có hiện tượng giật lag chậm chạp'
    ],
    causes: [
      'Ứng dụng bị nghẽn bộ nhớ hoặc đang chờ phản hồi từ ổ cứng ngoài',
      'Ứng dụng phiên bản cũ không tương thích tốt với chip Apple Silicon M1/M2/M3'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Sử dụng phím tắt Force Quit Applications',
        instructions: 'Nhấn đồng thời 3 phím: Command + Option + Escape (Esc). Một cửa sổ nhỏ liệt kê các ứng dụng đang mở sẽ xuất hiện. Ứng dụng bị đơ sẽ có dòng chữ "(Not Responding)" bên cạnh. Chọn ứng dụng đó và bấm nút "Force Quit" (Bắt buộc thoát).',
        tip: 'Phím tắt này tương đương với phím tắt Task Manager trên Windows.'
      },
      {
        stepNumber: 2,
        title: 'Sử dụng Activity Monitor để tắt tiến trình nền',
        instructions: 'Nhấn Command + Space (phím cách) mở Spotlight, gõ "Activity Monitor" rồi nhấn Enter. Tìm tên ứng dụng hoặc tiến trình đang chiếm 100% CPU hoặc Memory, nhấn vào biểu tượng dấu (X) hình bát giác ở thanh công cụ trên cùng và chọn "Force Quit".',
      }
    ],
    requiredTools: ['Bàn phím MacBook'],
    tags: ['macbook', 'macos', 'treo máy', 'force quit', 'con trỏ cầu vồng', 'activity monitor'],
    author: 'Chuyên viên Apple Genius',
    createdAt: '2026-03-02',
    helpfulCount: 231
  },
  {
    id: 'macbook-smc-nvram-reset',
    title: 'Cách Reset SMC & NVRAM/PRAM trên MacBook khi gặp lỗi sạc, quạt hú và pin',
    platform: 'mac',
    category: 'hardware',
    severity: 'medium',
    estimatedTime: '5 - 10 phút',
    summary: 'Phương pháp chuẩn thiết lập lại bộ điều khiển quản lý hệ thống (SMC) và bộ nhớ thông số để sửa lỗi quạt quay ầm ĩ, đèn sạc không sáng hoặc mất đèn nền bàn phím.',
    symptoms: [
      'Quạt tản nhiệt quay tốc độ tối đa dù máy hoàn toàn mát và không chạy ứng dụng nặng',
      'Cắm sạc không sáng đèn MagSafe hoặc máy không nhận sạc',
      'Độ phân giải màn hình bị sai, mất âm thanh khởi động'
    ],
    causes: [
      'Bộ điều khiển SMC lưu trữ thông số nguồn điện bị sai lệch',
      'Xung đột thông số phần cứng lưu trong NVRAM'
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Quy trình Reset SMC trên MacBook chip Intel',
        instructions: 'Tắt nguồn máy hoàn toàn. Cắm sạc pin vào máy. Nhấn và giữ đồng thời 4 phím: Shift + Control + Option (ở bên trái bàn phím) VÀ nút Nguồn trong 10 giây. Thả toàn bộ các phím ra cùng lúc, sau đó bấm nút Nguồn để mở máy lại bình thường.',
        tip: 'Quan sát đèn sạc MagSafe sẽ đổi màu chớp nhẹ báo hiệu việc reset thành công.'
      },
      {
        stepNumber: 2,
        title: 'Quy trình Reset NVRAM/PRAM trên Mac Intel',
        instructions: 'Tắt máy. Bấm nút Nguồn mở máy và NGAY LẬP TỨC nhấn giữ tổ hợp 4 phím: Command + Option + P + R. Giữ liên tục trong khoảng 20 giây cho đến khi nghe thấy tiếng chuông khởi động lần thứ hai (hoặc logo Apple xuất hiện lần hai) thì thả tay.',
      },
      {
        stepNumber: 3,
        title: 'Đối với MacBook chip Apple Silicon (M1, M2, M3, M4)',
        instructions: 'Trên kiến trúc chip Apple Silicon, các chức năng của SMC đã được tích hợp trực tiếp vào vi xử lý SoC. Để reset tương đương: Chỉ cần tắt máy hoàn toàn (Shut Down), đóng nắp màn hình lại trong ít nhất 30 giây rồi mở máy ra sử dụng bình thường.',
      }
    ],
    requiredTools: ['Bàn phím MacBook', 'Cáp sạc MagSafe/Type-C'],
    tags: ['macbook', 'reset smc', 'nvram', 'pram', 'quạt hú', 'không nhận sạc', 'm1 m2 m3'],
    author: 'Kỹ thuật viên Apple Certified',
    createdAt: '2026-03-03',
    helpfulCount: 310
  }
];
