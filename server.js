// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const app = express();

// __dirname 설정 (ESM에서 경로 얻기)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 미들웨어
app.use(cors());
app.use(express.json({ limit: "20mb" })); // base64 이미지 받을 수 있게
app.use(express.static(path.join(__dirname, "public"))); // public 폴더 정적 서빙

// 메인 페이지
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// AI 헤어스타일 미리보기 API (현재는 더미 응답)
app.post("/api/hair-preview", async (req, res) => {
  try {
    const { image_base64, gender, base_style } = req.body;

    if (!image_base64) {
      return res.status(400).json({ success: false, error: "image_base64가 없습니다." });
    }

    console.log("요청 도착:", { gender, base_style });

    // TODO: 나중에 여기서 실제 이미지 생성 AI 호출
    // 지금은 테스트용으로 같은 이미지를 3번 돌려줌
    const resultImages = [image_base64, image_base64, image_base64];

    return res.json({
      success: true,
      styles: [
        { name: "스타일 1 (테스트용)", image: resultImages[0] },
        { name: "스타일 2 (테스트용)", image: resultImages[1] },
        { name: "스타일 3 (테스트용)", image: resultImages[2] }
      ]
    });
  } catch (err) {
    console.error("hair-preview 오류:", err);
    return res.status(500).json({ success: false, error: "서버 오류가 발생했습니다." });
  }
});

// 포트 설정 (Render에서도 PORT 환경변수 사용)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Hair Stylist 서버 실행중: http://localhost:${PORT}`);
});
