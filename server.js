const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3030;
const cors = require('cors');

// const whitelist = ["http://localhost:3000", "http://localhost:8081","http://172.23.96.1:3000","https://brawlnews.kro.kr","https://brawlnews.onrender.com"];

// const corsOptions = {
//   origin: function (origin, callback) { 
//     if (whitelist.indexOf(origin) !== -1) { // 만일 whitelist 배열에 origin인자가 있을 경우
//       callback(null, true); // cors 허용
//     } else {
//       callback(new Error("Not Allowed Origin!")); // cors 비허용
//     }
//   },
// };

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
  reqdata.comment=[]
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


// app.post('/uploadcomment', (req, res) => {
//   let data = req.body;
//   const posts = readJson();
//   const postId = data.postId; // 댓글을 달 포스트의 ID
//   const foundPost = posts.find(post => post.id === postId); // 해당 ID의 포스트 찾기
//   if (foundPost) {
//     foundPost.comments.push({ name: data.name, content: data.content });
//     writeJson(posts);
//     res.json({ message: '댓글이 성공적으로 추가되었습니다.' });
//   } else {
//     res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
//   }
// });

app.post('/uploadcomment', (req, res) => {
  const { name, content, postId } = req.body;
  console.log(name)
  console.log(content)
  console.log(postId)
  const posts = readJson();
  const foundPost = posts.find(post => post.id === postId);

  if (foundPost) {
    const newComment = { name, content };
    foundPost.comment.push(newComment);
    writeJson(posts);
    res.json({ message: `댓글이 성공적으로 추가되었습니다.`, newComment });
  } else {
    res.status(404).json({ error: '해당하는 글을 찾을 수 없습니다.' });
  }
});


app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});

