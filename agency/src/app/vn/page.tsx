import type { Metadata } from "next";
import Landing from "@/components/Landing";

export const metadata: Metadata = {
  title: "Gurren Grow — Phần mềm của riêng bạn. Đối tác bạn tin tưởng.",
  description:
    "Chúng tôi thay thế các ứng dụng thuê bao bằng một hệ thống riêng, xây dựng cho doanh nghiệp bạn — và đồng hành lâu dài. Tại Việt Nam, phục vụ Đông Nam Á.",
};

export default function HomeVn() {
  return <Landing locale="vn" />;
}
