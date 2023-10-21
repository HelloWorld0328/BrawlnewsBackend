const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

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

app.get("/read",(req,res)=>{
  const posts = readJson()
  res.json(posts)
})

app.post("/write",(req,res)=>{
  const get = req.body;
  const reqjsondata=JSON.stringify(get)
  const reqdata=JSON.parse(reqjsondata)
  console.log(reqdata);

  // JSON 파일에서 데이터 읽기
  const posts = readJson();

  // 새로운 데이터 추가
  posts.push(reqdata);

  // JSON 파일에 데이터 저장
  writeJson(posts);

  res.json({ message: '데이터가 성공적으로 추가되었습니다.' });
})

app.listen(port,()=>{
  console.log(`서버가 포트 ${port}에서 실행중 입니다.`)
})