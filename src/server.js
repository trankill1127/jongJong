import express from "express";
import path from "path";

const PORT = process.env.PORT || 4000; // 환경 변수에서 포트를 설정하거나 기본값으로 4000을 사용합니다.

const app = express();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.use("/image", express.static(path.join(__dirname, "image")));
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/client", express.static(path.join(__dirname, "client")));

const handleListening = () => {
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);
};

app.listen(PORT, handleListening);
