// products-data.js
// 👉 이 파일에서만 상품명 / 설명 / 가격 문구 / 쿠팡 링크를 관리하세요.

const PRODUCTS = [
  {
    id: "root-volume-spray",
    title: "볼륨 살려주는 루트 리프팅 스프레이",
    thumbLabel: "대표 이미지",
    // 필요하면 실제 이미지 주소 넣기 (없으면 thumbLabel이 보임)
    // imageUrl: "https://...",
    tags: ["정수리 볼륨 고민", "자연스러운 고정력", "데일리 스타일링"],
    desc: "뿌리 부분만 가볍게 살려주는 타입이라 답답하지 않고, 초보자도 쉽게 정수리 볼륨을 연출할 수 있는 스프레이입니다.",
    priceText: "쿠팡 기준 약 1만~2만원대",
    link: "https://www.coupang.com" // 🔁 여기를 네 쿠팡 파트너스 링크로 교체
  },
  {
    id: "damage-care-treatment",
    title: "손상 모발 집중 케어 트리트먼트",
    thumbLabel: "대표 이미지",
    tags: ["염색·펌 모발", "집중 영양", "주 1–2회 사용"],
    desc: "건조하고 끊어지는 모발에 수분과 단백질을 동시에 공급해 주는 집중 케어 트리트먼트로, 샴푸 후 5분만으로도 촉촉한 머릿결을 유지할 수 있습니다.",
    priceText: "쿠팡 기준 약 1만~3만원대",
    link: "https://www.coupang.com" // 🔁 교체
  },
  {
    id: "hard-wax",
    title: "애즈·가르마 연출용 하드 왁스",
    thumbLabel: "대표 이미지",
    tags: ["남녀 공용", "강한 고정력", "번들거림 최소화"],
    desc: "가벼운 사용감에 비해 고정력이 좋아, 애즈펌·가르마 스타일을 하루 종일 유지하고 싶은 분께 어울리는 왁스 타입입니다.",
    priceText: "쿠팡 기준 약 1만대",
    link: "https://www.coupang.com" // 🔁 교체
  }
];

// 👇 상품을 추가하고 싶으면 아래처럼 객체를 하나 더 붙이면 됩니다.
/*
PRODUCTS.push({
  id: "new-item",
  title: "새 상품 이름",
  thumbLabel: "대표 이미지",
  // imageUrl: "https://...",
  tags: ["태그1", "태그2"],
  desc: "설명 문구",
  priceText: "쿠팡 기준 약 O만원대",
  link: "쿠팡 파트너스 링크"
});
*/
