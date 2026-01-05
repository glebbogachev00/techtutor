import os
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def translate_blog_2_part2(file_path):
    """Translate blog 2 part 2: remaining sections"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        translations = {
            # Common Mistakes section
            '<h2>Common Mistakes to Avoid</h2>':
            '<h2>Những Sai Lầm Thường Gặp Cần Tránh</h2>',

            '<h3>Pushing Too Hard, Too Fast</h3>':
            '<h3>Ép Buộc Quá Mức, Quá Nhanh</h3>',

            '<p>Every child learns at their own pace. Pushing advanced concepts before they\'re ready can lead to frustration and loss of interest. Follow your child\'s lead and advance when they show readiness.</p>':
            '<p>Mỗi trẻ học theo tốc độ của riêng mình. Ép buộc các khái niệm nâng cao trước khi các em sẵn sàng có thể dẫn đến thất vọng và mất hứng thú. Hãy theo sự dẫn dắt của con và tiến bộ khi các em thể hiện sự sẵn sàng.</p>',

            '<h3>Comparing to Others</h3>':
            '<h3>So Sánh Với Người Khác</h3>',

            '<p>Avoid comparing your child\'s progress to their siblings, friends, or classmates. Each child has unique strengths and learning styles. Focus on their individual growth and achievements.</p>':
            '<p>Tránh so sánh tiến bộ của con bạn với anh chị em, bạn bè hoặc bạn cùng lớp. Mỗi trẻ có điểm mạnh và phong cách học tập riêng. Tập trung vào sự phát triển và thành tích cá nhân của các em.</p>',

            '<h3>Focusing Only on Coding</h3>':
            '<h3>Chỉ Tập Trung Vào Lập Trình</h3>',

            '<p>Technology skills extend beyond programming. 3D design, digital art, video editing, game design, and even digital storytelling are all valuable tech skills. Explore different areas to find what resonates most with your child.</p>':
            '<p>Kỹ năng công nghệ mở rộng xa hơn lập trình. Thiết kế 3D, nghệ thuật kỹ thuật số, chỉnh sửa video, thiết kế game, và thậm chí kể chuyện kỹ thuật số đều là kỹ năng công nghệ có giá trị. Khám phá các lĩnh vực khác nhau để tìm ra điều phù hợp nhất với con bạn.</p>',

            '<h3>Neglecting Soft Skills</h3>':
            '<h3>Bỏ Qua Kỹ Năng Mềm</h3>',

            '<p>While technical skills are important, don\'t overlook the development of communication, collaboration, and creative thinking. These soft skills are essential for success in any tech-related field.</p>':
            '<p>Mặc dù kỹ năng kỹ thuật quan trọng, đừng bỏ qua sự phát triển của giao tiếp, hợp tác và tư duy sáng tạo. Những kỹ năng mềm này rất cần thiết cho thành công trong bất kỳ lĩnh vực liên quan đến công nghệ nào.</p>',

            # Age paths section
            '<h2>Age-Appropriate Technology Paths</h2>':
            '<h2>Lộ Trình Công Nghệ Phù Hợp Với Từng Độ Tuổi</h2>',

            '<h3>Ages 7-9: Foundation Building</h3>':
            '<h3>Độ Tuổi 7-9: Xây Dựng Nền Tảng</h3>',

            '<li>Visual programming with Scratch</li>':
            '<li>Lập trình trực quan với Scratch</li>',

            '<li>Basic game design concepts</li>':
            '<li>Khái niệm thiết kế game cơ bản</li>',

            '<li>Simple animation and storytelling</li>':
            '<li>Hoạt hình và kể chuyện đơn giản</li>',

            '<li>Introduction to logical thinking</li>':
            '<li>Giới thiệu về tư duy logic</li>',

            '<h3>Ages 10-12: Skill Development</h3>':
            '<h3>Độ Tuổi 10-12: Phát Triển Kỹ Năng</h3>',

            '<li>More complex game development (Roblox, GDevelop)</li>':
            '<li>Phát triển game phức tạp hơn (Roblox, GDevelop)</li>',

            '<li>Introduction to 3D design</li>':
            '<li>Giới thiệu về thiết kế 3D</li>',

            '<li>Basic web development</li>':
            '<li>Phát triển web cơ bản</li>',

            '<li>Understanding algorithms and logic</li>':
            '<li>Hiểu về thuật toán và logic</li>',

            '<h3>Ages 13+: Advanced Applications</h3>':
            '<h3>Độ Tuổi 13+: Ứng Dụng Nâng Cao</h3>',

            '<li>Text-based programming (Python, JavaScript)</li>':
            '<li>Lập trình dựa trên văn bản (Python, JavaScript)</li>',

            '<li>App development</li>':
            '<li>Phát triển ứng dụng</li>',

            '<li>AI and machine learning concepts</li>':
            '<li>Khái niệm AI và học máy</li>',

            '<li>Advanced 3D modeling and animation</li>':
            '<li>Mô hình 3D và hoạt hình nâng cao</li>',

            # Structured programs section
            '<h2>The Role of Structured Programs</h2>':
            '<h2>Vai Trò Của Các Chương Trình Có Cấu Trúc</h2>',

            '<p>While self-directed learning is valuable, structured programs like those offered by TechTutor Academy provide several advantages:</p>':
            '<p>Mặc dù học tập tự định hướng có giá trị, các chương trình có cấu trúc như những chương trình TechTutor Academy cung cấp mang lại nhiều lợi thế:</p>',

            '<li><strong>Expert Guidance:</strong> Experienced instructors who understand child development and pedagogy</li>':
            '<li><strong>Hướng Dẫn Chuyên Gia:</strong> Giáo viên giàu kinh nghiệm hiểu về sự phát triển trẻ em và sư phạm</li>',

            '<li><strong>Curriculum Design:</strong> Well-structured progression that builds skills systematically</li>':
            '<li><strong>Thiết Kế Chương Trình:</strong> Tiến triển có cấu trúc tốt xây dựng kỹ năng một cách hệ thống</li>',

            '<li><strong>Peer Learning:</strong> Opportunities to collaborate and learn from other children</li>':
            '<li><strong>Học Từ Bạn Bè:</strong> Cơ hội hợp tác và học hỏi từ các trẻ khác</li>',

            '<li><strong>Accountability:</strong> Regular sessions that maintain momentum and consistency</li>':
            '<li><strong>Trách Nhiệm:</strong> Các buổi học thường xuyên duy trì động lực và tính nhất quán</li>',

            '<li><strong>Portfolio Building:</strong> Completed projects that showcase skills and progress</li>':
            '<li><strong>Xây Dựng Hồ Sơ:</strong> Các dự án hoàn thành thể hiện kỹ năng và tiến bộ</li>',

            # Measuring progress section
            '<h2>Measuring Progress</h2>':
            '<h2>Đo Lường Tiến Bộ</h2>',

            '<p>Technology skills develop gradually. Here are some indicators that your child is progressing:</p>':
            '<p>Kỹ năng công nghệ phát triển dần dần. Dưới đây là một số dấu hiệu cho thấy con bạn đang tiến bộ:</p>',

            '<li>Increasing independence in solving problems</li>':
            '<li>Tăng tính độc lập trong giải quyết vấn đề</li>',

            '<li>Growing complexity in projects they create</li>':
            '<li>Độ phức tạp ngày càng tăng trong các dự án các em tạo ra</li>',

            '<li>Ability to explain concepts to others</li>':
            '<li>Khả năng giải thích khái niệm cho người khác</li>',

            '<li>Sustained interest and enthusiasm</li>':
            '<li>Duy trì sự quan tâm và nhiệt huyết</li>',

            '<li>Application of skills to new contexts</li>':
            '<li>Áp dụng kỹ năng vào các bối cảnh mới</li>',

            '<li>Confidence in tackling unfamiliar challenges</li>':
            '<li>Tự tin đối mặt với những thử thách xa lạ</li>',

            # Final thoughts
            '<h2>Final Thoughts</h2>':
            '<h2>Suy Nghĩ Cuối Cùng</h2>',

            '<p>Every child has the potential to develop technology skills, but the key is identifying their unique interests and learning style, then providing appropriate support and resources. Whether your child shows early signs of tech aptitude or is just beginning to explore, the most important thing is to foster curiosity, encourage experimentation, and celebrate progress.</p>':
            '<p>Mọi trẻ em đều có tiềm năng phát triển kỹ năng công nghệ, nhưng chìa khóa là xác định sở thích và phong cách học tập độc đáo của các em, sau đó cung cấp sự hỗ trợ và tài nguyên phù hợp. Dù con bạn thể hiện dấu hiệu sớm về khả năng công nghệ hay chỉ mới bắt đầu khám phá, điều quan trọng nhất là nuôi dưỡng sự tò mò, khuyến khích thử nghiệm và tôn vinh tiến bộ.</p>',

            '<p>Remember, the goal isn\'t to create the next tech prodigy—it\'s to equip your child with valuable skills, nurture their natural talents, and help them discover the joy of creating with technology.</p>':
            '<p>Hãy nhớ rằng, mục tiêu không phải là tạo ra thần đồng công nghệ tiếp theo—mà là trang bị cho con bạn những kỹ năng có giá trị, nuôi dưỡng tài năng tự nhiên của các em và giúp các em khám phá niềm vui sáng tạo với công nghệ.</p>',

            '<p><strong>Ready to support your child\'s tech journey?</strong> At TechTutor Academy, we specialize in identifying each child\'s strengths and tailoring instruction to their unique needs and interests. Our experienced instructors create a supportive, engaging environment where children can explore, learn, and grow.</p>':
            '<p><strong>Sẵn sàng hỗ trợ hành trình công nghệ của con bạn?</strong> Tại TechTutor Academy, chúng tôi chuyên xác định điểm mạnh của từng trẻ và điều chỉnh giảng dạy theo nhu cầu và sở thích riêng của các em. Các giáo viên giàu kinh nghiệm của chúng tôi tạo ra môi trường hỗ trợ, hấp dẫn nơi trẻ em có thể khám phá, học hỏi và phát triển.</p>',

            # CTA section
            '<h2 class="text-3xl font-bold mb-4">Discover Your Child\'s Tech Potential</h2>':
            '<h2 class="text-3xl font-bold mb-4">Khám Phá Tiềm Năng Công Nghệ Của Con Bạn</h2>',

            '<p class="text-xl mb-6 text-white/90">Book a free trial session and let our expert instructors help identify and nurture your child\'s unique talents!</p>':
            '<p class="text-xl mb-6 text-white/90">Đặt buổi học thử miễn phí và để các giảng viên chuyên gia của chúng tôi giúp xác định và nuôi dưỡng tài năng độc đáo của con bạn!</p>',

            '<a href="free-trial.html" class="btn-primary bg-white text-primary hover:bg-gray-100">Book Free Trial Now</a>':
            '<a href="free-trial.html" class="btn-primary bg-white text-primary hover:bg-gray-100">Đặt Buổi Học Thử Miễn Phí Ngay</a>',
        }

        print('Applying Part 2 translations...')
        count = 0
        for eng, viet in translations.items():
            if eng in content:
                content = content.replace(eng, viet)
                count += 1

        print(f'  ✓ Applied {count} translations (Part 2/2)')

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True, count
    except Exception as e:
        print(f'Error: {e}')
        return False, 0

print('=== TRANSLATING BLOG #2: SPOT & NURTURE TECH SKILLS (Part 2) ===\n')

success, count = translate_blog_2_part2('vn/blog-spot-nurture-tech-skill.html')
if success:
    print(f'\n✅ Part 2 complete! ({count} sections translated)')
    print('\nTranslated sections:')
    print('  • Common mistakes to avoid (4 items)')
    print('  • Age-appropriate paths (3 age groups)')
    print('  • Role of structured programs (5 points)')
    print('  • Measuring progress (6 indicators)')
    print('  • Final thoughts & CTA')
    print('\n🎉 BLOG #2 FULLY TRANSLATED!')
else:
    print('\n❌ Failed to translate')
