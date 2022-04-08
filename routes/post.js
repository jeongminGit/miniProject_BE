const express = require("express");
const { json } = require("express/lib/response");
const Post = require("../schemas/post")
const router = express.Router();

router.get("/", (req, res) =>{
    res.send("this is root page");
});


// /api/list --> Json 형식으로 전송받음 -->list.html에서 ajax로 가져감.
router.get("/main", async (req, res) => {
    console.log("/api/main 연결")
    try {
        const post = await Post.find().sort({ "createdAt": -1 });
        res.json({ post : post }); // ajax -> post로 받으면됌.
    } catch (err) {
    console.error(err);
    next(err);
    }
});

// /api/posts --> 글 작성
router.post("/posts", async (req, res,) => {
    console.log("/api/posts 연결");
    
    // ajax --> request 
    // imageUrl 여부 확인 필요.
    const {user_id, title, content, createdAt} = req.body;
    console.log('0--->',{user_id, title, content, createdAt})
  
    // list 내림차순 정렬
    const postList = await Post.find().sort({ "createdAt": -1 });
    // console.log(postList)

    // post_id 부여
    let post_id = 0;
      if(postList.length == 0 || postList === null || postList == undefined){
        post_id = 1;
    }else{
        post_id = postList[0].post_id+1
    }
    console.log('1--->',post_id)

    const sendPost = await Post.create({ userNum, boardNum ,nickname, comment, password, title, data});

    // key : value (Json 형태) --> client로 보냄
    res.json({sendPost : sendPost}); 
    console.log(sendPost);
  });
  
// 게시판 상세조회 API
router.post("/posts/:post_id", async (req, res) => {
  //  console.log('req-->',req)
   const {post_id} = req.body;
   const [post] = await Post.find({post_id:post_id});
  //  console.log('post_id-->',post_id)
   res.json({
    post:post
   })
});


// post 수정 API
router.post("/modify/:post_id", async (req, res,) => {
  console.log("router/api/modify 연결");
  let today = new Date();
  let data = today.toLocaleString();
  
  
  // html ajax --> 내용을 request 함. 
  const {boardNum , title, nickname, comment, password} = req.body;
  console.log({boardNum,title, nickname, comment, password});
  // userId = 고유함 --> 유저 id 이거일때 뒤에꺼 바꿈
  //updateOne ({A} , {B})
  // A - > 변경될 데이터의 조건
  // B - > 변경될 데이터
  const sendwrite = await Write.updateOne({boardNum:boardNum},{nickname:nickname, comment:comment, password:password, title:title,data:data});
  res.json({sendwrite : sendwrite});  // key : value (Json 형태)
  // console.log(sendwrite);
});

 //get --> query, post --> body 
 // delete apis
router.delete("/delete/:boardNum", async (req, res,) => {
  console.log("router/api/delete 연결");
  // html ajax --> 내용을 request 함. 
  // console.log('req-->',req);
  const {boardNum} = req.body;
  console.log(boardNum);
  const sendwrite = await Write.deleteOne({boardNum:boardNum});
  // console.log(sendwrite);

  res.json({sendwrite : sendwrite}); 
  // console.log(sendwrite);
});







module.exports = router; //router를 모듈로 내보낸다.