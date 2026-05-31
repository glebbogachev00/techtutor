export type Locale = "en" | "vn";

export const locales: Locale[] = ["en", "vn"];
export const defaultLocale: Locale = "en";

type Dict = Record<string, string>;

const en: Dict = {
  "brand.name": "TechBash",
  "brand.tagline": "Learn to code. One mission at a time.",

  "nav.dashboard": "Dashboard",
  "nav.tracks": "Tracks",
  "nav.logout": "Logout",

  "login.title": "Welcome back",
  "login.subtitle": "We’ll email you a magic link — no password needed.",
  "login.emailLabel": "Email address",
  "login.emailPlaceholder": "you@example.com",
  "login.submit": "Send magic link",
  "login.sending": "Sending…",
  "login.checkInbox":
    "Check your inbox — we sent a sign-in link to {email}.",
  "login.error": "Something went wrong. Please try again.",

  "dashboard.welcome": "Welcome back, {name}!",
  "dashboard.continue": "Continue learning",
  "dashboard.tracks": "Your tracks",
  "dashboard.xp": "Total XP",
  "dashboard.completed": "Missions completed",
  "dashboard.streak": "Day streak",

  "track.web": "Web Development",
  "track.python": "Python",
  "track.webDesc": "Build real websites with HTML, CSS, and JavaScript.",
  "track.pythonDesc": "Learn the language used in AI, games, and automation.",
  "track.startMission": "Start mission",
  "track.locked": "Locked",
  "track.completed": "Completed",

  "mission.brief": "Mission brief",
  "mission.editor": "Your code",
  "mission.preview": "Live preview",
  "mission.run": "Run code",
  "mission.submit": "Submit for review",
  "mission.reviewing": "AI tutor is reading your code…",
  "mission.feedback": "AI tutor feedback",
  "mission.tryAgain": "Try again",
  "mission.nextMission": "Next mission",
  "mission.xpEarned": "+{xp} XP earned!",
};

const vn: Dict = {
  "brand.name": "TechBash",
  "brand.tagline": "Học lập trình. Từng nhiệm vụ một.",

  "nav.dashboard": "Bảng điều khiển",
  "nav.tracks": "Lộ trình",
  "nav.logout": "Đăng xuất",

  "login.title": "Chào mừng trở lại",
  "login.subtitle":
    "Chúng tôi sẽ gửi liên kết đăng nhập qua email — không cần mật khẩu.",
  "login.emailLabel": "Địa chỉ email",
  "login.emailPlaceholder": "ban@vidu.com",
  "login.submit": "Gửi liên kết đăng nhập",
  "login.sending": "Đang gửi…",
  "login.checkInbox": "Kiểm tra hộp thư — liên kết đã gửi tới {email}.",
  "login.error": "Có lỗi xảy ra. Vui lòng thử lại.",

  "dashboard.welcome": "Chào mừng trở lại, {name}!",
  "dashboard.continue": "Tiếp tục học",
  "dashboard.tracks": "Lộ trình của bạn",
  "dashboard.xp": "Tổng XP",
  "dashboard.completed": "Nhiệm vụ hoàn thành",
  "dashboard.streak": "Chuỗi ngày",

  "track.web": "Phát triển Web",
  "track.python": "Python",
  "track.webDesc": "Xây dựng website thực tế với HTML, CSS và JavaScript.",
  "track.pythonDesc":
    "Học ngôn ngữ được dùng trong AI, game và tự động hóa.",
  "track.startMission": "Bắt đầu nhiệm vụ",
  "track.locked": "Đã khóa",
  "track.completed": "Hoàn thành",

  "mission.brief": "Mô tả nhiệm vụ",
  "mission.editor": "Mã của bạn",
  "mission.preview": "Xem trước",
  "mission.run": "Chạy mã",
  "mission.submit": "Gửi đánh giá",
  "mission.reviewing": "Gia sư AI đang đọc mã của bạn…",
  "mission.feedback": "Phản hồi từ gia sư AI",
  "mission.tryAgain": "Thử lại",
  "mission.nextMission": "Nhiệm vụ tiếp theo",
  "mission.xpEarned": "+{xp} XP đã nhận!",
};

const dictionaries: Record<Locale, Dict> = { en, vn };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function t(
  locale: Locale,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const dict = getDictionary(locale);
  let value = dict[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replaceAll(`{${k}}`, String(v));
    }
  }
  return value;
}
