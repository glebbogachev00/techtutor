import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_blog_1(file_path):
    """Translate Project-Based Learning blog"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Title and meta
        content = content.replace(
            '<title>Unlocking Your Child\'s Potential With Project-Based Learning | TechTutor Academy</title>',
            '<title>Mở Khóa Tiềm Năng Của Con Bạn Với Học Tập Dựa Trên Dự Án | TechTutor Academy</title>'
        )

        content = content.replace(
            '<meta name="description" content="Discover why project-based learning keeps kids engaged, builds critical skills, and helps them fall in love with technology at TechTutor Academy." />',
            '<meta name="description" content="Khám phá lý do tại sao học tập dựa trên dự án giữ trẻ hứng thú, xây dựng kỹ năng quan trọng và giúp các em yêu thích công nghệ tại TechTutor Academy." />'
        )

        # Article header
        content = content.replace(
            '← Back to Blog',
            '← Quay Lại Blog'
        )

        content = content.replace(
            '<h1 class="text-4xl md:text-5xl font-bold mb-4">Unlocking Your Child\'s Potential With Project-Based Learning</h1>',
            '<h1 class="text-4xl md:text-5xl font-bold mb-4">Mở Khóa Tiềm Năng Của Con Bạn Với Học Tập Dựa Trên Dự Án</h1>'
        )

        content = content.replace(
            '<p class="text-xl text-white/90">Why hands-on tech projects help kids build confidence, creativity, and real skills</p>',
            '<p class="text-xl text-white/90">Tại sao các dự án công nghệ thực hành giúp trẻ xây dựng sự tự tin, sáng tạo và kỹ năng thực tế</p>'
        )

        # Main content paragraphs
        content = content.replace(
            '<p>Imagine a classroom where students don\'t just memorize facts but build, create, and innovate. That\'s project-based learning (PBL)—a hands-on approach where students solve real-world challenges and develop the skills that actually matter.</p>',
            '<p>Hãy tưởng tượng một lớp học nơi học sinh không chỉ ghi nhớ kiến thức mà còn xây dựng, sáng tạo và đổi mới. Đó chính là học tập dựa trên dự án (PBL)—một phương pháp thực hành nơi học sinh giải quyết các thử thách thực tế và phát triển những kỹ năng thực sự quan trọng.</p>'
        )

        content = content.replace(
            '<p>At TechTutor, every lesson is an adventure. From coding apps to designing games, students learn by doing, gaining the confidence and creativity they need to thrive.</p>',
            '<p>Tại TechTutor, mỗi bài học là một cuộc phiêu lưu. Từ lập trình ứng dụng đến thiết kế game, học sinh học bằng cách làm, đạt được sự tự tin và sáng tạo cần thiết để phát triển.</p>'
        )

        # Section headings
        content = content.replace(
            '<h2>What Is Project-Based Learning?</h2>',
            '<h2>Học Tập Dựa Trên Dự Án Là Gì?</h2>'
        )

        content = content.replace(
            '<p>Project-based learning mirrors how learning happens outside of school. Students work on meaningful projects, apply knowledge across subjects, and see tangible outcomes. Instead of passively soaking up information, they become makers, inventors, and problem-solvers.</p>',
            '<p>Học tập dựa trên dự án phản ánh cách học diễn ra ngoài trường học. Học sinh làm việc trên các dự án có ý nghĩa, áp dụng kiến thức qua nhiều môn học và thấy được kết quả cụ thể. Thay vì thụ động tiếp nhận thông tin, các em trở thành người sáng tạo, nhà phát minh và người giải quyết vấn đề.</p>'
        )

        content = content.replace(
            '<h2>Why Project-Based Learning Works</h2>',
            '<h2>Tại Sao Học Tập Dựa Trên Dự Án Hiệu Quả</h2>'
        )

        content = content.replace(
            '<h3>1. Learning That Sticks</h3>',
            '<h3>1. Kiến Thức Được Ghi Nhớ Lâu Dài</h3>'
        )

        content = content.replace(
            '<p>Forget dry textbooks—PBL makes learning unforgettable. Students retain information better when they apply knowledge to solve real problems.</p>',
            '<p>Quên đi những cuốn sách khô khan—PBL làm cho việc học trở nên khó quên. Học sinh ghi nhớ thông tin tốt hơn khi áp dụng kiến thức để giải quyết vấn đề thực tế.</p>'
        )

        content = content.replace(
            '<h3>2. Critical Thinking & Problem-Solving</h3>',
            '<h3>2. Tư Duy Phản Biện & Giải Quyết Vấn Đề</h3>'
        )

        content = content.replace(
            '<p>Our world rewards adaptable thinkers. PBL encourages kids to ask questions, experiment, iterate, and evaluate their own work—skills they\'ll use forever.</p>',
            '<p>Thế giới của chúng ta đánh giá cao những người tư duy linh hoạt. PBL khuyến khích trẻ đặt câu hỏi, thử nghiệm, lặp lại và đánh giá công việc của mình—những kỹ năng các em sẽ sử dụng mãi mãi.</p>'
        )

        content = content.replace(
            '<h3>3. Engagement and Motivation</h3>',
            '<h3>3. Sự Tham Gia và Động Lực</h3>'
        )

        content = content.replace(
            '<p>When students work on something they love, motivation soars. Whether it\'s building a robot or designing a brand-new world, they take ownership of their learning.</p>',
            '<p>Khi học sinh làm việc với điều mình yêu thích, động lực tăng vọt. Dù là xây dựng robot hay thiết kế một thế giới hoàn toàn mới, các em sẽ chủ động trong việc học của mình.</p>'
        )

        content = content.replace(
            '<h3>4. Real-World Applications & Future-Ready Skills</h3>',
            '<h3>4. Ứng Dụng Thực Tế & Kỹ Năng Sẵn Sàng Cho Tương Lai</h3>'
        )

        content = content.replace(
            '<p>Hands-on projects help students practice communication, collaboration, and technical skills used in tech, business, and creative industries.</p>',
            '<p>Các dự án thực hành giúp học sinh rèn luyện kỹ năng giao tiếp, hợp tác và kỹ thuật được sử dụng trong công nghệ, kinh doanh và các ngành sáng tạo.</p>'
        )

        content = content.replace(
            '<h2>Overcoming Challenges in PBL</h2>',
            '<h2>Vượt Qua Thử Thách Trong PBL</h2>'
        )

        content = content.replace(
            '<p>Project-based learning isn\'t always easy—time management, teamwork, and iteration all take practice. That\'s why TechTutor provides structure, coaching, and feedback so students can turn obstacles into opportunities.</p>',
            '<p>Học tập dựa trên dự án không phải lúc nào cũng dễ dàng—quản lý thời gian, làm việc nhóm và lặp lại đều cần thực hành. Đó là lý do TechTutor cung cấp cấu trúc, huấn luyện và phản hồi để học sinh có thể biến trở ngại thành cơ hội.</p>'
        )

        content = content.replace(
            '<h2>Real-World Learning at TechTutor</h2>',
            '<h2>Học Tập Thực Tế Tại TechTutor</h2>'
        )

        content = content.replace(
            '<p>Here\'s a glimpse at what our students are building.</p>',
            '<p>Đây là cái nhìn thoáng qua về những gì học sinh của chúng tôi đang xây dựng.</p>'
        )

        content = content.replace(
            '<h3>Game Development Magic</h3>',
            '<h3>Phép Thuật Phát Triển Game</h3>'
        )

        content = content.replace(
            '<p>From concept to launch, kids create playable games using tools like GDevelop and Roblox Studio, sharpening both logic and creativity.</p>',
            '<p>Từ ý tưởng đến ra mắt, trẻ em tạo ra các trò chơi có thể chơi được bằng cách sử dụng các công cụ như GDevelop và Roblox Studio, mài giũa cả logic và sáng tạo.</p>'
        )

        content = content.replace(
            '<h3>Example: Learning Through Roblox</h3>',
            '<h3>Ví Dụ: Học Thông Qua Roblox</h3>'
        )

        content = content.replace(
            '<p>We help Roblox fans become creators. One student loved a tycoon-style Roblox game and decided to build his own upgraded version. Through scripting, level design, and playtesting he learned programming fundamentals, game mechanics, and creative problem-solving—all while having fun.</p>',
            '<p>Chúng tôi giúp những người hâm mộ Roblox trở thành nhà sáng tạo. Một học sinh yêu thích trò chơi Roblox kiểu tycoon và quyết định xây dựng phiên bản nâng cấp của riêng mình. Thông qua lập trình, thiết kế cấp độ và thử nghiệm, em ấy đã học được các nguyên tắc lập trình cơ bản, cơ chế trò chơi và giải quyết vấn đề sáng tạo—tất cả trong khi vui chơi.</p>'
        )

        content = content.replace(
            '<h3>How Product Design Inspired 3D Modeling</h3>',
            '<h3>Thiết Kế Sản Phẩm Truyền Cảm Hứng Cho Mô Hình 3D Như Thế Nào</h3>'
        )

        content = content.replace(
            '<p>Another student was obsessed with Apple products, so we used Blender to recreate the devices he uses daily. By modeling a computer, phone, and tablet from scratch he gained a foundation in visualization, spatial reasoning, and design thinking—cornerstone skills for animation, gaming, and product design careers.</p>',
            '<p>Một học sinh khác đam mê các sản phẩm Apple, vì vậy chúng tôi đã sử dụng Blender để tái tạo các thiết bị em ấy sử dụng hàng ngày. Bằng cách mô hình hóa máy tính, điện thoại và máy tính bảng từ đầu, em ấy đã có được nền tảng về hình ảnh hóa, suy luận không gian và tư duy thiết kế—những kỹ năng nền tảng cho sự nghiệp hoạt hình, game và thiết kế sản phẩm.</p>'
        )

        content = content.replace(
            '<h2>The TechTutor Difference</h2>',
            '<h2>Sự Khác Biệt Của TechTutor</h2>'
        )

        content = content.replace(
            '<p>At TechTutor, we believe every child can become a builder. PBL helps students gain more than knowledge—they gain the mindset to tackle future challenges with confidence.</p>',
            '<p>Tại TechTutor, chúng tôi tin rằng mọi trẻ em đều có thể trở thành người xây dựng. PBL giúp học sinh đạt được nhiều hơn kiến thức—các em đạt được tư duy để giải quyết những thử thách tương lai với sự tự tin.</p>'
        )

        content = content.replace(
            '<h2>Ready to Ignite Your Child\'s Potential?</h2>',
            '<h2>Sẵn Sàng Khơi Dậy Tiềm Năng Của Con Bạn?</h2>'
        )

        content = content.replace(
            '<p>Give your child the gift of engaging, hands-on learning. Join TechTutor today and watch them thrive.</p>',
            '<p>Tặng con bạn món quà học tập thực hành hấp dẫn. Tham gia TechTutor ngay hôm nay và chứng kiến các em phát triển.</p>'
        )

        content = content.replace(
            '<a href="free-trial.html" class="btn-primary">Book a Free 90-Minute Trial Lesson</a>',
            '<a href="free-trial.html" class="btn-primary">Đặt Buổi Học Thử 90 Phút Miễn Phí</a>'
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True
    except Exception as e:
        print(f'Error: {e}')
        return False

print('=== TRANSLATING BLOG #1: PROJECT-BASED LEARNING ===\n')

if translate_blog_1('vn/blog-project-based-learning.html'):
    print('✅ Blog #1 fully translated!')
    print('   • Title, meta description')
    print('   • Article header')
    print('   • All headings (h1, h2, h3)')
    print('   • All paragraphs')
    print('   • Call-to-action button\n')
else:
    print('❌ Failed to translate blog #1\n')
