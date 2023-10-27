const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors')

app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://brawlnews.kro.kr/'); // 허용할 도메인을 설정합니다.
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

app.use(bodyParser.json()); // JSON 데이터 파싱
app.use(bodyParser.urlencoded({ extended: true }));

// JSON 파일 경로
const jsonFilePath = __dirname + "/posts.json";

// JSON 파일을 읽어오는 함수
function readJson() {
  try {
    const data = fs.readFileSync(jsonFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// JSON 파일에 데이터를 저장하는 함수
function writeJson(data) {
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf-8");
}

// 루트 경로
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// 모든 포스트 가져오기
app.get('/posts', (req, res) => {
  const posts = readJson();
  res.json(posts);
});
app.get('/index', (req, res) => {
  const posts = readJson();
  const datapost=posts
  const len=datapost.length
  res.send(len)
});

// 새로운 포스트 추가
app.post('/upload', (req, res) => {
  const reqdata = req.body;
  console.log(reqdata);

  // JSON 파일에서 데이터 읽기
  const posts = readJson();

  // 새로운 데이터 추가
  posts.push(reqdata);

  // JSON 파일에 데이터 저장
  writeJson(posts);

  res.json({ message: '데이터가 성공적으로 추가되었습니다.' });
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
