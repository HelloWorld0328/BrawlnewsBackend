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

app.post('/viewup', (req, res) => {
  let data = req.body;
  const posts = readJson();
  const postId = data.id; // 요청으로부터 받은 포스트의 ID
  const foundPost = posts.find(post => post.id === postId); // 해당 ID의 포스트 찾기
  if (foundPost) {
    foundPost.views++; // 조회수 증가
    writeJson(posts);
    res.json({ message: `포스트의 조회수가 증가되었습니다.,${foundPost}` });
  } else {
    res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
  }
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});


























// app.post('/comment', (req, res) => {
//   let reqdata = req.body;
//   let posts = readJson();
//   const post = posts.find(p => p.id === reqdata.id);
//   if (post) {
//     if (!post.comments) {
//       post.comments = [];
//     }
//     post.comments.push({ name: reqdata.name, comment: reqdata.comment });
//     writeJson(posts);
//     res.json({ message: '댓글이 성공적으로 추가되었습니다.', reqdata });
//   } else {
//     res.status(404).json({ message: '해당 ID를 가진 포스트를 찾을 수 없습니다.' });
//   }
// });


