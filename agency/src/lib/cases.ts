import type { Locale } from "@/lib/copy";

export type CaseSlug = "operations" | "teaching";

export type CaseStudy = {
  slug: CaseSlug;
  productName: string;
  eyebrow: string;
  title: string;
  intro: string;
  before: {
    label: string;
    title: string;
    body: string;
    tools: { tool: string; role: string; pain: string }[];
    costTitle: string;
    costs: string[];
  };
  after: {
    label: string;
    title: string;
    body: string;
    features: { title: string; body: string }[];
  };
  results: { n: string; label: string }[];
  cta: { title: string; sub: string; button: string };
  otherCase: { label: string; slug: CaseSlug };
};

export const CASES: Record<Locale, Record<CaseSlug, CaseStudy>> = {
  en: {
    operations: {
      slug: "operations",
      productName: "Admin OS",
      eyebrow: "Case study — running the school",
      title: "From five disconnected tools to one Admin OS.",
      intro:
        "Before we built our own system, running TechTutor Academy meant juggling spreadsheets, invoice tools, design apps and chat threads — every single day. Here's exactly what that looked like, and what replaced it.",
      before: {
        label: "Before",
        title: "The duct-tape stack",
        body: "Every job had a different tool, and none of them talked to each other. Every student enrolled meant touching four apps by hand.",
        tools: [
          {
            tool: "Google Drive + Sheets",
            role: "our \"CRM\"",
            pain: "Student records scattered across tabs and folders. No single source of truth — the same student existed in three spreadsheets with three different statuses.",
          },
          {
            tool: "Zoho Invoice",
            role: "invoicing",
            pain: "A separate login, a separate subscription, and it still didn't match our branding — so we ended up redesigning invoices in Canva anyway.",
          },
          {
            tool: "Canva",
            role: "invoices, certificates & EOC reports",
            pain: "Every certificate and end-of-course report was designed by hand. Twenty students finishing a course meant an evening of copy-pasting names into templates.",
          },
          {
            tool: "Manual messages",
            role: "parent updates",
            pain: "Progress updates, payment reminders and follow-ups typed out one by one. Slow, inconsistent, and easy to forget someone.",
          },
        ],
        costTitle: "What it cost us",
        costs: [
          "6–8 hours of admin work every week",
          "Payment reminders missed because no tool owned them",
          "Student data out of sync between three spreadsheets",
          "An evening of manual design work per course completion",
        ],
      },
      after: {
        label: "After",
        title: "One dashboard runs everything",
        body: "We built Admin OS — a single internal tool that owns the entire student lifecycle from enrollment to certificate. Nothing is copy-pasted anymore.",
        features: [
          {
            title: "Real CRM, one source of truth",
            body: "Every student, class, parent contact and payment status in one place. Search once, see everything.",
          },
          {
            title: "Invoices generated automatically",
            body: "Branded invoices created from class data in one click — numbered, tracked, and marked paid without a separate tool.",
          },
          {
            title: "Certificates & reports in seconds",
            body: "End-of-course certificates and progress reports generate themselves from real class data. Twenty students = twenty certificates, instantly.",
          },
          {
            title: "Automated parent updates",
            body: "Progress summaries and payment reminders go out on schedule. No one gets forgotten.",
          },
          {
            title: "Class & schedule management",
            body: "Classes, enrollment, attendance and teacher assignment managed in the same tool the rest of the data lives in.",
          },
          {
            title: "Ours forever",
            body: "No subscriptions, no per-seat pricing, no tool shutting down under us. It changes when our business changes.",
          },
        ],
      },
      results: [
        { n: "4→1", label: "Tools replaced by one system" },
        { n: "~7h", label: "Admin hours saved weekly" },
        { n: "1-click", label: "Invoices & certificates" },
        { n: "$0", label: "Monthly software fees" },
      ],
      cta: {
        title: "Your operations could look like the second picture.",
        sub: "Book a free system audit — we'll map your duct-tape stack and show you exactly what one system would replace.",
        button: "Get a free system audit",
      },
      otherCase: { label: "Next case study: TechBash", slug: "teaching" },
    },
    teaching: {
      slug: "teaching",
      productName: "TechBash",
      eyebrow: "Case study — teaching students",
      title: "From emailing slides to a learning world students love.",
      intro:
        "Teaching is our product — but delivering it used to depend entirely on us being in the room. Homework, portfolios, self-study: all manual. So we built TechBash, and the product started teaching with us.",
      before: {
        label: "Before",
        title: "Everything went through us",
        body: "Every piece of learning outside the classroom was something we had to personally produce, send, chase and check.",
        tools: [
          {
            tool: "Homework by hand",
            role: "after every class",
            pain: "Exercises written up and sent manually after each lesson. Checking them meant reading every submission ourselves — and chasing the ones that never came back.",
          },
          {
            tool: "Hand-built portfolio pages",
            role: "student showcases",
            pain: "Every student who wanted to show their work needed a separate page, built by us, updated by us. It didn't scale past a handful of students.",
          },
          {
            tool: "Emailed slides",
            role: "self-study",
            pain: "Students who wanted to learn between classes got a PDF and our best wishes. No interactivity, no feedback, no way to know if they even opened it.",
          },
          {
            tool: "No progress visibility",
            role: "for parents & us",
            pain: "\"How is my child doing?\" meant checking notes, memory, and three different chats before answering.",
          },
        ],
        costTitle: "What it cost us",
        costs: [
          "Hours of homework prep and checking every week",
          "Learning stopped the moment class ended",
          "Portfolios only existed for a few students",
          "No honest answer to \"what did my child learn?\"",
        ],
      },
      after: {
        label: "After",
        title: "A gamified world that teaches with us",
        body: "TechBash turns everything between classes into interactive missions with instant AI feedback — fun enough that students come back without being chased.",
        features: [
          {
            title: "Interactive missions, not worksheets",
            body: "Homework became missions with XP, streaks and characters. Students do them because they want the next unlock.",
          },
          {
            title: "Instant AI feedback",
            body: "Code is checked the moment it's submitted. Students learn from mistakes immediately — no waiting for us to review.",
          },
          {
            title: "Self-study that actually works",
            body: "Full tracks in Python, Web Development and Generative AI that students follow entirely on their own, guided step by step.",
          },
          {
            title: "Automatic portfolios",
            body: "Every project a student builds lands in their portfolio automatically. They choose what to make public and share.",
          },
          {
            title: "Certificates & skill tree",
            body: "Finish a track, get a certificate — automatically. The skill tree shows exactly what they've mastered.",
          },
          {
            title: "Progress parents can see",
            body: "Missions completed, projects built, certificates earned. \"What did you learn today?\" finally has an answer.",
          },
        ],
      },
      results: [
        { n: "12", label: "Self-paced learning tracks" },
        { n: "100%", label: "Homework checked instantly by AI" },
        { n: "Auto", label: "Portfolios & certificates" },
        { n: "24/7", label: "Learning keeps going without us" },
      ],
      cta: {
        title: "What's the TechBash of your business?",
        sub: "Book a free system audit — we'll find the part of your service that could run beautifully without you in the room.",
        button: "Get a free system audit",
      },
      otherCase: { label: "Next case study: Admin OS", slug: "operations" },
    },
  },
  vn: {
    operations: {
      slug: "operations",
      productName: "Admin OS",
      eyebrow: "Case study — vận hành trung tâm",
      title: "Từ năm công cụ rời rạc đến một Admin OS duy nhất.",
      intro:
        "Trước khi tự xây hệ thống, vận hành TechTutor Academy nghĩa là xoay xở giữa bảng tính, công cụ hóa đơn, app thiết kế và các luồng tin nhắn — mỗi ngày. Đây chính xác là trước đây và những gì đã thay thế nó.",
      before: {
        label: "Trước",
        title: "Bộ công cụ chắp vá",
        body: "Mỗi việc một công cụ, và chẳng cái nào kết nối với nhau. Mỗi học viên ghi danh nghĩa là thao tác tay trên bốn ứng dụng.",
        tools: [
          {
            tool: "Google Drive + Sheets",
            role: "\"CRM\" của chúng tôi",
            pain: "Hồ sơ học viên rải rác khắp các tab và thư mục. Không có nguồn dữ liệu chuẩn — cùng một học viên tồn tại trong ba bảng tính với ba trạng thái khác nhau.",
          },
          {
            tool: "Zoho Invoice",
            role: "hóa đơn",
            pain: "Thêm một tài khoản, thêm một thuê bao, mà vẫn không đúng nhận diện thương hiệu — cuối cùng vẫn phải thiết kế lại hóa đơn bằng Canva.",
          },
          {
            tool: "Canva",
            role: "hóa đơn, chứng chỉ & báo cáo cuối khóa",
            pain: "Mỗi chứng chỉ và báo cáo cuối khóa đều thiết kế thủ công. Hai mươi học viên tốt nghiệp nghĩa là một buổi tối copy-paste tên vào template.",
          },
          {
            tool: "Tin nhắn thủ công",
            role: "cập nhật cho phụ huynh",
            pain: "Báo cáo tiến độ, nhắc thanh toán, chăm sóc — gõ từng tin một. Chậm, thiếu nhất quán, và dễ bỏ sót.",
          },
        ],
        costTitle: "Cái giá phải trả",
        costs: [
          "6–8 giờ việc hành chính mỗi tuần",
          "Bỏ sót nhắc thanh toán vì không công cụ nào chịu trách nhiệm",
          "Dữ liệu học viên lệch nhau giữa ba bảng tính",
          "Một buổi tối thiết kế thủ công cho mỗi đợt kết khóa",
        ],
      },
      after: {
        label: "Sau",
        title: "Một bảng điều khiển vận hành tất cả",
        body: "Chúng tôi xây Admin OS — một công cụ nội bộ duy nhất quản lý toàn bộ vòng đời học viên từ ghi danh đến chứng chỉ. Không còn copy-paste.",
        features: [
          {
            title: "CRM thật, một nguồn dữ liệu chuẩn",
            body: "Mọi học viên, lớp học, liên hệ phụ huynh và trạng thái thanh toán ở một nơi. Tìm một lần, thấy tất cả.",
          },
          {
            title: "Hóa đơn tạo tự động",
            body: "Hóa đơn đúng thương hiệu tạo từ dữ liệu lớp học trong một cú nhấp — đánh số, theo dõi, đánh dấu đã thanh toán mà không cần công cụ riêng.",
          },
          {
            title: "Chứng chỉ & báo cáo trong vài giây",
            body: "Chứng chỉ cuối khóa và báo cáo tiến độ tự sinh từ dữ liệu lớp học thật. Hai mươi học viên = hai mươi chứng chỉ, ngay lập tức.",
          },
          {
            title: "Cập nhật phụ huynh tự động",
            body: "Tóm tắt tiến độ và nhắc thanh toán gửi đúng lịch. Không ai bị bỏ quên.",
          },
          {
            title: "Quản lý lớp & lịch học",
            body: "Lớp học, ghi danh, điểm danh và phân công giáo viên — quản lý ngay trong công cụ chứa toàn bộ dữ liệu.",
          },
          {
            title: "Thuộc về chúng tôi mãi mãi",
            body: "Không thuê bao, không tính phí theo người dùng, không lo công cụ đóng cửa. Hệ thống thay đổi khi doanh nghiệp thay đổi.",
          },
        ],
      },
      results: [
        { n: "4→1", label: "Công cụ được thay bằng một hệ thống" },
        { n: "~7h", label: "Giờ hành chính tiết kiệm mỗi tuần" },
        { n: "1 nhấp", label: "Hóa đơn & chứng chỉ" },
        { n: "0₫", label: "Phí phần mềm hàng tháng" },
      ],
      cta: {
        title: "Vận hành của bạn có thể giống bức tranh thứ hai.",
        sub: "Đặt lịch đánh giá hệ thống miễn phí — chúng tôi sẽ rà soát bộ công cụ chắp vá của bạn và chỉ ra chính xác một hệ thống sẽ thay thế được gì.",
        button: "Nhận đánh giá miễn phí",
      },
      otherCase: { label: "Case study tiếp theo: TechBash", slug: "teaching" },
    },
    teaching: {
      slug: "teaching",
      productName: "TechBash",
      eyebrow: "Case study — dạy học viên",
      title: "Từ gửi slide qua email đến thế giới học tập học viên yêu thích.",
      intro:
        "Dạy học là sản phẩm của chúng tôi — nhưng trước đây mọi thứ phụ thuộc hoàn toàn vào việc chúng tôi có mặt. Bài tập, portfolio, tự học: tất cả đều thủ công. Vì vậy chúng tôi xây TechBash, và sản phẩm bắt đầu dạy cùng chúng tôi.",
      before: {
        label: "Trước",
        title: "Mọi thứ đều qua tay chúng tôi",
        body: "Mọi hoạt động học ngoài lớp đều là thứ chúng tôi phải tự soạn, tự gửi, tự nhắc và tự chấm.",
        tools: [
          {
            tool: "Bài tập soạn tay",
            role: "sau mỗi buổi học",
            pain: "Bài tập viết và gửi thủ công sau từng buổi. Chấm bài nghĩa là tự đọc từng bài nộp — và đuổi theo những bài không bao giờ được nộp.",
          },
          {
            tool: "Trang portfolio dựng tay",
            role: "trưng bày sản phẩm học viên",
            pain: "Mỗi học viên muốn khoe sản phẩm cần một trang riêng, do chúng tôi dựng, do chúng tôi cập nhật. Không thể mở rộng quá vài học viên.",
          },
          {
            tool: "Slide gửi email",
            role: "tự học",
            pain: "Học viên muốn học giữa các buổi nhận được một file PDF và lời chúc may mắn. Không tương tác, không phản hồi, không biết các em có mở ra không.",
          },
          {
            tool: "Không nhìn thấy tiến độ",
            role: "với phụ huynh & chúng tôi",
            pain: "\"Con tôi học thế nào?\" nghĩa là lục ghi chú, trí nhớ và ba cuộc trò chuyện khác nhau trước khi trả lời.",
          },
        ],
        costTitle: "Cái giá phải trả",
        costs: [
          "Hàng giờ soạn và chấm bài tập mỗi tuần",
          "Việc học dừng lại ngay khi buổi học kết thúc",
          "Portfolio chỉ tồn tại cho vài học viên",
          "Không có câu trả lời thật cho \"con tôi học được gì?\"",
        ],
      },
      after: {
        label: "Sau",
        title: "Một thế giới gamification dạy cùng chúng tôi",
        body: "TechBash biến mọi thứ giữa các buổi học thành nhiệm vụ tương tác với phản hồi AI tức thì — đủ vui để học viên tự quay lại mà không cần nhắc.",
        features: [
          {
            title: "Nhiệm vụ tương tác, không phải phiếu bài tập",
            body: "Bài tập trở thành nhiệm vụ với XP, chuỗi ngày học và nhân vật. Học viên làm vì muốn mở khóa phần thưởng tiếp theo.",
          },
          {
            title: "Phản hồi AI tức thì",
            body: "Code được chấm ngay khi nộp. Học viên học từ lỗi sai ngay lập tức — không phải chờ chúng tôi xem.",
          },
          {
            title: "Tự học thực sự hiệu quả",
            body: "Lộ trình đầy đủ về Python, Lập trình Web và AI tạo sinh mà học viên tự theo hoàn toàn, được dẫn dắt từng bước.",
          },
          {
            title: "Portfolio tự động",
            body: "Mỗi dự án học viên làm tự động vào portfolio của các em. Các em chọn công khai gì và chia sẻ.",
          },
          {
            title: "Chứng chỉ & cây kỹ năng",
            body: "Hoàn thành lộ trình, nhận chứng chỉ — tự động. Cây kỹ năng cho thấy chính xác các em đã thành thạo gì.",
          },
          {
            title: "Tiến độ phụ huynh nhìn thấy được",
            body: "Nhiệm vụ hoàn thành, dự án đã xây, chứng chỉ đạt được. \"Hôm nay con học gì?\" cuối cùng đã có câu trả lời.",
          },
        ],
      },
      results: [
        { n: "12", label: "Lộ trình tự học" },
        { n: "100%", label: "Bài tập được AI chấm tức thì" },
        { n: "Tự động", label: "Portfolio & chứng chỉ" },
        { n: "24/7", label: "Việc học tiếp diễn không cần chúng tôi" },
      ],
      cta: {
        title: "\"TechBash\" của doanh nghiệp bạn là gì?",
        sub: "Đặt lịch đánh giá hệ thống miễn phí — chúng tôi sẽ tìm phần dịch vụ của bạn có thể tự vận hành trơn tru mà không cần bạn có mặt.",
        button: "Nhận đánh giá miễn phí",
      },
      otherCase: { label: "Case study tiếp theo: Admin OS", slug: "operations" },
    },
  },
};
