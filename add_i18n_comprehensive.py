#!/usr/bin/env python3
"""
Comprehensive i18n Attribute Addition Script for TechTutor VN Pages
This script adds data-i18n attributes to ALL untranslated text elements
across all Vietnamese pages and updates translations.js
"""

import os
import re
from pathlib import Path
from bs4 import BeautifulSoup

# Base directory
BASE_DIR = Path(r"c:\Users\Manthan\.vscode\techtutor")
VN_DIR = BASE_DIR / "vn"
JS_DIR = BASE_DIR / "js"

# Comprehensive mapping of text content to translation keys
# Format: (text_pattern, translation_key, is_placeholder)
TRANSLATION_MAPPINGS = [
    # Navigation elements
    ("Login", "nav.login", False),
    ("Menu", "nav.menu", False),

    # Promo button and modal
    ("Special Offer", "promo.badge", False),
    ("Up to.*?20% off", "promo.text", False),
    ("LIMITED TIME OFFER", "promo.modal.badge", False),
    ("Get Up to 20% Off Today!", "promo.modal.title", False),
    ("Book your free trial now and get up to 20% off your first course bundle", "promo.modal.description", False),
    ("Claim 20% Discount", "promo.modal.submit", False),

    # Footer
    ("CONTACT US!", "footer.contact.title", False),
    ("Tel/WA/Zalo:", "footer.contact.phone_label", False),
    ("Email:", "footer.contact.email_label", False),
    ("OPENING HOURS", "footer.hours.title", False),
    ("Monday - Friday: 8am - 9pm", "footer.hours.weekday", False),
    ("Saturday - Sunday: 8am - 8pm", "footer.hours.weekend", False),
    ("START LEARNING", "footer.learning.title", False),
    ("Programs", "footer.learning.programs", False),
    ("Projects", "footer.learning.projects", False),
    ("Pricing", "footer.learning.pricing", False),
    ("Blog", "footer.learning.blog", False),
    ("Our Vision", "footer.learning.vision", False),
    ("Free trial", "footer.learning.trial", False),
    ("CONNECT WITH US!", "footer.social.title", False),

    # Form placeholders
    ("Parent Name", "form.parent_name", True),
    ("Child Name", "form.child_name", True),
    ("Email", "form.email", True),
    ("Phone \\(Zalo/WhatsApp\\)", "form.phone", True),
    ("Child Age", "form.child_age", True),
    ("Age", "form.age", True),

    # Scratch program page
    ("BEGINNER FRIENDLY", "program.scratch.badge", False),
    ("Master Game Creation.*?with.*?Scratch", "program.scratch.hero.title", False),
    ("Are you tired of your child just playing games\\?.*?no typing required\\.", "program.scratch.hero.description", False),
    ("Get Started →", "program.scratch.hero.cta", False),
    ("4\\.9/5.*?rating", "program.scratch.rating", False),
    ("95\\+.*?projects created", "program.scratch.projects", False),
    ("New Skills with.*?Scratch.*?A Detailed Look at Our Curriculum", "program.scratch.curriculum.heading", False),
    ("With real-world projects to create and online classes that fit a busy routine", "program.scratch.curriculum.subtitle", False),
    ("Learn at your own pace", "program.scratch.card1.title", False),
    ("Scratch teachers are everyday creatives.*?complex game mechanics\\.", "program.scratch.card1.desc", False),
    ("Build Real Games", "program.scratch.card2.title", False),
    ("Create maze adventures.*?friends and family\\.", "program.scratch.card2.desc", False),
    ("Creative & Logical Thinking", "program.scratch.card3.title", False),
    ("Design unique characters.*?through visual coding\\.", "program.scratch.card3.desc", False),
    ("Join Global Community", "program.scratch.card4.title", False),
    ("Publish projects to the worldwide.*?their creativity\\.", "program.scratch.card4.desc", False),
    ("What You'll Master", "program.scratch.tools.title", False),
    ("Scratch Platform", "program.scratch.tool1.title", False),
    ("MIT's visual programming language designed specifically for young learners", "program.scratch.tool1.desc", False),
    ("Logic & Sequencing", "program.scratch.tool2.title", False),
    ("Master loops, conditionals, variables, and algorithmic thinking", "program.scratch.tool2.desc", False),
    ("Digital Art & Animation", "program.scratch.tool3.title", False),
    ("Create sprites, design backgrounds, and animate your characters", "program.scratch.tool3.desc", False),
    ("Ready to Start Coding\\?", "program.scratch.cta.title", False),
    ("Book a free trial lesson and watch your child create their first game!", "program.scratch.cta.subtitle", False),
    ("Book Free Trial Now →", "program.scratch.cta.button", False),

    # Blog page
    ("TechTutor Blog", "blog.hero.title", False),
    ("Insights, tips, and stories about tech education for kids.*?coding journey\\.", "blog.hero.description", False),
    ("FEATURED", "blog.featured.badge", False),
    ("How to Make Learning Tech Feel Like Playtime", "blog.featured.title", False),
    ("Discover how to transform tech education.*?fun, engaging, and effective\\.", "blog.featured.description", False),
    ("Read Article", "blog.featured.cta", False),
    ("Latest Articles", "blog.section_title", False),
    ("EDUCATION", "blog.post1.category", False),
    ("Transform tech education into an exciting adventure.*?fun and engaging\\.", "blog.post1.description", False),
    ("Read more →", "blog.post1.cta", False),
    ("PARENTING", "blog.post2.category", False),
    ("How to Spot and Nurture Your Child's Technology Skill", "blog.post2.title", False),
    ("Learn how to identify your child's tech talents.*?practical tips\\.", "blog.post2.description", False),
    ("PROJECTS", "blog.post3.category", False),
    ("Unlocking Your Child's Potential With Project-Based Learning", "blog.post3.title", False),
    ("See why hands-on.*?ready for the future\\.", "blog.post3.description", False),
    ("Want More Tips & Updates\\?", "blog.newsletter.title", False),
    ("Book a free trial and join our community of tech-savvy families!", "blog.newsletter.description", False),
    ("Book Free Trial Now", "blog.newsletter.cta", False),

    # How It Works page
    ("How Our Classes Work", "how.hero.title", False),
    ("Live, interactive Zoom classes that fit your schedule.*?1-on-1 sessions\\.", "how.hero.description", False),
    ("Start Your Journey", "how.hero.cta", False),
    ("Live on Zoom", "how.live.badge", False),
    ("Flexible Times", "how.flexible.badge", False),
    ("Live Online Classes via Zoom", "how.format.title", False),
    ("All our classes are conducted live on Zoom.*?with instructors and peers\\.", "how.format.subtitle", False),
    ("Face-to-face interaction with instructors.*?No pre-recorded videos\\.", "how.format.card1.description", False),
    ("Classes 1-5 times per week.*?optimal learning progress\\.", "how.format.card2.description", False),
    ("Small Groups or 1-on-1", "how.format.card3.title", False),
    ("Choose between personalized 1-on-1 sessions.*?collaborative learning\\.", "how.format.card3.description", False),
    ("See Our Classes in Action", "how.gallery.title", False),

    # Plans & FAQ page
    ("Plans & Pricing", "plans.hero.title", False),
    ("Flexible pricing for private or group lessons.*?your family\\.", "plans.hero.subtitle", False),
    ("Private \\(1 on 1\\)", "plans.private.title", False),
    ("1 course \\(8 lessons\\)", "plans.option1", False),
    ("2 courses \\(16 lessons\\)", "plans.option2", False),
    ("3 courses \\(24 lessons\\)", "plans.option3", False),
    ("5% off", "plans.discount5", False),
    ("10% off", "plans.discount10", False),
    ("Best for:", "plans.best_for", False),
    ("Students who want personalized attention and a custom learning pace\\.", "plans.private.desc", False),
    ("Small group \\(2-4 students\\)", "plans.group.title", False),
    ("Students who enjoy collaborative learning and want more affordable pricing\\.", "plans.group.desc", False),
    ("What's Included", "plans.included.title", False),
    ("60-90 Min Lessons", "plans.included.lessons.title", False),
    ("Focused, project-based learning sessions", "plans.included.lessons.desc", False),
    ("Expert Instructors", "plans.included.instructors.title", False),
    ("6\\+ years experience with Bachelor's degrees in CS, IT, or Software Engineering", "plans.included.instructors.desc", False),
    ("Progress Reports", "plans.included.reports.title", False),
    ("Detailed feedback after every lesson", "plans.included.reports.desc", False),
    ("Certificate", "plans.included.certificate.title", False),
    ("Course completion certificate for portfolio", "plans.included.certificate.desc", False),
    ("Flexible Scheduling", "plans.included.scheduling.title", False),
    ("Book lessons at times that work for you", "plans.included.scheduling.desc", False),
    ("All Materials Included", "plans.included.materials.title", False),
    ("Software, tools, and project resources", "plans.included.materials.desc", False),
    ("Frequently Asked Questions", "plans.faq.title", False),
    ("What age groups do you teach\\?", "plans.faq.q1.question", False),
    ("We teach students aged 6-16.*?12-16\\)\\.", "plans.faq.q1.answer", False),
    ("Do students need prior coding experience\\?", "plans.faq.q2.question", False),
    ("No prior experience is needed.*?AI & Programming\\.", "plans.faq.q2.answer", False),
    ("How long is each lesson\\?", "plans.faq.q3.question", False),

    # Online Courses page
    ("Self-paced micro-courses", "courses.hero.pill", False),
    ("Free Tech Courses You Can Start Now", "courses.hero.title", False),
    ("Stream short TechTutor lessons.*?hit play and learn\\.", "courses.hero.description", False),
    ("self-paced tracks", "courses.hero.stat1", False),
    ("minute sprints", "courses.hero.stat2", False),
    ("Watch anywhere \\| Track progress \\| Earn badges", "courses.hero.note", False),
    ("AI", "courses.tag.ai", False),
    ("Coding", "courses.tag.coding", False),
    ("Game Design", "courses.tag.gamedesign", False),
    ("AI creativity lab", "courses.ai.pill", False),
    ("Generative AI Foundations", "courses.ai.title", False),
    ("Duration: 30 mins", "courses.duration", False),
    ("3 lessons", "courses.lessons", False),
    ("Build an AI studio notebook.*?mini showcase page\\.", "courses.ai.summary", False),
    ("What you'll learn:", "courses.learn", False),
    ("Compare text vs\\. image vs\\. audio models.*?hands-on prompts\\.", "courses.ai.point1", False),
    ("Use structured templates to iterate ideas before publishing\\.", "courses.ai.point2", False),
    ("Write a responsible AI manifesto reviewed by TechTutor mentors\\.", "courses.ai.point3", False),
    ("Enroll now", "courses.enroll", False),
    ("Creative storytelling", "courses.scratch.pill", False),
    ("Scratch Story Studio", "courses.scratch.title", False),
    ("Design animated scenes.*?narrate with music\\.", "courses.scratch.summary", False),
    ("Storyboard plot twists using the printable planner\\.", "courses.scratch.point1", False),
    ("Practice loops, sounds, and broadcast messages\\.", "courses.scratch.point2", False),
    ("Publish a remixable Scratch project link\\.", "courses.scratch.point3", False),
    ("Coming soon", "courses.coming_soon", False),
    ("3D build sprint", "courses.roblox.pill", False),
    ("Roblox Speedbuild Challenge", "courses.roblox.title", False),
    ("Shape a mini obby.*?camera polish\\.", "courses.roblox.summary", False),
    ("Follow the build checklist to map obstacles quickly\\.", "courses.roblox.point1", False),
    ("Drop in Lua snippets for timers and checkpoints\\.", "courses.roblox.point2", False),
    ("Playtest with physics tips to smooth the run\\.", "courses.roblox.point3", False),
    ("Loved the free course\\?", "courses.cta.title", False),
    ("Book a free lesson now and let our mentors.*?your learner\\.", "courses.cta.description", False),
    ("Book a Free Lesson Now →", "courses.cta.primary", False),

    # Student Projects page
    ("Amazing Student.*?Projects", "projects.hero.title", False),
    ("See what our talented students are creating.*?TechTutor Academy\\.", "projects.hero.description", False),
    ("Start Your Journey", "projects.hero.cta", False),
    ("Diverse Project Types", "projects.diverse.title", False),
    ("Students create games, apps, AI projects.*?platforms and tools\\.", "projects.diverse.description", False),
    ("Real-World Skills", "projects.skills.title", False),
    ("Students apply programming.*?portfolio-worthy projects\\.", "projects.skills.description", False),
    ("Showcase & Share", "projects.showcase.title", False),
    ("Students publish their projects online.*?friends and family\\.", "projects.showcase.description", False),
    ("GENERATIVE AI", "projects.genai.category", False),
    ("AI-Powered Storytelling", "projects.genai.title", False),
    ("Student:", "projects.student_label", False),
    ("Focus:", "projects.focus_label", False),
    ("Storytelling with AI voice, music, and visuals\\.", "projects.genai.focus", False),
    ("Tools Used", "projects.tools_label", False),
    ("ROBLOX WORLD CREATOR", "projects.roblox.category", False),
    ("Reaction Obby Challenge", "projects.roblox.title", False),
    ("Reaction-based obby with timers and custom scripting\\.", "projects.roblox.focus", False),
    ("AI & PROGRAMMING QUEST", "projects.ai.category", False),
    ("Computer Vision Classifier", "projects.ai.title", False),
    ("Training custom classifiers with computer vision tools\\.", "projects.ai.focus", False),
    ("APP DEVELOPMENT", "projects.app.category", False),
    ("Habit Tracker App", "projects.app.title", False),
    ("Prototyping a personal habit tracker with Thunkable\\.", "projects.app.focus", False),
    ("SCRATCH GAME CODER", "projects.scratch.category", False),
    ("Interactive Story Adventure", "projects.scratch.title", False),
    ("Interactive story coding fundamentals with Scratch blocks\\.", "projects.scratch.focus", False),
    ("Want Your Child to Create Projects Like These\\?", "projects.cta.title", False),
    ("Book a free trial lesson and see what your child can build!", "projects.cta.description", False),
]

# Vietnamese translations to add
VIETNAMESE_TRANSLATIONS = {
    # Navigation
    "nav.login": "Đăng Nhập",
    "nav.menu": "Menu",

    # Promo
    "promo.badge": "Ưu Đãi Đặc Biệt",
    "promo.text": "Giảm giá<br class=\"md:hidden\"/> lên đến 20%",
    "promo.modal.badge": "ƯU ĐÃI CÓ THỜI HẠN",
    "promo.modal.title": "Nhận Giảm Giá Lên Đến 20% Hôm Nay!",
    "promo.modal.description": "Đặt lịch học thử miễn phí ngay và nhận giảm giá lên đến 20% cho gói khóa học đầu tiên",
    "promo.modal.submit": "Nhận Giảm Giá 20%",

    # Footer
    "footer.contact.title": "LIÊN HỆ CHÚNG TÔI!",
    "footer.contact.phone_label": "Tel/WA/Zalo:",
    "footer.contact.email_label": "Email:",
    "footer.hours.title": "GIỜ MỞ CỬA",
    "footer.hours.weekday": "Thứ Hai - Thứ Sáu: 8am - 9pm",
    "footer.hours.weekend": "Thứ Bảy - Chủ Nhật: 8am - 8pm",
    "footer.learning.title": "BẮT ĐẦU HỌC",
    "footer.learning.programs": "Chương Trình",
    "footer.learning.projects": "Dự Án",
    "footer.learning.pricing": "Học Phí",
    "footer.learning.blog": "Blog",
    "footer.learning.vision": "Tầm Nhìn Của Chúng Tôi",
    "footer.learning.trial": "Học thử miễn phí",
    "footer.social.title": "KẾT NỐI VỚI CHÚNG TÔI!",

    # Forms
    "form.parent_name": "Tên Phụ Huynh",
    "form.child_name": "Tên Con",
    "form.email": "Email",
    "form.phone": "Số Điện Thoại (Zalo/WhatsApp)",
    "form.child_age": "Tuổi Con",
    "form.age": "Tuổi",

    # Scratch Program Page
    "program.scratch.badge": "THÂN THIỆN VỚI NGƯỜI MỚI",
    "program.scratch.hero.title": "Làm Chủ Tạo Game<br/>với <span style=\"color: #193b92;\">Scratch</span>",
    "program.scratch.hero.description": "Bạn có mệt mỏi khi con bạn chỉ chơi game không? Biến chúng thành người sáng tạo! Học các nguyên tắc lập trình cơ bản bằng cách xây dựng các trò chơi vui nhộn, hoạt hình và câu chuyện tương tác với các khối màu sắc - không cần gõ phím.",
    "program.scratch.hero.cta": "Bắt Đầu →",
    "program.scratch.rating": "<span class=\"font-semibold text-ink\">4.9/5</span> đánh giá",
    "program.scratch.projects": "<span class=\"font-semibold text-ink\">95+</span> dự án được tạo",
    "program.scratch.curriculum.heading": "Kỹ Năng Mới Với <span style=\"color: #193b92;\">Scratch</span>.<br/>Cái Nhìn Chi Tiết Về Chương Trình Học",
    "program.scratch.curriculum.subtitle": "Với các dự án thực tế để tạo và các lớp học trực tuyến phù hợp với lịch bận rộn",
    "program.scratch.card1.title": "Học với tốc độ của riêng bạn",
    "program.scratch.card1.desc": "Các giáo viên Scratch là những nhà sáng tạo và chuyên gia muốn chia sẻ niềm đam mê của họ. Bắt đầu với lập trình dựa trên khối và phát triển tự nhiên thành những cơ chế trò chơi phức tạp.",
    "program.scratch.card2.title": "Xây Dựng Game Thực Tế",
    "program.scratch.card2.desc": "Tạo các trò chơi mê cung, trò chơi bắt, nền tảng và câu chuyện tương tác. Mỗi bài học xây dựng hướng tới một dự án hoàn chỉnh mà con bạn có thể chia sẻ với bạn bè và gia đình.",
    "program.scratch.card3.title": "Tư Duy Sáng Tạo & Lô Gic",
    "program.scratch.card3.desc": "Thiết kế các ký tự, nền và hoạt hình độc đáo trong khi phát triển kỹ năng giải quyết vấn đề. Học cách suy nghĩ như một lập trình viên thông qua lập trình trực quan.",
    "program.scratch.card4.title": "Tham Gia Cộng Đồng Toàn Cầu",
    "program.scratch.card4.desc": "Xuất bản dự án cho cộng đồng Scratch trên toàn thế giới với hàng triệu nhà sáng tạo. Chơi các trò chơi được tạo bởi trẻ em trên khắp thế giới và lấy cảm hứng từ sự sáng tạo của họ.",
    "program.scratch.tools.title": "Những Gì Bạn Sẽ Làm Chủ",
    "program.scratch.tool1.title": "Nền Tảng Scratch",
    "program.scratch.tool1.desc": "Ngôn ngữ lập trình trực quan của MIT được thiết kế đặc biệt cho những học viên trẻ",
    "program.scratch.tool2.title": "Lô Gic & Sequencing",
    "program.scratch.tool2.desc": "Làm chủ vòng lặp, điều kiện, biến và tư duy thuật toán",
    "program.scratch.tool3.title": "Nghệ Thuật & Hoạt Hình Kỹ Thuật Số",
    "program.scratch.tool3.desc": "Tạo sprite, thiết kế nền và tạo hoạt hình cho các ký tự của bạn",
    "program.scratch.cta.title": "Sẵn Sàng Bắt Đầu Lập Trình?",
    "program.scratch.cta.subtitle": "Đặt lịch học thử miễn phí và xem con bạn tạo trò chơi đầu tiên của mình!",
    "program.scratch.cta.button": "Đặt Lịch Học Thử Ngay →",

    # Blog
    "blog.hero.title": "Blog TechTutor",
    "blog.hero.description": "Thông tin chi tiết, mẹo và câu chuyện về giáo dục công nghệ cho trẻ em. Tìm hiểu cách hỗ trợ hành trình lập trình của con bạn.",
    "blog.featured.badge": "NỔI BẬT",
    "blog.featured.title": "Làm Thế Nào Để Học Công Nghệ Như Đang Chơi",
    "blog.featured.description": "Khám phá cách biến giáo dục công nghệ thành một cuộc phiêu lưu thú vị cho con bạn. Tìm hiểu bí quyết làm cho lập trình và công nghệ trở nên vui vẻ, hấp dẫn và hiệu quả.",
    "blog.featured.cta": "Đọc Bài Viết",
    "blog.section_title": "Bài Viết Mới Nhất",
    "blog.post1.category": "GIÁO DỤC",
    "blog.post1.description": "Biến giáo dục công nghệ thành một cuộc phiêu lưu thú vị với những chiến lược đã được chứng minh để làm cho việc học vui vẻ và hấp dẫn.",
    "blog.post1.cta": "Đọc thêm →",
    "blog.post2.category": "NUÔI DẠY CON",
    "blog.post2.title": "Cách Phát Hiện Và Nuôi Dưỡng Kỹ Năng Công Nghệ Của Con Bạn",
    "blog.post2.description": "Tìm hiểu cách xác định tài năng công nghệ của con bạn và hỗ trợ sự phát triển của chúng với hướng dẫn chuyên nghiệp và mẹo thực tế.",
    "blog.post3.category": "DỰ ÁN",
    "blog.post3.title": "Khai Phá Tiềm Năng Với Học Tập Dựa Trên Dự Án",
    "blog.post3.description": "Xem vì sao học qua dự án giúp trẻ hứng thú hơn, tự tin hơn và sẵn sàng cho tương lai.",
    "blog.newsletter.title": "Muốn Nhiều Mẹo & Cập Nhật Hơn?",
    "blog.newsletter.description": "Đặt lịch học thử miễn phí và tham gia cộng đồng các gia đình am hiểu công nghệ!",
    "blog.newsletter.cta": "Đặt Lịch Học Thử Ngay",

    # How It Works
    "how.hero.title": "Cách Lớp Học Của Chúng Tôi Hoạt Động",
    "how.hero.description": "Lớp học Zoom trực tiếp, tương tác phù hợp với lịch trình của bạn. Học từ giảng viên chuyên nghiệp trong các nhóm nhỏ hoặc buổi học 1-1.",
    "how.hero.cta": "Bắt Đầu Hành Trình",
    "how.live.badge": "Trực Tiếp Trên Zoom",
    "how.flexible.badge": "Thời Gian Linh Hoạt",
    "how.format.title": "Lớp Học Trực Tuyến Trực Tiếp Qua Zoom",
    "how.format.subtitle": "Tất cả các lớp học của chúng tôi được thực hiện trực tiếp trên Zoom, giúp học sinh tương tác theo thời gian thực với giảng viên và bạn bè.",
    "how.format.card1.description": "Tương tác trực tiếp với giảng viên qua các buổi học video trực tuyến. Không có video được ghi sẵn.",
    "how.format.card2.description": "Lớp học 1-5 lần mỗi tuần. Chúng tôi khuyến nghị 2-3 buổi học mỗi tuần để tiến bộ học tập tốt nhất.",
    "how.format.card3.title": "Nhóm Nhỏ hoặc 1-1",
    "how.format.card3.description": "Chọn giữa các buổi học 1-1 cá nhân hóa hoặc các lớp nhóm nhỏ (2-4 học sinh) để học cùng nhau.",
    "how.gallery.title": "Xem Lớp Học Của Chúng Tôi",

    # Plans & FAQ
    "plans.hero.title": "Gói Học & Giá Cả",
    "plans.hero.subtitle": "Giá linh hoạt cho lớp học riêng hoặc nhóm. Chọn gói phù hợp nhất với gia đình bạn.",
    "plans.private.title": "Riêng tư (1 kèm 1)",
    "plans.option1": "1 khóa học (8 buổi)",
    "plans.option2": "2 khóa học (16 buổi)",
    "plans.option3": "3 khóa học (24 buổi)",
    "plans.discount5": "Giảm 5%",
    "plans.discount10": "Giảm 10%",
    "plans.best_for": "Tốt nhất cho:",
    "plans.private.desc": "Học sinh muốn sự chú ý cá nhân và tốc độ học tùy chỉnh.",
    "plans.group.title": "Nhóm nhỏ (2-4 học sinh)",
    "plans.group.desc": "Học sinh thích học cùng nhau và muốn giá cả phải chăng hơn.",
    "plans.included.title": "Những Gì Được Bao Gồm",
    "plans.included.lessons.title": "Buổi Học 60-90 Phút",
    "plans.included.lessons.desc": "Các buổi học tập trung, dựa trên dự án",
    "plans.included.instructors.title": "Giảng Viên Chuyên Nghiệp",
    "plans.included.instructors.desc": "6+ năm kinh nghiệm với bằng Cử nhân Khoa học Máy tính, Công nghệ Thông tin hoặc Kỹ thuật Phần mềm",
    "plans.included.reports.title": "Báo Cáo Tiến Độ",
    "plans.included.reports.desc": "Phản hồi chi tiết sau mỗi buổi học",
    "plans.included.certificate.title": "Chứng Nhận",
    "plans.included.certificate.desc": "Chứng nhận hoàn thành khóa học cho hồ sơ",
    "plans.included.scheduling.title": "Lịch Học Linh Hoạt",
    "plans.included.scheduling.desc": "Đặt lịch học vào thời gian phù hợp với bạn",
    "plans.included.materials.title": "Tất Cả Tài Liệu Được Bao Gồm",
    "plans.included.materials.desc": "Phần mềm, công cụ và tài nguyên dự án",
    "plans.faq.title": "Câu Hỏi Thường Gặp",
    "plans.faq.q1.question": "Bạn dạy các nhóm tuổi nào?",
    "plans.faq.q1.answer": "Chúng tôi dạy học sinh từ 6-16 tuổi. Các chương trình của chúng tôi được thiết kế cho các cấp độ kỹ năng khác nhau: Scratch (6-10 tuổi), Roblox và GDevelop (8-15 tuổi), Thiết kế 3D và AI & Lập trình (10-16 tuổi), và Phát triển Ứng dụng (12-16 tuổi).",
    "plans.faq.q2.question": "Học sinh có cần kinh nghiệm lập trình trước đó không?",
    "plans.faq.q2.answer": "Không cần kinh nghiệm trước đó! Chúng tôi có các chương trình thân thiện với người mới bắt đầu như Scratch và GDevelop bắt đầu từ những điều cơ bản. Đối với học sinh có một số kinh nghiệm, chúng tôi cung cấp các chương trình nâng cao hơn như Phát triển Ứng dụng và AI & Lập trình.",
    "plans.faq.q3.question": "Mỗi buổi học dài bao lâu?",

    # Online Courses
    "courses.hero.pill": "Khóa học tự học",
    "courses.hero.title": "Khóa Công Nghệ Miễn Phí Bắt Đầu Ngay",
    "courses.hero.description": "Xem bài học ngắn của TechTutor và làm hoạt động hướng dẫn. Không cần biểu mẫu - bấm play là học.",
    "courses.hero.stat1": "lộ trình tự học",
    "courses.hero.stat2": "buổi 30 phút",
    "courses.hero.note": "Học mọi nơi | Theo dõi tiến độ | Nhận huy hiệu",
    "courses.tag.ai": "AI",
    "courses.tag.coding": "Lập Trình",
    "courses.tag.gamedesign": "Thiết Kế Game",
    "courses.ai.pill": "Phòng thí nghiệm AI sáng tạo",
    "courses.ai.title": "Nền Tảng AI Tạo Sinh",
    "courses.duration": "Thời lượng: 30 phút",
    "courses.lessons": "3 bài học",
    "courses.ai.summary": "Tạo sổ tay AI studio, ghi lại quy tắc an toàn và xuất bản trang showcase nhỏ.",
    "courses.learn": "Bạn sẽ học được:",
    "courses.ai.point1": "So sánh mô hình văn bản, hình ảnh, âm thanh với prompt thực hành.",
    "courses.ai.point2": "Dùng mẫu có cấu trúc để lặp ý tưởng trước khi đăng.",
    "courses.ai.point3": "Viết tuyên ngôn AI có trách nhiệm và được mentor duyệt.",
    "courses.enroll": "Đăng ký ngay",
    "courses.scratch.pill": "Kể chuyện sáng tạo",
    "courses.scratch.title": "Xưởng Câu Chuyện Scratch",
    "courses.scratch.summary": "Thiết kế cảnh hoạt hình, kích hoạt sự kiện bằng broadcast và kể chuyện với nhạc.",
    "courses.scratch.point1": "Lập storyboard bằng mẫu in sẵn.",
    "courses.scratch.point2": "Luyện vòng lặp, âm thanh và broadcast.",
    "courses.scratch.point3": "Xuất bản liên kết Scratch có thể remix.",
    "courses.coming_soon": "Sắp ra mắt",
    "courses.roblox.pill": "Sprint xây 3D",
    "courses.roblox.title": "Thử Thách Tốc Độ Roblox",
    "courses.roblox.summary": "Tạo obby mini với công cụ địa hình, bẫy script và camera mượt.",
    "courses.roblox.point1": "Theo checklist để phác thảo chướng ngại nhanh.",
    "courses.roblox.point2": "Thêm đoạn Lua cho bộ đếm thời gian và checkpoint.",
    "courses.roblox.point3": "Test với mẹo vật lý để chạy mượt.",
    "courses.cta.title": "Thích khóa miễn phí vừa học?",
    "courses.cta.description": "Đặt buổi học thử miễn phí để mentor cá nhân hóa lộ trình tiếp theo cho học viên của bạn.",
    "courses.cta.primary": "Đặt Học Thử Miễn Phí Ngay →",

    # Student Projects
    "projects.hero.title": "Dự Án Tuyệt Vời<br/><span style=\"color: #193b92;\">Của Học Viên</span>",
    "projects.hero.description": "Xem những gì học viên tài năng của chúng tôi đang tạo ra! Từ ứng dụng AI đến game và thiết kế 3D, khám phá những dự án tuyệt vời được xây dựng bởi các nhà đổi mới trẻ tuổi tại TechTutor Academy.",
    "projects.hero.cta": "Bắt Đầu Hành Trình",
    "projects.diverse.title": "Các Loại Dự Án Đa Dạng",
    "projects.diverse.description": "Học viên tạo ra game, ứng dụng, dự án AI, thiết kế 3D và nhiều hơn nữa trên nhiều nền tảng và công cụ khác nhau.",
    "projects.skills.title": "Kỹ Năng Thực Tế",
    "projects.skills.description": "Học viên áp dụng kỹ năng lập trình, thiết kế và giải quyết vấn đề để xây dựng các dự án đủ tư cách cho hồ sơ.",
    "projects.showcase.title": "Trưng Bày & Chia Sẻ",
    "projects.showcase.description": "Học viên công bố dự án của mình trực tuyến và chia sẻ những sáng tạo với bạn bè và gia đình.",
    "projects.genai.category": "AI TẠO SINH",
    "projects.genai.title": "Kể Chuyện Với AI",
    "projects.student_label": "Học viên:",
    "projects.focus_label": "Trọng tâm:",
    "projects.genai.focus": "Kể chuyện với giọng nói AI, nhạc và hình ảnh.",
    "projects.tools_label": "Công Cụ Sử Dụng",
    "projects.roblox.category": "SÁNG TẠO THẾ GIỚI ROBLOX",
    "projects.roblox.title": "Thử Thách Obby Phản Ứng",
    "projects.roblox.focus": "Obby dựa trên phản ứng với bộ đếm thời gian và lập trình tùy chỉnh.",
    "projects.ai.category": "NHIỆM VỤ AI & LẬP TRÌNH",
    "projects.ai.title": "Phân Loại Thị Giác Máy Tính",
    "projects.ai.focus": "Huấn luyện bộ phân loại tùy chỉnh với công cụ thị giác máy tính.",
    "projects.app.category": "PHÁT TRIỂN ỨNG DỤNG",
    "projects.app.title": "Ứng Dụng Theo Dõi Thói Quen",
    "projects.app.focus": "Tạo mẫu ứng dụng theo dõi thói quen cá nhân với Thunkable.",
    "projects.scratch.category": "LẬP TRÌNH GAME SCRATCH",
    "projects.scratch.title": "Câu Chuyện Tương Tác",
    "projects.scratch.focus": "Lập trình câu chuyện tương tác cơ bản với khối Scratch.",
    "projects.cta.title": "Muốn Con Bạn Tạo Ra Những Dự Án Như Thế Này?",
    "projects.cta.description": "Đặt lịch học thử miễn phí và xem con bạn có thể xây dựng gì!",
}


def add_i18n_to_html(file_path):
    """Add data-i18n attributes to HTML elements that need translation."""
    print(f"\nProcessing: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')
    changes_made = 0

    for text_pattern, trans_key, is_placeholder in TRANSLATION_MAPPINGS:
        # Skip if this key already exists in the file
        if f'data-i18n="{trans_key}"' in content or f"data-i18n='{trans_key}'" in content:
            continue

        if is_placeholder:
            # Handle input placeholders
            pattern = re.compile(text_pattern, re.IGNORECASE)
            for input_elem in soup.find_all(['input', 'textarea']):
                placeholder = input_elem.get('placeholder', '')
                if pattern.search(placeholder):
                    if not input_elem.get('data-i18n-placeholder'):
                        input_elem['data-i18n-placeholder'] = trans_key
                        changes_made += 1
                        print(f"  [+] Added placeholder i18n: {trans_key}")
        else:
            # Handle regular text content
            pattern = re.compile(text_pattern, re.DOTALL | re.IGNORECASE)

            # Search all text-containing elements
            for elem in soup.find_all(string=True):
                parent = elem.parent
                if parent.name in ['script', 'style', 'code', 'pre']:
                    continue

                text = str(elem).strip()
                if pattern.search(text):
                    # Don't add if parent already has data-i18n
                    if not parent.get('data-i18n'):
                        parent['data-i18n'] = trans_key
                        changes_made += 1
                        print(f"  [+] Added i18n to <{parent.name}>: {trans_key}")
                        break  # Only add once per pattern

    if changes_made > 0:
        # Write the modified HTML back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"  [OK] Made {changes_made} changes to {file_path.name}")
    else:
        print(f"  [INFO] No changes needed for {file_path.name}")

    return changes_made


def update_translations_js():
    """Update translations.js with all Vietnamese translations."""
    translations_file = JS_DIR / "translations.js"
    print(f"\nUpdating translations in: {translations_file}")

    with open(translations_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the vi object
    vi_start = content.find("vi: {")
    if vi_start == -1:
        print("  [ERROR] Could not find vi object in translations.js")
        return

    # Find the closing brace of vi object
    brace_count = 0
    vi_end = vi_start
    for i in range(vi_start, len(content)):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                vi_end = i
                break

    # Parse existing Vietnamese translations
    vi_content = content[vi_start:vi_end+1]

    # Add new translations that don't exist
    additions = []
    for key, value in VIETNAMESE_TRANSLATIONS.items():
        # Check if key already exists
        if f"'{key}':" not in vi_content and f'"{key}":' not in vi_content:
            # Escape single quotes in value
            escaped_value = value.replace("'", "\\'")
            additions.append(f"    '{key}': '{escaped_value}'")

    if additions:
        # Insert new translations before the closing brace
        insert_pos = vi_end
        new_translations = ",\n" + ",\n".join(additions)

        new_content = content[:insert_pos] + new_translations + "\n  " + content[insert_pos:]

        with open(translations_file, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"  [OK] Added {len(additions)} new Vietnamese translations")
    else:
        print("  [INFO] All translations already exist")


def main():
    """Main execution function."""
    print("=" * 80)
    print("COMPREHENSIVE i18n ATTRIBUTE ADDITION FOR TECHTUTOR VN PAGES")
    print("=" * 80)

    # Get all HTML files in VN directory
    html_files = list(VN_DIR.glob("**/*.html"))

    print(f"\nFound {len(html_files)} HTML files to process")

    total_changes = 0
    for html_file in html_files:
        changes = add_i18n_to_html(html_file)
        total_changes += changes

    # Update translations.js
    update_translations_js()

    print("\n" + "=" * 80)
    print(f"COMPLETE! Made {total_changes} total changes across all files")
    print("=" * 80)
    print("\nNext steps:")
    print("1. Review the changes in your files")
    print("2. Test the language switcher on each page")
    print("3. Verify all Vietnamese translations display correctly")
    print("4. Check forms, buttons, and navigation elements")


if __name__ == "__main__":
    main()
