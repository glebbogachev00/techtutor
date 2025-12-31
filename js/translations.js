// Translation dictionary and language switching functionality
// Loaded with defer attribute for optimal performance

const translations = {
  en: {
    'nav.programs': 'Programs',
    'nav.projects': 'Projects',
    'nav.how-it-works': 'How It Works',
    'nav.free-courses': 'Free Courses',
    'nav.pricing': 'Pricing',
    'nav.blog': 'Blog',
    'nav.free-trial': 'Free Trial',
    'hero.title': 'Best Tech Education<br/>in the World',
    'hero.description': 'TechTutor offers live, interactive tech courses designed to help children and teens gain in-demand skills. From coding and AI to game development and 3D design, we provide personalized learning experiences that keep students engaged and progressing.',
    'hero.cta': 'Get Started',
    'hero.stats.years': 'Years of experience',
    'hero.stats.countries': 'Presence in countries',
    'easier.title': 'An Easier Way to<br/>Learn Tech Skills',
    'easier.description': 'TechTutor simplifies tech education for families. Whether you want private 1-on-1 lessons or small group sessions, we match students with expert instructors for personalized, project-based learning.',
    'easier.card1.title': 'Expert Instructors',
    'easier.card1.description': 'All instructors hold Bachelor\'s degrees in Computer Science, Information Technology, or Software Engineering with 6+ years of professional experience.',
    'easier.card2.title': 'Parent Dashboard',
    'easier.card2.description': 'Track progress, schedule sessions flexibly, and receive detailed feedback after every lesson with our parent dashboard.',
    'easier.card3.title': 'Affordable Online Learning',
    'easier.card3.description': 'Affordable online learning with bundle discounts up to 10% off. Learn from home with the same quality as in-person classes.',
    'carousel.title': 'See Our Classes in Action',
    'carousel.description': 'Take a peek inside our virtual classroom and see students learning, creating, and having fun!',
    'why.title': 'Why Choose Our<br/>Services?',
    'why.description': 'With over 4 years of experience and 80-90% student retention, TechTutor delivers results. We focus on hands-on projects, real-world skills, and keeping learning fun and engaging for every student.',
    'why.point1': '6+ years designing programs with 80-90% learner retention',
    'why.point2': 'Every learner completes a real project they can showcase',
    'why.point3': 'Flexible 1:1 or small group formats with personal feedback',
    'why.point4': 'Bilingual support in English and Vietnamese',
    'why.stat1': 'Happy students',
    'why.stat2': 'Lessons taught',
    'why.stat3': 'Student retention rate',
    'testimonials.title': 'What Our Lovely<br/>Clients Say',
    'testimonials.subtitle': 'Real feedback from parents and students who\'ve experienced our programs',
    'testimonials.t1.role': 'Parent of Bảo Minh (10)',
    'testimonials.t1.text': '"Bảo Minh has been learning with Teacher Gleb for almost a year now. At first, my son was shy and didn\'t know where to start with computers. Now he confidently builds small games and even created an AI chatbot for his science project!"',
    'testimonials.t2.role': 'Parent of Gia Hân (12)',
    'testimonials.t2.text': '"My daughter studied 3D Design and Roblox Game Development with Teacher Mathan for over a year and a half. She created two complete games and improved both teamwork and confidence."',
    'testimonials.t3.role': 'Parent of Kian Reed (13)',
    'testimonials.t3.text': '"Kian explored Generative AI and Python programming with Teacher Mathan and now has two solid portfolio projects. TechTutor\'s structured and creative approach is perfect for international families."',
    'cta.partners.title': 'Get in touch<br/>Join our community<br/>of school partners',
    'cta.partners.description': 'Partner with TechTutor to bring cutting-edge tech education to your school. We offer customized programs, teacher training, and ongoing support.',
    'cta.partners.button': 'Join Now',
    'pricing.title': 'Find the right <span style="color: #193b92;">plan</span> for you',
    'pricing.subtitle': 'Flexible pricing for private or group lessons',
    'pricing.private.title': 'Private (1 on 1)',
    'pricing.private.plan1': '1 course (8 lessons)',
    'pricing.private.plan2': '2 courses (16 lessons) — <span class="font-semibold" style="color: #ff0000;">5% off</span>',
    'pricing.private.plan3': '3 courses (24 lessons) — <span class="font-semibold" style="color: #ff0000;">10% off</span>',
    'pricing.group.title': 'Small group (2-4 students)',
    'pricing.group.plan1': '1 course (8 lessons)',
    'pricing.group.plan2': '2 courses (16 lessons) — <span class="font-semibold" style="color: #ff0000;">5% off</span>',
    'pricing.group.plan3': '3 courses (24 lessons) — <span class="font-semibold" style="color: #ff0000;">10% off</span>',
    'programs.title': 'Programs for every <span style="color: #193b92;">age</span>',
    'programs.subtitle': 'We have the largest selection of programs to study with our online courses',
    'programs.scratch.title': 'Scratch Game Coder',
    'programs.scratch.description': 'Learn to code through game creation with Scratch\'s visual blocks.',
    'programs.scratch.skills': 'Block coding, logic, game design',
    'programs.roblox.title': 'Roblox World Creator',
    'programs.roblox.description': 'Use Roblox Studio and Lua to launch immersive, shared worlds.',
    'programs.roblox.skills': 'Lua, 3D design, creative storytelling',
    'programs.3d.title': '3D Designer',
    'programs.3d.description': 'Learn Blender workflows for professional-grade 3D scenes.',
    'programs.3d.skills': '3D modelling, design workflow, Python basics',
    'programs.app.title': 'App Development',
    'programs.app.description': 'Build real mobile apps with Thunkable\'s visual interface.',
    'programs.app.skills': 'Thunkable, app design, UI/UX',
    'programs.gdevelop.title': 'GDevelop Game Designer',
    'programs.gdevelop.description': 'Create 2D games with visual scripting and publish them.',
    'programs.gdevelop.skills': 'GDevelop, game design, visual scripting',
    'programs.ai.title': 'AI & Programming Quest',
    'programs.ai.description': 'Blend Python coding with machine learning to power smart games.',
    'programs.ai.skills': 'Python, machine learning, AI',
    'programs.genai.title': 'Generative AI Magic',
    'programs.genai.description': 'Use AI tools as creative partners and build responsible AI projects.',
    'programs.genai.skills': 'Prompt engineering, AI integration',
    'blog.title': 'Useful Content For<br/>Your Check',
    'blog.subtitle': 'Explore our student projects, success stories, and learning resources',
    'blog.card1.tag': 'PROJECTS',
    'blog.card1.title': '10 Ways Our Students Excel in Tech',
    'blog.card1.description': 'See how our students transform from beginners to confident creators...',
    'blog.card2.tag': 'EDUCATION',
    'blog.card2.title': 'How to Make Learning Tech Feel Like Playtime',
    'blog.card2.description': 'Transform tech education into an exciting adventure with these proven strategies...',
    'blog.card3.tag': 'PARENTING',
    'blog.card3.title': 'How to Spot and Nurture Your Child\'s Technology Skill',
    'blog.card3.description': 'Learn how to identify your child\'s tech talents and support their development...',
    'blog.card4.tag': 'PROJECTS',
    'blog.card4.title': 'Unlocking Your Child\'s Potential With Project-Based Learning',
    'blog.card4.description': 'Why hands-on, project-first lessons keep kids engaged and future-ready.',
    'blog.read_more': 'Read More',
    'trial.title': 'Start With a <span style="color: #193b92;">FREE</span> Lesson',
    'trial.description': 'In just 90 minutes: receive a free, in-depth consultation and roadmap from our instructor. Share your details below and we\'ll schedule within 24 hours.',
    'trial.form.parent_name': 'Parent Name',
    'trial.form.child_name': 'Child Name',
    'trial.form.email': 'Email',
    'trial.form.phone': 'Phone (Zalo/WhatsApp)',
    'trial.form.age': 'Age',
    'trial.form.submit': 'Book Free Trial',
    'footer.copyright': '© 2025 TechTutor Academy. All rights reserved.',
    'footer.bilingual': 'English / Vietnamese bilingual support'
  },
  vi: {
    'nav.programs': 'Chương Trình',
    'nav.projects': 'Dự Án',
    'nav.how-it-works': 'Quy Trình',
    'nav.free-courses': 'Khóa Học Miễn Phí',
    'nav.pricing': 'Giá Cả',
    'nav.blog': 'Blog',
    'nav.free-trial': 'Dùng Thử Miễn Phí',
    'hero.title': 'Giáo Dục Công Nghệ<br/>Tốt Nhất Thế Giới',
    'hero.description': 'TechTutor cung cấp các khóa học công nghệ trực tiếp, tương tác được thiết kế để giúp trẻ em và thanh thiếu niên có được các kỹ năng được săn đón. Từ lập trình và AI đến phát triển trò chơi và thiết kế 3D, chúng tôi cung cấp trải nghiệm học tập cá nhân hóa giúp học sinh luôn hứng thú và tiến bộ.',
    'hero.cta': 'Bắt Đầu',
    'hero.stats.years': 'Năm kinh nghiệm',
    'hero.stats.countries': 'Có mặt tại các quốc gia',
    'easier.title': 'Cách Dễ Dàng Hơn Để<br/>Học Kỹ Năng Công Nghệ',
    'easier.description': 'TechTutor đơn giản hóa giáo dục công nghệ cho các gia đình. Dù bạn muốn học riêng 1-1 hay nhóm nhỏ, chúng tôi kết nối học viên với giảng viên chuyên nghiệp cho trải nghiệm học tập cá nhân hóa dựa trên dự án.',
    'easier.card1.title': 'Giảng Viên Chuyên Nghiệp',
    'easier.card1.description': 'Tất cả giảng viên đều có bằng Cử nhân Khoa học Máy tính, Công nghệ Thông tin hoặc Kỹ thuật Phần mềm với 6+ năm kinh nghiệm chuyên môn.',
    'easier.card2.title': 'Bảng Điều Khiển Phụ Huynh',
    'easier.card2.description': 'Theo dõi tiến độ, lên lịch học linh hoạt và nhận phản hồi chi tiết sau mỗi buổi học với bảng điều khiển dành cho phụ huynh.',
    'easier.card3.title': 'Học Trực Tuyến Giá Cả Phải Chăng',
    'easier.card3.description': 'Học trực tuyến với mức giá phải chăng với giảm giá gói lên đến 10%. Học từ nhà với chất lượng như lớp học trực tiếp.',
    'carousel.title': 'Xem Lớp Học Của Chúng Tôi',
    'carousel.description': 'Hãy xem các em học viên đang học, sáng tạo và vui chơi trong lớp học trực tuyến của chúng tôi!',
    'why.title': 'Tại Sao Chọn<br/>Dịch Vụ Của Chúng Tôi?',
    'why.description': 'Với hơn 4 năm kinh nghiệm và tỷ lệ giữ chân học viên 80-90%, TechTutor mang lại kết quả thực sự. Chúng tôi tập trung vào các dự án thực hành, kỹ năng thực tế và giữ cho việc học luôn vui vẻ và hấp dẫn cho mọi học sinh.',
    'why.point1': 'Hơn 4 năm thiết kế chương trình với tỷ lệ giữ chân học viên 80-90%',
    'why.point2': 'Mỗi học viên hoàn thành một dự án thực tế có thể trưng bày',
    'why.point3': 'Hình thức 1:1 hoặc nhóm nhỏ linh hoạt với phản hồi cá nhân',
    'why.point4': 'Hỗ trợ song ngữ Anh và Việt',
    'why.stat1': 'Học sinh hài lòng',
    'why.stat2': 'Buổi học đã giảng dạy',
    'why.stat3': 'Tỷ lệ giữ chân học viên',
    'testimonials.title': 'Khách Hàng Yêu Quý<br/>Nói Gì Về Chúng Tôi',
    'testimonials.subtitle': 'Phản hồi thực tế từ phụ huynh và học sinh đã trải nghiệm chương trình của chúng tôi',
    'testimonials.t1.role': 'Phụ huynh của Bảo Minh (10 tuổi)',
    'testimonials.t1.text': '"Bảo Minh đã học với Thầy Gleb được gần một năm rồi. Lúc đầu, con trai tôi rất nhút nhát và không biết bắt đầu từ đâu với máy tính. Giờ em tự tin xây dựng các trò chơi nhỏ và thậm chí còn tạo ra một chatbot AI cho dự án khoa học!"',
    'testimonials.t2.role': 'Phụ huynh của Gia Hân (12 tuổi)',
    'testimonials.t2.text': '"Con gái tôi đã học Thiết kế 3D và Phát triển Game Roblox với Thầy Mathan trong hơn một năm rưỡi. Em đã tạo ra hai trò chơi hoàn chỉnh và cải thiện cả kỹ năng làm việc nhóm và sự tự tin."',
    'testimonials.t3.role': 'Phụ huynh của Kian Reed (13 tuổi)',
    'testimonials.t3.text': '"Kian đã khám phá AI Tạo Sinh và lập trình Python với Thầy Mathan và giờ có hai dự án portfolio vững chắc. Phương pháp có cấu trúc và sáng tạo của TechTutor hoàn hảo cho các gia đình quốc tế."',
    'cta.partners.title': 'Liên Hệ Ngay<br/>Tham Gia Cộng Đồng<br/>Đối Tác Trường Học',
    'cta.partners.description': 'Hợp tác với TechTutor để mang giáo dục công nghệ tiên tiến đến trường học của bạn. Chúng tôi cung cấp chương trình tùy chỉnh, đào tạo giáo viên và hỗ trợ liên tục.',
    'cta.partners.button': 'Tham Gia Ngay',
    'pricing.title': 'Tìm <span style="color: #193b92;">gói học</span> phù hợp với bạn',
    'pricing.subtitle': 'Giá linh hoạt cho lớp học riêng hoặc nhóm',
    'pricing.private.title': 'Riêng tư (1 kèm 1)',
    'pricing.private.plan1': '1 khóa học (8 buổi)',
    'pricing.private.plan2': '2 khóa học (16 buổi) — <span class="font-semibold" style="color: #ff0000;">Giảm 5%</span>',
    'pricing.private.plan3': '3 khóa học (24 buổi) — <span class="font-semibold" style="color: #ff0000;">Giảm 10%</span>',
    'pricing.group.title': 'Nhóm nhỏ (2-4 học sinh)',
    'pricing.group.plan1': '1 khóa học (8 buổi)',
    'pricing.group.plan2': '2 khóa học (16 buổi) — <span class="font-semibold" style="color: #ff0000;">Giảm 5%</span>',
    'pricing.group.plan3': '3 khóa học (24 buổi) — <span class="font-semibold" style="color: #ff0000;">Giảm 10%</span>',
    'programs.title': 'Chương Trình Cho Mọi <span style="color: #193b92;">Lứa Tuổi</span>',
    'programs.subtitle': 'Chúng tôi có sự lựa chọn chương trình lớn nhất để học với các khóa học trực tuyến',
    'programs.scratch.title': 'Lập Trình Game Với Scratch',
    'programs.scratch.description': 'Học lập trình thông qua tạo game với khối lệnh trực quan của Scratch.',
    'programs.scratch.skills': 'Lập trình khối, logic, thiết kế game',
    'programs.roblox.title': 'Sáng Tạo Thế Giới Roblox',
    'programs.roblox.description': 'Sử dụng Roblox Studio và Lua để tạo thế giới chia sẻ đầy sống động.',
    'programs.roblox.skills': 'Lua, thiết kế 3D, kể chuyện sáng tạo',
    'programs.3d.title': 'Thiết Kế 3D',
    'programs.3d.description': 'Học quy trình Blender cho các cảnh 3D chuyên nghiệp.',
    'programs.3d.skills': 'Mô hình 3D, quy trình thiết kế, cơ bản Python',
    'programs.app.title': 'Phát Triển Ứng Dụng',
    'programs.app.description': 'Xây dựng ứng dụng di động thực tế với giao diện trực quan Thunkable.',
    'programs.app.skills': 'Thunkable, thiết kế ứng dụng, UI/UX',
    'programs.gdevelop.title': 'Thiết Kế Game GDevelop',
    'programs.gdevelop.description': 'Tạo game 2D với lập trình trực quan và xuất bản chúng.',
    'programs.gdevelop.skills': 'GDevelop, thiết kế game, lập trình trực quan',
    'programs.ai.title': 'Hành Trình AI & Lập Trình',
    'programs.ai.description': 'Kết hợp lập trình Python với machine learning để tạo game thông minh.',
    'programs.ai.skills': 'Python, machine learning, AI',
    'programs.genai.title': 'Phép Màu AI Tạo Sinh',
    'programs.genai.description': 'Sử dụng công cụ AI làm đối tác sáng tạo và xây dựng dự án AI có trách nhiệm.',
    'programs.genai.skills': 'Kỹ thuật prompt, tích hợp AI',
    'blog.title': 'Nội Dung Hữu Ích<br/>Dành Cho Bạn',
    'blog.subtitle': 'Khám phá dự án học sinh, câu chuyện thành công và tài nguyên học tập của chúng tôi',
    'blog.card1.tag': 'DỰ ÁN',
    'blog.card1.title': '10 Cách Học Sinh Của Chúng Tôi Xuất Sắc Trong Công Nghệ',
    'blog.card1.description': 'Xem học sinh của chúng tôi chuyển đổi từ người mới bắt đầu thành người sáng tạo tự tin...',
    'blog.card2.tag': 'GIÁO DỤC',
    'blog.card2.title': 'Làm Thế Nào Để Học Công Nghệ Như Đang Chơi',
    'blog.card2.description': 'Biến giáo dục công nghệ thành một cuộc phiêu lưu thú vị với những chiến lược đã được chứng minh...',
    'blog.card3.tag': 'NUÔI DẠY CON',
    'blog.card3.title': 'Cách Phát Hiện Và Nuôi Dưỡng Kỹ Năng Công Nghệ Của Con Bạn',
    'blog.card3.description': 'Tìm hiểu cách xác định tài năng công nghệ của con bạn và hỗ trợ sự phát triển của chúng...',
    'blog.card4.tag': 'DỰ ÁN',
    'blog.card4.title': 'Khai Phá Tiềm Năng Với Học Tập Dựa Trên Dự Án',
    'blog.card4.description': 'Vì sao học qua dự án giúp trẻ hứng thú hơn và sẵn sàng cho tương lai.',
    'blog.read_more': 'Đọc Thêm',
    'trial.title': 'Bắt Đầu Với Buổi Học <span style="color: #193b92;">MIỄN PHÍ</span>',
    'trial.description': 'Chỉ trong 90 phút: nhận tư vấn miễn phí chuyên sâu và lộ trình từ giảng viên của chúng tôi. Chia sẻ thông tin của bạn bên dưới và chúng tôi sẽ sắp xếp lịch trong vòng 24 giờ.',
    'trial.form.parent_name': 'Tên Phụ Huynh',
    'trial.form.child_name': 'Tên Con',
    'trial.form.email': 'Email',
    'trial.form.phone': 'Số Điện Thoại (Zalo/WhatsApp)',
    'trial.form.age': 'Tuổi',
    'trial.form.submit': 'Đặt Lịch Học Thử Miễn Phí',
    'footer.copyright': '© 2025 TechTutor Academy. Bảo lưu mọi quyền.',
    'footer.bilingual': 'Hỗ trợ song ngữ Anh / Việt'
  }
};

// Language switcher
function switchLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });
}

// Export for compatibility with site.js
window.pageTranslations = translations;

// Initialize language switcher
document.addEventListener('DOMContentLoaded', function() {
  const langButtons = document.querySelectorAll('[data-lang]');

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang;

      langButtons.forEach(button => {
        if (button.dataset.lang === selectedLang) {
          button.classList.add('bg-primary', 'text-white');
          button.classList.remove('text-gray-500', 'hover:bg-white');
          button.setAttribute('aria-pressed', 'true');
        } else {
          button.classList.remove('bg-primary', 'text-white');
          button.classList.add('text-gray-500', 'hover:bg-white');
          button.setAttribute('aria-pressed', 'false');
        }
      });

      try {
        localStorage.setItem('tt-lang', selectedLang);
      } catch (e) {}

      switchLanguage(selectedLang);
    });
  });

  // Load saved language preference
  try {
    const savedLang = localStorage.getItem('tt-lang');
    if (savedLang === 'vi') {
      const viBtn = document.querySelector('[data-lang="vi"]');
      if (viBtn) viBtn.click();
    } else {
      const enBtn = document.querySelector('[data-lang="en"]');
      if (enBtn) {
        enBtn.classList.add('bg-primary', 'text-white');
        enBtn.classList.remove('text-gray-500', 'hover:bg-white');
        enBtn.setAttribute('aria-pressed', 'true');
      }
      if (!savedLang) {
        localStorage.setItem('tt-lang', 'en');
      }
    }
  } catch (e) {
    // Default to English on error
  }
});
