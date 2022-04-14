const express = require("express");
// const { json } = require("express/lib/response");
const Post = require("../schemas/post")
const router = express.Router();
const cors = require("cors");
const authMiddleware = require("../middlewares/auth")
const { upload } = require("../middlewares/upload")
const deleteS3 = require("../middlewares/deleteS3")

router.use(cors());

router.get("/", (req, res) =>{
    res.send("this is root page");
});

// /api/list --> Json 형식으로 전송받음 -->list.html에서 ajax로 가져감.
router.get("/main", async (req, res) => {
    console.log("/api/main 연결")
    try {
        const post = await Post.find().sort({ "post_id": -1 });
        res.json({ result : post });
    } catch (err) {
    console.error(err);
    next(err);
    };
});

// /api/posts --> 글 작성
router.post("/posts", authMiddleware, upload.single("image"), async (req, res,) => {
    console.log("/api/posts 연결");
    // const { user } = res.locals;
    // const user_id = user[0].user_id
    // const user_name = user[0].user_name
    const { title, content } = req.body;
    const image = req.file.location;
    const createdAt = Date.now();  
    const postList = await Post.find().sort({ "post_id": -1 });

    let post_id = 0;
      if(postList.length == 0 || postList === null || postList == undefined){
        post_id = 1;
    } else{
        post_id = postList[0].post_id+1
    }
    const sendPost = await Post.create({ post_id, title ,content, createdAt, image});
    res.json({result : sendPost}); 
    console.log(sendPost);
  });

// 게시판 상세조회 API
router.post("/posts/:post_id", authMiddleware, async (req, res) => {
   const { post_id } = req.params;
   console.log(post_id);
   const [post] = await Post.find({post_id:post_id});
   res.json({
    result:post
   })
});

// post 수정 API
router.post("/modify/:post_id", authMiddleware, upload.single("image"), async (req, res,) => {
  console.log("router/api/modify 연결"); 
  const { user } = res.locals;
  const user_id = user[0].user_id;
  const user_name = user[0].user_name;
  const post_id = req.params.post_id;
  const image = req.file.location;
  const { title, content } = req.body;
  const createdAt = Date.now();
  const checkPost = await Post.find({ post_id: post_id })

  if (checkPost) {
    if (user_id !== checkPost[0].user_id) {
      return res.status(400).send({
        result: "fail",
        errorMessage: "자기글만 수정할 수 있습니다.",
      });
    } else {
      if (checkPost[0].image !== image) {
        await deleteS3(checkPost);
      }
      await Post.updateOne({ post_id: post_id }, { title: title, user_id: user_id, user_name: user_name, content: content, title: title, createdAt: createdAt, image: image });
      console.log('게시글 수정 완료!')
    }
    res.json({ result: "success", msg: "수정되었습니다." });
  };
});

router.delete("/delete/:post_id", authMiddleware, async (req, res,) => {
  console.log("router/api/delete 연결");
  const post_id = req.params.post_id;
  const { user } = res.locals;
  const user_id = user[0].user_id;
  console.log(user_id, post_id)
  const checkPost = await Post.find({post_id:post_id})

  if (checkPost) {
    if (user_id !== checkPost[0].user_id) {
      return res.status(400).send({
        result: "fail",
        errorMessage: "자기글만 삭제할 수 있습니다.",
      });
    } else {
        await deleteS3(checkPost);
        await Post.deleteOne({post_id:post_id})
      }
    }
	res.json({ result: "success", msg: "삭제되었습니다." })
})



module.exports = router;
