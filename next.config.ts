import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob (칼럼 썸네일)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  // 로컬(파일) 모드에서 서버리스 번들에 시드 칼럼 포함
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
};

export default nextConfig;
