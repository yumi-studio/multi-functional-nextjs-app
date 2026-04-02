import { getLocale } from "next-intl/server";

const AboutPage = async () => {
  const locale = await getLocale();

  return (
    <div className="pt-16 w-full h-full">
      <div className="p-3 w-full h-auto max-w-4xl mx-auto">
        {locale === 'en' && (
          <>
            <h1 className="text-3xl font-bold mb-6">About NTD Solutions</h1>

            <section className="mb-8">
              <p className="text-lg leading-relaxed mb-4">
                I'm a Fullstack Software Developer with over 5 years of experience building scalable e-commerce platforms, marketplaces, and enterprise systems.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                My core strength lies in backend development, particularly with PHP (Magento 2, Laravel), where I've designed and optimized complex systems, built RESTful APIs, and integrated various third-party services such as payment gateways and logistics providers. On the frontend side, I have hands-on experience with React.js and Next.js, allowing me to deliver complete end-to-end solutions.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Throughout my career, I've worked on a wide range of projects — from social platforms with real-time messaging and livestreaming, to large-scale marketplace systems serving international clients. I've also taken on leadership responsibilities, mentoring team members, reviewing code, and contributing to architectural decisions.
              </p>
              <p className="text-lg leading-relaxed">
                I'm comfortable working in both independent and collaborative environments, including distributed teams. I focus on writing clean, maintainable code, improving system performance, and solving complex technical problems efficiently.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What I Bring</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Strong experience in building and scaling e-commerce and marketplace systems</li>
                <li>Solid backend architecture and API design skills</li>
                <li>Experience integrating payment, shipping, and third-party services</li>
                <li>Ability to lead small teams and mentor developers</li>
                <li>Practical experience with production systems and high-load environments</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Backend</h3>
                  <div className="space-y-2">
                    <SkillBar skill="PHP (Magento 2, Laravel)" level={95} />
                    <SkillBar skill="Node.js" level={85} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Frontend</h3>
                  <div className="space-y-2">
                    <SkillBar skill="React.js" level={90} />
                    <SkillBar skill="Next.js" level={90} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Database</h3>
                  <div className="space-y-2">
                    <SkillBar skill="MySQL" level={90} />
                    <SkillBar skill="MSSQL" level={85} />
                    <SkillBar skill="Redis" level={80} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Tools</h3>
                  <div className="space-y-2">
                    <SkillBar skill="Docker" level={85} />
                    <SkillBar skill="Linux" level={90} />
                    <SkillBar skill="Git" level={95} />
                    <SkillBar skill="CI/CD" level={80} />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
        {locale === 'vi' && (
          <>
            <h1 className="text-3xl font-bold mb-6">Về NTD Solutions</h1>

            <section className="mb-8">
              <p className="text-lg leading-relaxed mb-4">
                Tôi là một Nhà phát triển Phần mềm Fullstack với hơn 5 năm kinh nghiệm xây dựng các nền tảng thương mại điện tử, chợ trực tuyến và hệ thống doanh nghiệp có thể mở rộng.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Điểm mạnh cốt lõi của tôi nằm ở phát triển backend, đặc biệt là với PHP (Magento 2, Laravel), nơi tôi đã thiết kế và tối ưu hóa các hệ thống phức tạp, xây dựng các API RESTful, và tích hợp các dịch vụ bên thứ ba như cổng thanh toán và nhà cung cấp logistics. Về phía frontend, tôi có kinh nghiệm thực tế với React.js và Next.js, cho phép tôi cung cấp các giải pháp end-to-end hoàn chỉnh.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                Trong suốt sự nghiệp của mình, tôi đã làm việc trên nhiều dự án đa dạng — từ các nền tảng xã hội với tin nhắn thời gian thực và livestreaming, đến các hệ thống chợ trực tuyến quy mô lớn phục vụ khách hàng quốc tế. Tôi cũng đã đảm nhận các trách nhiệm lãnh đạo, hướng dẫn các thành viên trong nhóm, xem xét mã nguồn, và đóng góp vào các quyết định kiến trúc.
              </p>
              <p className="text-lg leading-relaxed">
                Tôi thoải mái làm việc trong cả môi trường độc lập và hợp tác, bao gồm các nhóm phân tán. Tôi tập trung vào việc viết mã sạch, dễ bảo trì, cải thiện hiệu suất hệ thống, và giải quyết các vấn đề kỹ thuật phức tạp một cách hiệu quả.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Những gì tôi mang lại</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Kinh nghiệm vững chắc trong việc xây dựng và mở rộng các hệ thống thương mại điện tử và chợ trực tuyến</li>
                <li>Kỹ năng kiến trúc backend vững chắc và thiết kế API</li>
                <li>Kinh nghiệm tích hợp thanh toán, vận chuyển và các dịch vụ bên thứ ba</li>
                <li>Khả năng lãnh đạo các nhóm nhỏ và hướng dẫn các nhà phát triển</li>
                <li>Kinh nghiệm thực tế với các hệ thống sản xuất và môi trường tải cao</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Công nghệ sử dụng</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Backend</h3>
                  <div className="space-y-2">
                    <SkillBar skill="PHP (Magento 2, Laravel)" level={95} />
                    <SkillBar skill="Node.js" level={85} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Frontend</h3>
                  <div className="space-y-2">
                    <SkillBar skill="React.js" level={90} />
                    <SkillBar skill="Next.js" level={90} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Database</h3>
                  <div className="space-y-2">
                    <SkillBar skill="MySQL" level={90} />
                    <SkillBar skill="MSSQL" level={85} />
                    <SkillBar skill="Redis" level={80} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Tools</h3>
                  <div className="space-y-2">
                    <SkillBar skill="Docker" level={85} />
                    <SkillBar skill="Linux" level={90} />
                    <SkillBar skill="Git" level={95} />
                    <SkillBar skill="CI/CD" level={80} />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

const SkillBar = ({ skill, level }: { skill: string; level: number }) => {
  return (
    <div className="flex items-center">
      <span className="w-40 text-sm">{skill}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-4 ml-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-300"
          style={{ width: `${level}%` }}
        ></div>
      </div>
      <span className="ml-2 text-sm">{level}%</span>
    </div>
  )
}

export default AboutPage;
