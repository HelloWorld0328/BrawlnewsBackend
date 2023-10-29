const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors')

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const jsonFilePath = __dirname + "/posts.json";

function readJson() {
  try {
    const data = fs.readFileSync(jsonFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeJson(data) {
  fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf-8");
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get('/posts', (req, res) => {
  const posts = readJson();
  res.json(posts);
});

app.get('/index', (req, res) => {
  const posts = readJson();
  const datapost = posts;
  const len = datapost.length;
  res.send(len);
});

app.post('/upload', (req, res) => {
  let reqdata = req.body;
  const posts = readJson();
  reqdata.id = readJson().length;
  posts.push(reqdata);
  writeJson(posts);
  res.json({ message: `데이터가 성공적으로 추가되었습니다.,${reqdata}` });
});

app.post('/comment', (req, res) => {
  let reqdata = req.body;
  let posts = readJson();
  posts[reqdata.id].comments.push({ name: reqdata.name, comment: reqdata.comment });
  writeJson(posts);
  res.json({ message: `데이터가 성공적으로 추가되었습니다.,${reqdata}` });
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
