const express = require("express");
const { json } = require("express/lib/response");
const Post = require("../schemas/post")
const User = require("../schemas/user")
const router = express.Router();
const cors = require("cors");
const authMiddleware = require("../middlewares/auth")
const Upload = require("../middlewares/upload")
const { upload } = require("../middlewares/upload")
const path = require("path")

router.use(cors());


router.get("/", (req, res) =>{
    res.send("this is root page");
});

// /api/list --> Json 형식으로 전송받음 -->list.html에서 ajax로 가져감.
router.get("/main", authMiddleware, async (req, res) => {
    console.log("/api/main 연결")
    try {
        const post = await Post.find().sort({ "post_id": -1 });
        // console.log('findpost-->',post)
        // console.log(image)
        res.json({ result : post });
    } catch (err) {
    console.error(err);
    next(err);
    };
});

// /api/posts --> 글 작성
router.post("/posts", authMiddleware, upload.single("imgae"), async (req, res,) => {
    console.log("/api/posts 연결");
    
    // ajax --> request 
    // imageUrl 여부 확인 필요.
    const { user_id } = res.locals.user
    const { title, content } = req.body;
    const image = req.file.location;
    const createdAt = Date.now();
    const userName = await User.findOne({ user_id })
    const user_name = userName.user_name
    console.log(user_id, user_name)
    // console.log('0--->',{user_name, title, content, createdAt})
  
    // list 내림차순 정렬
    const postList = await Post.find().sort({ "post_id": -1 });
    // console.log(postList)

    // post_id 부여
    let post_id = 0;
      if(postList.length == 0 || postList === null || postList == undefined){
        post_id = 1;
    } else{
        post_id = postList[0].post_id+1
    }
    // console.log('1--->',post_id)
    const sendPost = await Post.create({ post_id, user_id, user_name, title ,content, createdAt, image });
    res.json({result : sendPost}); 
    console.log(sendPost);
  });

// // 이미지 업로드 테스트
// router.post("/posts/imageUpload", upload.single("image"), async (req, res) => {
// 	try {
// 		const image = req.file.location;
// 		res.json({ result: "success", image });
// 	} catch (err) {
// 		res.status(400).json({ result: "fail", msg: err });
// 	}
// });

// 게시판 상세조회 API
router.post("/posts/:post_id", authMiddleware, async (req, res) => {
  //  console.log('req-->',req)
   const { post_id } = req.params;
   console.log(post_id);
   const [post] = await Post.find({post_id:post_id});
  //  console.log('post_id-->',post_id)
   res.json({
    result:post
   })
});

// post 수정 API
router.post("/modify/:post_id", authMiddleware, async (req, res,) => {
  console.log("router/api/modify 연결");
  // html ajax --> 내용을 request 함. 
  const {user_id} = req.locals.user;
  const {post_id , title, content, createdAt} = req.body;
//   console.log('1-->',{post_id , title, user_name, content, createdAt});
  // userId = 고유함 --> 유저 id 이거일때 뒤에꺼 바꿈
  //updateOne ({A} , {B})
  // A - > 변경될 데이터의 조건
  // B - > 변경될 데이터
  const modifyPost = await Post.updateOne({post_id:post_id},{title:title, user_id:user_id, content:content, title:title, createdAt:createdAt});
  res.json({result : modifyPost});  // key : value (Json 형태)
  // console.log(modifyPost);
});

router.delete("/delete/:post_id", authMiddleware, async (req, res,) => {
  console.log("router/api/delete 연결");
  // html ajax --> 내용을 request 함. 
  // console.log('req-->',req);
  const {post_id} = req.body;
  const deletePost = await Post.deleteOne({post_id:post_id});
  // console.log(deletePost);

  res.json({result : deletePost}); 
});


module.exports = router; //router를 모듈로 내보낸다.
