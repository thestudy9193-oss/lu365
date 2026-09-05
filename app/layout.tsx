import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickMenu from "@/components/QuickMenu";
import { siteConfig } from "@/config/site";

const { seo } = siteConfig;

export const metadata: Metadata = {
  title: {
    default: seo.defaultTitle,
    template: seo.titleTemplate,
  },
  description: seo.defaultDescription,
  keywords: siteConfig.keywords,
  metadataBase: new URL(seo.siteUrl),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "의료",
  alternates: { canonical: "/" },
  openGraph: {
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    siteName: siteConfig.name,
    locale: "ko_KR",
    type: "website",
    url: seo.siteUrl,
    images: [
      { url: seo.ogImage, width: 1200, height: 630, alt: "루원365한의원 교통사고 1~3인 입원실 · 365 연중무휴 진료" },
      { url: seo.ogImageSquare, width: 1000, height: 1000, alt: "루원365한의원 의료진" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    images: [seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    ...(seo.googleVerification ? { google: seo.googleVerification } : {}),
    ...(seo.naverVerification ? { other: { "naver-site-verification": seo.naverVerification } } : {}),
  },
  other: {
    // 카카오톡·네이버 공유 썸네일 보조
    "og:image:width": "1200",
    "og:image:height": "630",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2A1C14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        {/* 라틴 에디토리얼 세리프 (한글 디스플레이는 부크크 명조) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400;1,9..144,500&display=swap"
        />
        <meta name="geo.region" content="KR-28" />
        <meta name="geo.placename" content="인천광역시 서구 가정동" />
        <meta name="geo.position" content="37.5262646;126.6713114" />
        <meta name="ICBM" content="37.5262646, 126.6713114" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <QuickMenu />
      </body>
    </html>
  );
}
