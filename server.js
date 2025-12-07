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

// 정적 파일 제공 (루트 + public)
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "public")));

// 헬스체크
app.get("/health", (req, res) => {
  res.send("ok");
});

// OpenAI 클라이언트
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// -------- AI 헤어 스타일 프리뷰 --------
app.post("/api/hair-preview", async (req, res) => {
  try {
    const { image_base64, gender = "여성", base_style = "중간 길이" } = req.body;

    if (!image_base64) {
      return res.status(400).json({
        success: false,
        message: "image_base64 가 비어 있습니다.",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "서버에 OPENAI_API_KEY 가 설정되어 있지 않습니다.",
      });
    }

    const prompt = `
사용자의 얼굴은 그대로 유지하고 머리 스타일만 바꾼 헤어스타일 프리뷰 이미지를 만들어 주세요.
- 한국인 ${gender} 기준 자연스러운 얼굴
- ${base_style} 느낌을 기반으로 한 3가지 스타일
- 헤어샵 카탈로그 느낌
- 배경은 단색
`;

    // 🚨 response_format 제거 (에러 원인 해결)
    const aiRes = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 3,
      size: "1024x1024"
    });

    const styles = aiRes.data.map((item, idx) => ({
      name: `스타일 ${idx + 1}`,
      image: `data:image/png;base64,${item.b64_json}`,
    }));

    return res.json({
      success: true,
      styles,
    });

  } catch (err) {
    console.error("💥 /api/hair-preview 오류:", err);

    return res.status(500).json({
      success: false,
      message: "AI 스타일 생성 중 오류가 발생했습니다.",
      error: err.message,
    });
  }
});

// -------- 서버 시작 --------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ AI Hair Stylist server running on port ${PORT}`);
});
