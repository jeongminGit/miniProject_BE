const express = require('express');
const { json } = require("express/lib/response");
const Comments = require('../schemas/comment');
const User = require('../schemas/user')
const Post = require('../schemas/post');
const comment = require('../schemas/comment');
const router = express.Router();

// 댓글 조회
router.get('/posts/:post_id/comments', async (req, res) => {
    const post_id = req.params.post_id
    const comments = await Comments.find({ post_id: post_id })
    console.log(post_id, comments)
    res.json({
        result : 'success',
        comments
    })
});

// 댓글 작성
router.post('/posts/:post_id/comments/', async (req, res) => {
    console.log('/api/comments 연결')
    const post_id = req.params.post_id;
    const { user_id, comment } = req.body;
    // const post = await Post.findOne({ post_id })
    // console.log(post)
    const user = await User.findOne({ user_id })
    // const userId = user.user_id // user_id
    // const postId = post.post_id // 게시글 넘버링(게시글 번호)
    const user_name = user.user_name // user_id(email) => user_name(nickname)
    const createdAt = Date.now()
    console.log( user_id, post_id, user_name )

    // list 내림차순 정렬
    const commentList = await Comments.find().sort({ "comment_id": -1 });
    console.log(commentList)

    // comment_id 부여
    let comment_id = 0;
    if (commentList.length == 0 || commentList === null || commentList == undefined) {
        comment_id = 1;
    } else {
        comment_id = commentList[0].comment_id + 1
    }

    const sendComments = await Comments.create({ user_id, user_name, post_id, comment_id, comment, createdAt })
    res.json({result : sendComments});

});

// 댓글 삭제
router.delete("/posts/:post_id/comments/:comment_id", async (req, res,) => {
    const postId = req.params.post_id;
    const Num_postId = Number(postId)
    const commentId = req.params.comment_id;
    const Num_commentId = Number(commentId)
    const user_id = res.locals.user.user_id
    // const { user_id } = req.body;
    console.log( Num_postId, Num_commentId, "Id: ", user_id )
    
    const thatUser = await Comments.find({ comment_id: Num_commentId })
    console.log(thatUser[0])
    if (user_id !== thatUser[0].user_id || Num_postId !== thatUser[0].post_id) {
        return res.status(400)
        .json({ result: 'fail', 'msg' : '자기 댓글만 삭제 가능!'})
    }

    await Comments.deleteOne({ comment_id:Num_commentId })
    res.json({result: 'success', 'msg': '삭제 완료!'})
});

module.exports = router;