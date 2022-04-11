const express = require('express');
const { json } = require("express/lib/response");
const Comments = require('../models/comment');
const router = express.Router();


router.get("/", (req, res) =>{
    res.send("this is root page");
});

// /api/list --> Json 형식으로 전송받음 -->list.html에서 ajax로 가져감.
router.get("/main", async (req, res) => {
    console.log("/api/main 연결")
    try {
        const comments = await Comments.find();
        res.json({ result : comments });
    } catch (err) {
    console.error(err);
    next(err);
    }
});

// 댓글 작성
router.post('/comments', async (req, res) => {
    console.log('/api/comments 연결')
    const { post_id, comment_id, user_name, comment, createdAt } = req.body;
    console.log('0--->', { post_id, comment_id, user_name, comment, createdAt })

    const sendComments = await Comments.create({ post_id, comment_id, user_name, comment, createdAt })

    res.json({result : sendComments}); 
    console.log(sendComments);

});
//
// 댓글 삭제
router.delete("/delete/:comment_id", async (req, res,) => {
    // html ajax --> 내용을 request 함. 
    const { comment_id } = req.body;
    const deleteComments = await Comments.deleteOne({comment_id:comment_id});
  
    res.json({result : deleteComments}); 

  });
  
module.exports = router;