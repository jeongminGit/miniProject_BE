const express = require("express");
const Post = require("../schemas/image")
const router = express.Router();
const multer = require('multer');

// 입력한 파일이 uploads/ 폴더 내에 저장된다
// var storage = multer.diskStorage({destination : function (req, file, cb) {
//     cb(null, '../image/')
//     },
//     filename : function (req, file, cb){
//         cb(null, Date.now()+'-'+file.uploadFile)
//     }

// });
//     // cb 함수를 통해 전송된 파일 저장 디렉토리 설정
// const upload = multer({storage : storage});



// router.post('/imageUrl', upload.single('uploadFile'), (req, res) => {
//     console.log(req.file);
//     console.log(req.body);
// });

module.exports = router; //router를 모듈로 내보낸다.
