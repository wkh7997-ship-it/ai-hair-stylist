// server.js
import express from "express";
import cors from "cors";
import path from "path";
import OpenAI from "openai";
import "dotenv/config";

const app = express();
const __dirname = path.resolve();

// -------- 기본 설정 --------
app.use(cors());
app.use(express.json({ limit: "20mb" })); // 사진 base64 받으려고 크게 설정

// ✅ 정적 파일 서빙
// 1) 프로젝트 루트 (index.html, loading.html, result.html 등)
// 2) public 폴더 (public/index.html 쓰는 경우까지 커버)
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "public")));

// Render 헬스체크용
app.get("/health", (req, res) => {
  res.send("ok");
});

// -------- OpenAI 클라이언트 --------
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// -------- AI 헤어 스타일 프리뷰 API --------
app.post("/api/hair-preview", async (req, res) => {
  try {
    const {
      image_base64,
      gender = "여성",
      base_style = "중간 길이",
    } = req.body || {};

    if (!image_base64) {
      return res.status(400).json({
        success: false,
        message: "image_base64 가 비어 있습니다. 먼저 사진을 보내 주세요.",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // 서버에 키가 없으면 바로 에러 반환
      return res.status(500).json({
        success: false,
        message: "서버에 OPENAI_API_KEY 가 설정되어 있지 않습니다.",
      });
    }

    // data:image/jpeg;base64,XXXXX 이런 앞부분 제거 (지금은 사용 안 해도 무방)
    const cleaned = image_base64.replace(/^data:image\/\w+;base64,/, "");

    // OpenAI 이미지 생성 호출
    const prompt = `
사용자의 얼굴은 그대로 유지하고 머리 스타일만 바꾼 헤어 스타일 프리뷰 이미지를 만들어 주세요.
- 한국인 ${gender} 기준 자연스러운 얼굴
- ${base_style} 느낌을 기본으로 한, 서로 다른 3가지 스타일
- 어색한 왜곡 없이 실제 헤어샵 카탈로그 같은 느낌
- 배경은 단순하고 얼굴과 머리카락이 잘 보이게
`;

    const aiRes = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 3, // 3가지 스타일
      size: "1024x1024",
      // image: cleaned,   // 나중에 편집 모드 쓸 때 사용
      response_format: "b64_json",
    });

    const styles = (aiRes.data || []).map((item, idx) => ({
      name: `스타일 ${idx + 1}`,
      image: `data:image/png;base64,${item.b64_json}`,
    }));

    if (!styles.length) {
      throw new Error("이미지 생성 결과가 비어 있습니다.");
    }

    return res.json({
      success: true,
      styles,
    });
  } catch (err) {
    console.error("💥 /api/hair-preview 오류:", err);

    return res.status(500).json({
      success: false,
      message: "AI 스타일 생성 중 오류가 발생했습니다.",
      error: err.message || String(err),
    });
  }
});

// -------- 서버 시작 --------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ AI Hair Stylist server running on port ${PORT}`);
});
