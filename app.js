const express = require("express");
const connect = require("./schemas/post");
const postRouter = require("./routes/post"); 
const multerRouter = require("./routes/multer"); 
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
connect();


// MongoDB 연결
const mongoose = require("mongoose");
var db = mongoose
.connect("mongodb+srv://sparta:sparta@cluster0.ktntr.mongodb.net/cluster0?retryWrites=true&w=majority",{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true, //MondDB 6.0 이상에서는 지원 X
        ignoreUndefined: true
    })
    .then(() => console.log('MongoDB 연결완료'))
    .catch(err =>{console.log(err);
});

//request 로그 남기는 미들웨어
const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date());
    next();
};
// body-parser 라이브러리
// app.use(express.urlencoded({extend: true}));
 // static 폴터 가져오기
// app.use(express.static("static"))
app.use(bodyParser.json());
app.use(express.json());

// Middleware
app.use(requestMiddleware);
//api 라우터로 들어왔을때만 goodsRouter를 실행한다. [goodsRouter,..] 처럼 2개도 가능.
app.use("/api", [postRouter, multerRouter]);


// main_List page
app.get("/", async (req, res) => {
    console.log("main_page")    
    bodyParser.json()
    res.sendFile(__dirname + "/test.html");
});


app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!")
});