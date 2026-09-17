export const siteConfig = {
  name: "루원365한의원",
  nameEn: "LUWON 365 Korean Medicine Clinic",
  branch: "인천가정역점",
  tagline: "정확하게 진단하고 정성스럽게 진료하겠습니다",
  description:
    "인천 서구 가정동 루원365한의원. 입원이 가능한 인천 서구 최대 규모(300여 평) 한의원. 교통사고 후유증, 통증·척추 클리닉, 체형교정, 추나요법, 다이어트, 입원치료까지 365일 진료합니다.",
  phone: "1877-4975",
  phoneLabel: "1877-4975",
  address: "인천 서구 염곡로464번길 15, 쓰리엠타워 3층",
  addressOld: "인천 서구 가정동 619-7",
  addressDetail: "인천2호선 가정역 6번 출구(기존 4번 출구) 401m · 쓰리엠타워 3층",
  parking: [
    { no: "01", name: "본원 건물 주차장", note: "쓰리엠타워" },
    { no: "02", name: "에이스타워 주차장", note: "바로 건너편 · 무료" },
    { no: "03", name: "엔시티 1차 주차장", note: "엔시티타워" },
  ],
  kakaoLink: "https://pf.kakao.com/_Jjtgn/chat",
  naverMapLink:
    "https://map.naver.com/p/search/%EB%A3%A8%EC%9B%90365%ED%95%9C%EC%9D%98%EC%9B%90",
  naverDirectionsLink:
    "https://map.naver.com/p/directions/-/14100000,0,%EB%A3%A8%EC%9B%90365%ED%95%9C%EC%9D%98%EC%9B%90/-/transit",
  // 구글 지도 기준 좌표 · 장소 ID
  geo: { lat: 37.5262646, lng: 126.6713114 },
  googlePlaceId: "0x357b7fb7548f0b51:0x2344ef54ea59da6",
  googlePlaceIdShort: "ChIJUQuPVLd_ezURpp2lTvVONAI",
  mapEmbedBase:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.7!2d126.6713114!3d37.5262646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b7fb7548f0b51%3A0x2344ef54ea59da6!2z%EB%A3%A8%EC%9B%90365%ED%95%9C%EC%9D%98%EC%9B%90!5e0!3m2!1sko!2skr!4v",
  mapEmbedSuffix: "!5m2!1sko!2skr",
  googleMapLink:
    "https://www.google.com/maps/place/?q=place_id:ChIJUQuPVLd_ezURpp2lTvVONAI&hl=ko",
  kakaoMapLink:
    "https://map.kakao.com/?q=%EC%9D%B8%EC%B2%9C%20%EC%84%9C%EA%B5%AC%20%EC%97%BC%EA%B3%A1%EB%A1%9C464%EB%B2%88%EA%B8%B8%2015",
  businessOwner: "최경준",
  businessNo: "613-98-28188",

  hours: {
    weekday: { label: "평일 (월~금)", time: "09:30 - 21:00", lunch: "점심 13:00 - 14:00" },
    weekend: { label: "주말 · 공휴일", time: "09:00 - 16:00", lunch: "점심 12:00 - 12:30" },
    note: "365일 연중무휴 진료 · 진료 일정은 사정에 따라 변경될 수 있습니다.",
  },

  // 히어로 하단 핵심 수치
  stats: [
    { value: "365", unit: "일", label: "연중무휴 진료" },
    { value: "300", unit: "평", label: "인천 서구 최대 규모" },
    { value: "4", unit: "인", label: "한의사 상주" },
    { value: "0", unit: "원", label: "교통사고 본인부담금" },
  ],

  // 진료 과목 6
  clinics: [
    {
      key: "accident",
      sub: "교통사고 후유증",
      title: "교통사고 클리닉",
      description:
        "추나·약침·한약·입원치료까지 자동차보험 적용으로 본인부담금 0원. 사고 초기에 받는 치료가 더욱 효과적입니다.",
      image: "/clinic-inpatient.jpg",
    },
    {
      key: "pain",
      sub: "고질적인 통증을 해결합니다",
      title: "관절 · 통증 클리닉",
      description:
        "무릎·어깨 관절, 수술 후 재활, 팔꿈치·발 통증까지. 통증의 원인을 분석해 1:1 맞춤 프로그램을 진행합니다.",
      image: "/clinic-treatment.jpg",
    },
    {
      key: "spine",
      sub: "디스크, 수술 없이 치료하자",
      title: "척추 클리닉",
      description:
        "목·허리 디스크, 퇴행성 디스크, 척추관 협착증, 척추전방전위증. 원인 치료부터 예방까지 함께합니다.",
      image: "/consult-male.jpg",
    },
    {
      key: "posture",
      sub: "인체의 구조와 균형을 바로잡다",
      title: "체형교정 · 어린이 클리닉",
      description:
        "일자목·거북목, 골반, 휜다리, 척추측만증 교정. 성장·비염·아토피 등 어린이 한방 진료도 함께 진행합니다.",
      image: "/consult-female.jpg",
    },
    {
      key: "diet",
      sub: "똑똑하게 알고 시작하자",
      title: "다이어트 클리닉",
      description:
        "1:1 맞춤 처방·식단 관리·사후 관리. 아디포7000d 심부고주파, 쿨쎄라, cyro-k 전신 냉각까지 함께합니다.",
      image: "/bookcafe.jpg",
    },
    {
      key: "inpatient",
      sub: "편안하고 집중적인 치료를 위한",
      title: "입원실 안내",
      description:
        "최고급 전동베드 Rx-550과 개인용 32인치 TV. 디스크·협착증·교통사고 후유증의 집중 입원치료가 가능합니다.",
      image: "/clinic-lounge.jpg",
    },
  ],

  // 치료 특장점 4 (지그재그)
  differentiation: [
    {
      no: "01",
      en: "Inpatient Care",
      title: "입원실 운영",
      lead: "집처럼 편안하게, 집중적인 장기치료를 위해.",
      body:
        "집중치료를 원하는 분들을 위해 입원실을 운영합니다. 최고급 전동베드 Rx-550과 개인용 32인치 TV를 갖추고, 치료에만 전념하실 수 있도록 쾌적한 환경을 유지합니다.",
      tags: ["전동베드 Rx-550", "개인용 32인치 TV", "디스크·협착증 입원치료"],
      image: "/clinic-inpatient.jpg",
    },
    {
      no: "02",
      en: "Precise Analysis",
      title: "체형 분석기 · 족부 분석기",
      lead: "객관적인 데이터로 세우는 치료 계획.",
      body:
        "정확한 상태 파악을 위해 체형 분석기와 족부 분석기로 검사를 시행합니다. 검사 자료를 한의사가 직접 분석하고, 이를 바탕으로 맞춤 치료를 제공합니다.",
      tags: ["인바디 체성분측정", "엑스바디 체형분석", "족부 분석"],
      image: "/consult-female.jpg",
      imagePosition: "70% 38%",
    },
    {
      no: "03",
      en: "Chuna Therapy",
      title: "추나요법",
      lead: "불균형을 바로잡아야 통증이 잡힙니다.",
      body:
        "비뚤어진 뼈와 관절을 한의사가 직접 손으로 밀고 당겨 정상 위치로 돌려놓는 한방 수기요법입니다. 부드러운 경근 추나와 구조를 잡는 정골 추나를 상태에 맞게 시행합니다.",
      tags: ["경근 추나", "정골 추나", "챠타누가 에르고스타일 · 라파엘707"],
      image: "/clinic-treatment.jpg",
    },
    {
      no: "04",
      en: "Immune Pharmacopuncture",
      title: "면역약침",
      lead: "약물의 치료 효과를 경혈에 직접.",
      body:
        "한약재에서 정제·추출한 약액을 경혈에 직접 주입하여 치료 효과를 극대화하는 치료법입니다. 루원365한의원은 AJ·남상천 원외탕전실에서 조제되는 면역약침을 사용합니다.",
      tags: ["원외탕전 조제", "인대·관절 재생", "아디포7000d 심부고주파"],
      image: "/consult-male.jpg",
      imagePosition: "72% 34%",
    },
  ],

  // 추나 치료 POINT
  chunaPoints: [
    { no: "POINT 01", text: "체형 분석기와 족부 분석기로 얻은 객관적 자료를 토대로 치료 계획을 세웁니다." },
    { no: "POINT 02", text: "약침치료, 고주파 치료로 치료 효과를 극대화합니다." },
    { no: "POINT 03", text: "근막이완을 위한 침치료를 병행하여 추나치료의 효과를 극대화합니다." },
  ],

  // 치료 방법 6
  treatments: [
    { name: "한약", effect: "기혈 순환 · 어혈 감소" },
    { name: "침", effect: "통증 및 염증 감소" },
    { name: "약침", effect: "인대 · 관절 재생" },
    { name: "부항", effect: "혈액순환 자극" },
    { name: "뜸", effect: "심신 안정" },
    { name: "추나요법", effect: "긴장 감소 · 구조 교정" },
  ],

  // 의료진 4인 — 사진은 ru1.kr 소개 페이지 기준
  doctors: [
    {
      name: "최경준",
      position: "대표원장",
      photo: "/doctor-choi.jpg",
      careers: [
        "現) 루원365한의원 대표원장",
        "前) 해통한의원 원장",
        "前) 공립광양노인전문병원 한방과장",
        "前) 구침한의원 부원장",
        "前) 장흥 한방공공사업팀 한의사",
        "한방공공의료 부문 보건복지부 장관상 수상",
      ],
    },
    {
      name: "박수민",
      position: "진료원장",
      photo: "/doctor-park.jpg",
      careers: [
        "現) 루원365한의원 진료원장",
        "前) 반석한의원 진료원장",
        "前) 아카데미한의원 진료원장",
        "前) 미올한의원 진료원장",
        "前) 백록담한의원 진료원장",
        "前) 광덕안정한의원 진료원장",
        "총통의학회 정회원",
      ],
    },
    {
      name: "유시헌",
      position: "진료원장",
      photo: "/doctor-yu.jpg",
      careers: [
        "대전대학교 한의과대학 졸업",
        "일산 자생한방병원 일반수련의 수료",
        "前) 남양주경희한방병원 진료원장",
        "추나의학 아카데미 정규과정 수료",
        "척추신경추나의학회 회원",
        "대한스포츠한의학회 회원",
        "대한한방비만학회 회원",
      ],
    },
    {
      name: "오용환",
      position: "진료원장",
      photo: "/doctor-oh.jpg",
      careers: [
        "現) 루원365한의원 진료원장",
        "교통사고 후유증 · 입원 재활 진료",
        "비만 · 다이어트 클리닉 (한약 · 심부고주파)",
        "어린이 클리닉 (성장 · 비염 · 아토피)",
      ],
    },
  ],

  // 둘러보기 갤러리
  facilities: [
    { src: "/entrance.jpg", label: "입구", wide: false },
    { src: "/reception.jpg", label: "데스크 · 홀", wide: true },
    { src: "/lobby.jpg", label: "대기 로비", wide: false },
    { src: "/clinic-consult.jpg", label: "진료실", wide: false },
    { src: "/treatment-room.jpg", label: "치료실", wide: true },
    { src: "/clinic-lounge.jpg", label: "물리치료 라운지", wide: false },
    { src: "/clinic-inpatient.jpg", label: "입원실", wide: false },
    { src: "/bookcafe.jpg", label: "북카페 휴게공간", wide: false },
    { src: "/lounge-rest.jpg", label: "휴게 라운지", wide: false },
  ],

  // 교통사고 진료 STEP
  accidentSteps: [
    { step: "01", title: "예약", text: "예약 시 데스크에 교통사고·자동차보험 치료임을 미리 알려주세요." },
    { step: "02", title: "지불보증서 확인", text: "보험사 담당자와 확인을 통해 진료비 지불보증서를 받습니다." },
    { step: "03", title: "진료", text: "증상에 따라 추나·약침·침·물리치료·한약 등의 치료를 진행합니다." },
    { step: "04", title: "수납", text: "자동차보험 적용으로 자가부담금 0원 처리됩니다." },
  ],

  columnCategories: ["교통사고", "통증 관리", "척추·디스크", "체형교정", "추나요법", "다이어트", "진료 안내", "체력·건강", "일반"],

  // 검색 노출 핵심 키워드 (교통사고한의원 중심)
  keywords: [
    "교통사고한의원",
    "인천교통사고한의원",
    "인천서구 교통사고한의원",
    "가정동 교통사고한의원",
    "청라 교통사고한의원",
    "루원시티 한의원",
    "교통사고 후유증 치료",
    "교통사고 한방치료",
    "자동차보험 한의원",
    "교통사고 입원실",
    "1~3인 입원실 한의원",
    "인천 입원 한의원",
    "가정역 한의원",
    "인천 서구 한의원",
    "추나요법",
    "목디스크 허리디스크 한의원",
    "척추관 협착증",
    "체형교정 한의원",
    "다이어트 한의원",
    "365일 진료 한의원",
  ],

  // AEO(질의응답) — 검색 스니펫·AI 답변용
  faq: [
    {
      q: "교통사고 후 한의원 치료도 자동차보험이 적용되나요?",
      a: "네. 교통사고 치료는 자동차보험이 적용되어 침, 부항, 물리치료, 추나치료, 약침, 한약은 물론 입원비까지 보험사가 부담합니다. 루원365한의원에서 보험사 담당자와 확인 후 진료비 지불보증서를 받아 진행하므로 본인부담금 0원으로 치료받으실 수 있습니다.",
    },
    {
      q: "인천에서 교통사고 입원치료가 가능한 한의원인가요?",
      a: "루원365한의원은 인천 서구 가정동에 위치한 300여 평 규모의 한의원으로 1~3인 입원실을 운영합니다. 최고급 전동베드 Rx-550과 개인용 32인치 TV를 갖추고 있어 교통사고 후유증, 디스크, 협착증의 집중 입원치료가 가능합니다.",
    },
    {
      q: "교통사고 후유증은 언제부터 나타나나요?",
      a: "교통사고 후유증은 빠르면 사고 발생 2일 안에 나타나지만 늦으면 수개월 후 갑작스럽게 나타날 수 있습니다. 사고 직후 큰 이상이 없어 보여도 목·허리 통증, 두통, 어지럼증, 손발 저림 등이 이어진다면 조기에 진료받는 것이 좋습니다.",
    },
    {
      q: "교통사고 치료는 어떤 순서로 진행되나요?",
      a: "예약 시 교통사고·자동차보험 치료임을 알려주시면, 보험사 확인을 거쳐 진료비 지불보증서를 받은 뒤 증상에 따라 추나요법, 약침, 침, 물리치료, 한약 치료를 진행합니다. 수납은 자동차보험 적용으로 자가부담금 0원 처리됩니다.",
    },
    {
      q: "진료시간과 위치가 어떻게 되나요?",
      a: "평일 09:30~21:00, 주말·공휴일 09:00~16:00에 진료하며 365일 연중무휴로 운영합니다. 인천 서구 염곡로464번길 15 쓰리엠타워 3층에 위치하며 인천2호선 가정역 6번 출구에서 401m 거리입니다. 예약·상담은 1877-4975로 문의해 주세요.",
    },
  ],

  seo: {
    defaultTitle: "루원365한의원 - 교통사고한의원, 1~3인 입원실 | 인천 서구 가정동",
    titleTemplate: "%s | 루원365한의원 · 인천 교통사고한의원",
    defaultDescription:
      "인천 교통사고한의원 루원365한의원. 자동차보험 적용으로 본인부담금 0원, 1~3인 입원실 운영. 교통사고 후유증, 목·허리 디스크, 추나요법, 체형교정, 다이어트까지 4명의 한의사가 365일 진료합니다. 가정역 6번 출구 401m.",
    siteUrl: "https://ru1.kr",
    ogImage: "/og-image.jpg",
    ogImageSquare: "/og-square.jpg",
    // 발급 후 값만 채우면 검색엔진 소유 확인이 완료됩니다.
    naverVerification: "02659d9f39769c9eb3b575ac59be36a42203b8f7",
    googleVerification: "",
  },
};

export type SiteConfig = typeof siteConfig;
