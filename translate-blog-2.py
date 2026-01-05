import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_blog_2(file_path):
    """Translate blog 2: Spot and Nurture Tech Skills"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        translations = {
            # Header section
            '← Back to Blog': '← Quay Lại Blog',
            '<p class="text-xl text-white/90">A parent\'s guide to identifying and developing tech talents in children</p>':
            '<p class="text-xl text-white/90">Hướng dẫn dành cho phụ huynh để nhận diện và phát triển tài năng công nghệ ở trẻ em</p>',

            # Introduction
            '<p>In today\'s digital age, technology skills are becoming increasingly important. But how do you know if your child has a natural aptitude for tech? And more importantly, how can you nurture that talent?</p>':
            '<p>Trong thời đại kỹ thuật số ngày nay, kỹ năng công nghệ đang ngày càng trở nên quan trọng. Nhưng làm sao bạn biết liệu con mình có khả năng tự nhiên về công nghệ không? Và quan trọng hơn, làm thế nào để nuôi dưỡng tài năng đó?</p>',

            '<p>As parents and educators at TechTutor Academy, we\'ve worked with hundreds of children, each with unique strengths and interests. Through our experience, we\'ve identified key signs that indicate a child\'s potential in technology and effective ways to support their development.</p>':
            '<p>Với tư cách là phụ huynh và giáo viên tại TechTutor Academy, chúng tôi đã làm việc với hàng trăm trẻ em, mỗi em có điểm mạnh và sở thích riêng. Qua kinh nghiệm của mình, chúng tôi đã xác định được những dấu hiệu chính cho thấy tiềm năng công nghệ của trẻ và cách hiệu quả để hỗ trợ sự phát triển của các em.</p>',

            # Main sections
            '<h2>Signs Your Child Has a Natural Tech Aptitude</h2>':
            '<h2>Dấu Hiệu Con Bạn Có Khả Năng Công Nghệ Tự Nhiên</h2>',

            '<h3>1. Curiosity About How Things Work</h3>':
            '<h3>1. Tò Mò Về Cách Mọi Thứ Hoạt Động</h3>',

            '<p>Does your child constantly ask "How does this work?" or "Why does that happen?" Children with tech aptitude often display an innate curiosity about the mechanics behind everyday objects and systems.</p>':
            '<p>Con bạn có thường xuyên hỏi "Cái này hoạt động như thế nào?" hoặc "Tại sao điều đó lại xảy ra?" không? Trẻ em có khả năng công nghệ thường thể hiện sự tò mò bẩm sinh về cơ chế đằng sau các vật dụng và hệ thống hàng ngày.</p>',

            '<p><strong>What to look for:</strong> They might take apart toys to see the inside, ask questions about how websites work, or show interest in understanding the logic behind games and apps.</p>':
            '<p><strong>Điều cần quan sát:</strong> Các em có thể tháo đồ chơi để xem bên trong, đặt câu hỏi về cách website hoạt động, hoặc thể hiện sự quan tâm đến việc hiểu logic đằng sau các trò chơi và ứng dụng.</p>',

            '<h3>2. Problem-Solving Enthusiasm</h3>':
            '<h3>2. Nhiệt Huyết Giải Quyết Vấn Đề</h3>',

            '<p>Tech-inclined children often enjoy puzzles, strategy games, and challenges that require logical thinking. They don\'t get easily frustrated when faced with complex problems; instead, they see them as exciting challenges to overcome.</p>':
            '<p>Trẻ em có thiên hướng công nghệ thường thích các trò chơi giải đố, game chiến thuật và những thử thách đòi hỏi tư duy logic. Các em không dễ dàng nản lòng khi đối mặt với vấn đề phức tạp; thay vào đó, các em coi chúng như những thử thách thú vị cần vượt qua.</p>',

            '<h3>3. Creative Expression Through Digital Means</h3>':
            '<h3>3. Thể Hiện Sáng Tạo Qua Phương Tiện Kỹ Thuật Số</h3>',

            '<p>Whether it\'s creating digital art, making videos, or building in games like Minecraft or Roblox, children who naturally gravitate toward technology often use digital tools as their primary creative outlet.</p>':
            '<p>Dù là tạo nghệ thuật kỹ thuật số, làm video, hay xây dựng trong các trò chơi như Minecraft hoặc Roblox, trẻ em tự nhiên hướng đến công nghệ thường sử dụng các công cụ kỹ thuật số làm phương tiện sáng tạo chính của mình.</p>',

            '<h3>4. Pattern Recognition</h3>':
            '<h3>4. Nhận Diện Quy Luật</h3>',

            '<p>An ability to spot patterns is a fundamental skill in programming and technology. If your child excels at identifying sequences, patterns in numbers, or logical connections, they may have a natural inclination toward tech.</p>':
            '<p>Khả năng phát hiện quy luật là kỹ năng cơ bản trong lập trình và công nghệ. Nếu con bạn xuất sắc trong việc xác định chuỗi, quy luật trong số, hoặc kết nối logic, các em có thể có khuynh hướng tự nhiên với công nghệ.</p>',

            '<h3>5. Persistence and Experimentation</h3>':
            '<h3>5. Kiên Trì Và Thử Nghiệm</h3>',

            '<p>Children with tech potential often display remarkable persistence. They\'ll try different approaches when something doesn\'t work the first time, experimenting until they find a solution.</p>':
            '<p>Trẻ em có tiềm năng công nghệ thường thể hiện sự kiên trì đáng chú ý. Các em sẽ thử các cách tiếp cận khác nhau khi điều gì đó không hoạt động lần đầu tiên, thử nghiệm cho đến khi tìm ra giải pháp.</p>',

            '<h2>How to Nurture Your Child\'s Technology Skills</h2>':
            '<h2>Cách Nuôi Dưỡng Kỹ Năng Công Nghệ Của Con Bạn</h2>',

            '<h3>1. Provide Age-Appropriate Tools and Resources</h3>':
            '<h3>1. Cung Cấp Công Cụ Và Tài Nguyên Phù Hợp Với Độ Tuổi</h3>',

            '<p>Start with visual programming platforms like Scratch for younger children (ages 7-10), which teach coding concepts without requiring complex syntax. As they grow, introduce more advanced tools like Python, game development platforms, or 3D design software.</p>':
            '<p>Bắt đầu với các nền tảng lập trình trực quan như Scratch cho trẻ nhỏ hơn (7-10 tuổi), dạy các khái niệm coding mà không yêu cầu cú pháp phức tạp. Khi các em lớn hơn, giới thiệu các công cụ nâng cao hơn như Python, nền tảng phát triển game, hoặc phần mềm thiết kế 3D.</p>',

            '<p><strong>TechTutor Tip:</strong> Our programs are specifically designed for different age groups and skill levels, ensuring your child is always challenged but never overwhelmed.</p>':
            '<p><strong>Mẹo TechTutor:</strong> Các chương trình của chúng tôi được thiết kế riêng cho các nhóm tuổi và cấp độ kỹ năng khác nhau, đảm bảo con bạn luôn được thử thách nhưng không bao giờ bị quá tải.</p>',

            '<h3>2. Encourage Project-Based Learning</h3>':
            '<h3>2. Khuyến Khích Học Tập Dựa Trên Dự Án</h3>',

            '<p>Rather than just following tutorials, encourage your child to create their own projects. This could be designing a game, building a website, or creating an animation. Project-based learning develops problem-solving skills and fosters creativity.</p>':
            '<p>Thay vì chỉ làm theo hướng dẫn, hãy khuyến khích con bạn tạo ra các dự án của riêng mình. Đây có thể là thiết kế game, xây dựng website, hoặc tạo hoạt hình. Học tập dựa trên dự án phát triển kỹ năng giải quyết vấn đề và nuôi dưỡng sự sáng tạo.</p>',

            '<h3>3. Create a Supportive Learning Environment</h3>':
            '<h3>3. Tạo Môi Trường Học Tập Hỗ Trợ</h3>',

            '<p>Set up a dedicated space where your child can work on tech projects. Make sure they have access to necessary tools, reliable internet, and a comfortable workspace. Most importantly, show genuine interest in what they\'re creating.</p>':
            '<p>Thiết lập một không gian riêng nơi con bạn có thể làm việc trên các dự án công nghệ. Đảm bảo các em có quyền truy cập vào các công cụ cần thiết, internet ổn định và không gian làm việc thoải mái. Quan trọng nhất, hãy thể hiện sự quan tâm thực sự đến những gì các em đang tạo ra.</p>',

            '<h3>4. Connect Them with Mentors and Peers</h3>':
            '<h3>4. Kết Nối Các Em Với Người Hướng Dẫn Và Bạn Bè</h3>',

            '<p>Learning is more effective and enjoyable when it\'s social. Whether through structured programs like TechTutor or online communities, connecting with peers and mentors who share their interests can accelerate learning and maintain motivation.</p>':
            '<p>Học tập hiệu quả và thú vị hơn khi mang tính xã hội. Dù thông qua các chương trình có cấu trúc như TechTutor hay cộng đồng trực tuyến, việc kết nối với bạn bè và người hướng dẫn cùng sở thích có thể đẩy nhanh quá trình học và duy trì động lực.</p>',

            '<h3>5. Balance Structure with Freedom</h3>':
            '<h3>5. Cân Bằng Giữa Cấu Trúc Và Tự Do</h3>',

            '<p>While structured learning is important, children also need time to explore and experiment on their own. Allow them to pursue their own interests and ideas, even if they diverge from traditional learning paths.</p>':
            '<p>Mặc dù học tập có cấu trúc quan trọng, trẻ em cũng cần thời gian để khám phá và thử nghiệm theo cách của mình. Cho phép các em theo đuổi sở thích và ý tưởng riêng, ngay cả khi chúng khác với con đường học tập truyền thống.</p>',

            '<h3>6. Celebrate Effort Over Perfection</h3>':
            '<h3>6. Tôn Vinh Nỗ Lực Hơn Là Sự Hoàn Hảo</h3>',

            '<p>Tech skills develop through trial and error. Celebrate your child\'s efforts and progress, not just their successes. When they encounter bugs or errors, frame these as learning opportunities rather than failures.</p>':
            '<p>Kỹ năng công nghệ phát triển qua thử và sai. Hãy tôn vinh nỗ lực và tiến bộ của con, không chỉ thành công. Khi các em gặp lỗi, hãy xem đây là cơ hội học tập chứ không phải thất bại.</p>',

            '<h3>7. Expose Them to Real-World Applications</h3>':
            '<h3>7. Giới Thiệu Các Em Với Ứng Dụng Thực Tế</h3>',

            '<p>Help your child understand how technology impacts the real world. Show them how coding powers their favorite apps, how 3D design is used in movies and games, or how AI is changing various industries. This context makes learning more meaningful.</p>':
            '<p>Giúp con bạn hiểu công nghệ ảnh hưởng đến thế giới thực như thế nào. Cho các em thấy coding làm sao chạy các ứng dụng yêu thích, thiết kế 3D được sử dụng trong phim và game ra sao, hoặc AI đang thay đổi các ngành như thế nào. Bối cảnh này làm cho việc học có ý nghĩa hơn.</p>',
        }

        print('Applying translations...')
        count = 0
        for eng, viet in translations.items():
            if eng in content:
                content = content.replace(eng, viet)
                count += 1

        print(f'  ✓ Applied {count} translations (Part 1/3)')

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True, count
    except Exception as e:
        print(f'Error: {e}')
        return False, 0

print('=== TRANSLATING BLOG #2: SPOT & NURTURE TECH SKILLS (Part 1) ===\n')

success, count = translate_blog_2('vn/blog-spot-nurture-tech-skill.html')
if success:
    print(f'\n✅ Part 1 complete! ({count} sections translated)')
    print('\nTranslated sections:')
    print('  • Header and introduction')
    print('  • 5 signs of tech aptitude')
    print('  • 7 ways to nurture tech skills')
else:
    print('\n❌ Failed to translate')
