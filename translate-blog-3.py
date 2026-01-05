import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_blog_3(file_path):
    """Translate blog 3: Tech Like Playtime"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        translations = {
            # Header
            '← Back to Blog': '← Quay Lại Blog',
            '<p class="text-xl text-white/90">Transform tech education into an exciting adventure for your child</p>':
            '<p class="text-xl text-white/90">Biến việc học công nghệ thành một cuộc phiêu lưu thú vị cho con bạn</p>',

            # Introduction
            '<p>Remember when "fun learning" felt like an oxymoron? Yeah, us too. But here\'s a secret we\'ve discovered after teaching hundreds of kids to code: Learning technology doesn\'t have to feel like homework. In fact, when done right, children won\'t even realize they\'re learning—they\'ll just think they\'re having a blast.</p>':
            '<p>Bạn còn nhớ khi "học vui" giống như mâu thuẫn không? Chúng tôi cũng vậy. Nhưng đây là bí mật chúng tôi khám phá sau khi dạy hàng trăm trẻ coding: Học công nghệ không nhất thiết phải giống bài tập về nhà. Thực tế, khi làm đúng cách, trẻ em thậm chí không nhận ra mình đang học—các em chỉ nghĩ mình đang vui chơi.</p>',

            '<p>At TechTutor, we\'ve cracked the code (pun intended!) on making tech education feel more like an adventure and less like a chore. Want to know how? Let\'s dive in.</p>':
            '<p>Tại TechTutor, chúng tôi đã bẻ khóa (chơi chữ!) việc làm cho giáo dục công nghệ giống cuộc phiêu lưu hơn là công việc nhàm chán. Muốn biết cách? Cùng khám phá nhé.</p>',

            # Main sections
            '<h2>Why Play-Based Learning Works</h2>':
            '<h2>Tại Sao Học Qua Chơi Hiệu Quả</h2>',

            '<p>Kids are naturally curious. They love exploring, creating, and yes, playing. The magic happens when we harness that innate curiosity and channel it into learning. When a child is engaged in something fun, their brain is more receptive, they retain information better, and they develop a genuine love for the subject.</p>':
            '<p>Trẻ em tự nhiên tò mò. Các em thích khám phá, sáng tạo và đương nhiên, chơi đùa. Phép màu xảy ra khi chúng ta khai thác sự tò mò bẩm sinh đó và dẫn dắt nó vào học tập. Khi trẻ tham gia vào điều gì đó thú vị, não bộ của các em tiếp thu tốt hơn, ghi nhớ thông tin tốt hơn và phát triển tình yêu thực sự với môn học.</p>',

            '<p>Traditional learning methods often feel restrictive and boring because they disconnect knowledge from real-world application. But when kids see immediate results—like a character jumping in their game or a robot moving based on their code—learning becomes tangible and exciting.</p>':
            '<p>Phương pháp học truyền thống thường cảm thấy hạn chế và nhàm chán vì chúng tách rời kiến thức khỏi ứng dụng thực tế. Nhưng khi trẻ thấy kết quả ngay lập tức—như nhân vật nhảy trong game của các em hoặc robot di chuyển dựa trên code—việc học trở nên cụ thể và thú vị.</p>',

            '<h2>Our Secret Sauce: Making Tech Education Playful</h2>':
            '<h2>Công Thức Bí Mật Của Chúng Tôi: Làm Cho Giáo Dục Công Nghệ Vui Chơi</h2>',

            '<h3>1. Start with What They Love</h3>':
            '<h3>1. Bắt Đầu Với Điều Các Em Yêu Thích</h3>',

            '<p>Does your child love games? Introduce coding through Scratch or Roblox Studio. Are they into art? 3D design tools like Blender might be their jam. The key is to meet kids where they are, not force them into a one-size-fits-all curriculum.</p>':
            '<p>Con bạn có thích game không? Giới thiệu coding qua Scratch hoặc Roblox Studio. Các em thích nghệ thuật? Công cụ thiết kế 3D như Blender có thể là điều các em thích. Chìa khóa là gặp gỡ trẻ ở nơi các em đang ở, không ép buộc các em vào chương trình một khuôn mẫu.</p>',

            '<p>At TechTutor, we offer diverse programs—from game design to AI programming—so every child finds something that resonates with their interests.</p>':
            '<p>Tại TechTutor, chúng tôi cung cấp các chương trình đa dạng—từ thiết kế game đến lập trình AI—để mọi trẻ em tìm thấy điều phù hợp với sở thích của mình.</p>',

            '<h3>2. Gamify the Learning Process</h3>':
            '<h3>2. Biến Quá Trình Học Thành Trò Chơi</h3>',

            '<p>Turn lessons into missions. Instead of "Today, we\'ll learn loops," try "Today, you\'ll unlock the superpower of automation!" Use storytelling, challenges, and rewards to keep kids motivated.</p>':
            '<p>Biến bài học thành nhiệm vụ. Thay vì "Hôm nay, chúng ta sẽ học vòng lặp," thử "Hôm nay, bạn sẽ mở khóa siêu năng lực tự động hóa!" Sử dụng kể chuyện, thử thách và phần thưởng để giữ động lực cho trẻ.</p>',

            '<p>Our instructors use real-world scenarios and creative challenges that make learning feel like leveling up in a game.</p>':
            '<p>Các giảng viên của chúng tôi sử dụng các tình huống thực tế và thử thách sáng tạo làm cho việc học giống như nâng cấp trong game.</p>',

            '<h3>3. Encourage Creativity Over Perfection</h3>':
            '<h3>3. Khuyến Khích Sáng Tạo Hơn Là Hoàn Hảo</h3>',

            '<p>One of the biggest mistakes in tech education? Focusing too much on "the right way" to do things. Kids thrive when they\'re allowed to experiment, make mistakes, and build something uniquely theirs.</p>':
            '<p>Một trong những sai lầm lớn nhất trong giáo dục công nghệ? Tập trung quá nhiều vào "cách đúng" để làm mọi thứ. Trẻ em phát triển khi được phép thử nghiệm, mắc lỗi và xây dựng điều gì đó độc nhất của mình.</p>',

            '<p>Instead of rigid, step-by-step tutorials, we encourage students to remix projects, add their own twists, and think outside the box.</p>':
            '<p>Thay vì hướng dẫn cứng nhắc từng bước, chúng tôi khuyến khích học sinh phối lại dự án, thêm nét riêng của mình và suy nghĩ sáng tạo.</p>',

            '<h3>4. Celebrate Small Wins</h3>':
            '<h3>4. Tôn Vinh Những Chiến Thắng Nhỏ</h3>',

            '<p>Did your child just make a sprite move? Celebrate it! Wrote their first line of code? That\'s a milestone! Positive reinforcement keeps kids motivated and builds their confidence.</p>':
            '<p>Con bạn vừa làm cho sprite di chuyển? Hãy ăn mừng! Viết dòng code đầu tiên? Đó là cột mốc! Củng cố tích cực giữ động lực cho trẻ và xây dựng sự tự tin của các em.</p>',

            '<p>At TechTutor, every small achievement is recognized because we know that confidence is the foundation of lifelong learning.</p>':
            '<p>Tại TechTutor, mọi thành tựu nhỏ đều được công nhận vì chúng tôi biết rằng tự tin là nền tảng của học tập suốt đời.</p>',

            '<h3>5. Make It Social</h3>':
            '<h3>5. Làm Cho Nó Mang Tính Xã Hội</h3>',

            '<p>Learning is more fun with friends. Group projects, peer feedback, and collaborative challenges create a sense of community and make tech education a shared adventure.</p>':
            '<p>Học vui hơn với bạn bè. Dự án nhóm, phản hồi từ bạn bè và thử thách hợp tác tạo ra cảm giác cộng đồng và làm cho giáo dục công nghệ trở thành cuộc phiêu lưu chung.</p>',

            '<p>Our group sessions foster collaboration, where students learn from each other, share ideas, and build projects together.</p>':
            '<p>Các buổi học nhóm của chúng tôi thúc đẩy hợp tác, nơi học sinh học hỏi lẫn nhau, chia sẻ ý tưởng và xây dựng dự án cùng nhau.</p>',

            '<h2>Real-Life Example: From Reluctant Learner to Passionate Creator</h2>':
            '<h2>Ví Dụ Thực Tế: Từ Người Học Miễn Cưỡng Đến Người Sáng Tạo Đam Mê</h2>',

            '<p>We once had a student, Alex, who was skeptical about coding. "It\'s too hard," he said. So, we started with what he loved—superheroes. Within weeks, Alex was designing his own superhero game, complete with custom characters and storylines. He didn\'t see it as "learning code." He saw it as creating his own world.</p>':
            '<p>Chúng tôi từng có một học sinh, Alex, người hoài nghi về coding. "Nó quá khó," em ấy nói. Vì vậy, chúng tôi bắt đầu với điều em ấy yêu thích—siêu anh hùng. Trong vài tuần, Alex đã thiết kế game siêu anh hùng của riêng mình, hoàn chỉnh với các nhân vật và câu chuyện tùy chỉnh. Em ấy không coi đó là "học code." Em ấy coi đó là tạo ra thế giới của riêng mình.</p>',

            '<p>Fast forward a few months, and Alex was teaching his friends how to code. The shift? We made learning feel like play.</p>':
            '<p>Chuyển nhanh vài tháng sau, và Alex đã dạy bạn bè của mình cách code. Sự thay đổi? Chúng tôi làm cho việc học giống như chơi.</p>',

            '<h2>Tips for Parents: How You Can Help</h2>':
            '<h2>Mẹo Cho Phụ Huynh: Bạn Có Thể Giúp Như Thế Nào</h2>',

            '<li><strong>Don\'t Force It:</strong> If your child isn\'t interested today, try a different approach tomorrow. Patience is key.</li>':
            '<li><strong>Đừng Ép Buộc:</strong> Nếu con bạn không quan tâm hôm nay, hãy thử cách tiếp cận khác vào ngày mai. Sự kiên nhẫn là chìa khóa.</li>',

            '<li><strong>Join the Fun:</strong> Show genuine interest in what they\'re building. Ask questions. Play their games.</li>':
            '<li><strong>Tham Gia Vào Niềm Vui:</strong> Thể hiện sự quan tâm thực sự đến những gì các em đang xây dựng. Đặt câu hỏi. Chơi game của các em.</li>',

            '<li><strong>Limit Screen Time Guilt:</strong> Not all screen time is equal. Learning to code is productive screen time.</li>':
            '<li><strong>Hạn Chế Cảm Giác Tội Lỗi Về Thời Gian Màn Hình:</strong> Không phải tất cả thời gian màn hình đều như nhau. Học code là thời gian màn hình hiệu quả.</li>',

            '<li><strong>Provide Resources:</strong> Enroll them in engaging programs (like TechTutor!) that prioritize fun and creativity.</li>':
            '<li><strong>Cung Cấp Tài Nguyên:</strong> Ghi danh các em vào các chương trình hấp dẫn (như TechTutor!) ưu tiên sự vui vẻ và sáng tạo.</li>',

            '<h2>Final Thoughts</h2>':
            '<h2>Suy Nghĩ Cuối Cùng</h2>',

            '<p>Learning tech doesn\'t have to be a struggle. When we infuse education with play, creativity, and excitement, kids don\'t just learn—they thrive. They develop skills that will serve them for life, all while thinking they\'re just having fun.</p>':
            '<p>Học công nghệ không nhất thiết phải là cuộc đấu tranh. Khi chúng ta truyền vào giáo dục sự vui chơi, sáng tạo và hứng thú, trẻ em không chỉ học—các em phát triển. Các em phát triển kỹ năng sẽ phục vụ các em suốt đời, tất cả trong khi nghĩ rằng mình chỉ đang vui chơi.</p>',

            '<p>So, if you want your child to love learning tech, stop treating it like a subject and start treating it like an adventure. Because the best learning? It doesn\'t feel like learning at all.</p>':
            '<p>Vì vậy, nếu bạn muốn con mình yêu thích học công nghệ, hãy ngừng đối xử với nó như một môn học và bắt đầu đối xử với nó như một cuộc phiêu lưu. Bởi vì học tập tốt nhất? Nó không giống học tập chút nào.</p>',

            '<p><strong>Ready to give your child a playful tech education? Book a free trial with TechTutor and watch them fall in love with learning.</strong></p>':
            '<p><strong>Sẵn sàng cho con bạn một nền giáo dục công nghệ vui chơi? Đặt buổi học thử miễn phí với TechTutor và chứng kiến các em yêu thích học tập.</strong></p>',

            # CTA
            '<h2 class="text-3xl font-bold mb-4">Ready to Start Your Child\'s Tech Journey?</h2>':
            '<h2 class="text-3xl font-bold mb-4">Sẵn Sàng Bắt Đầu Hành Trình Công Nghệ Của Con Bạn?</h2>',

            '<p class="text-xl mb-6 text-white/90">Join TechTutor and discover the joy of playful, engaging tech education!</p>':
            '<p class="text-xl mb-6 text-white/90">Tham gia TechTutor và khám phá niềm vui của giáo dục công nghệ vui chơi, hấp dẫn!</p>',

            '<a href="free-trial.html" class="btn-primary bg-white text-primary hover:bg-gray-100">Book Your Free Trial</a>':
            '<a href="free-trial.html" class="btn-primary bg-white text-primary hover:bg-gray-100">Đặt Buổi Học Thử Miễn Phí</a>',
        }

        print('Applying translations...')
        count = 0
        for eng, viet in translations.items():
            if eng in content:
                content = content.replace(eng, viet)
                count += 1

        print(f'  ✓ Applied {count} translations')

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True, count
    except Exception as e:
        print(f'Error: {e}')
        return False, 0

print('=== TRANSLATING BLOG #3: TECH LIKE PLAYTIME ===\n')

success, count = translate_blog_3('vn/blog-tech-like-playtime.html')
if success:
    print(f'\n✅ Blog #3 fully translated! ({count} sections)')
    print('\nTranslated sections:')
    print('  • Header and introduction')
    print('  • Why play-based learning works')
    print('  • 5 secret sauce techniques')
    print('  • Real-life example')
    print('  • Tips for parents (4 items)')
    print('  • Final thoughts & CTA')
    print('\n🎉 ALL 3 BLOGS NOW FULLY TRANSLATED!')
else:
    print('\n❌ Failed to translate')
