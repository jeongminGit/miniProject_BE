const express = require('express');

// schemas
const schemasPost = require("./schemas/post");
const connect = require('./schemas/comment');

//routes
const postRouter = require("./routes/post"); 
const commentsRouter = require('./routes/comment');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 3000;
connect();
schemasPost();

const userRouter = require('./routes/user');

//디비 설정
mongoose.connect('mongodb://localhost/mydb', {});


const app = express();
const router = express.Router();
app.use(bodyParser.json());
app.use(express.json());
app.use('/', express.urlencoded({extended: false}), router); // API 요청에서 받은 body 값을 파싱(해석)하는 역할을 수행하는 것이 bodyParser

// post middleware
const requestMiddleware = (req, res, next) => {
    console.log("Request URL:", req.originalUrl, " - ", new Date()); //request 로그 남기는 미들웨어
    next();
};
app.use(requestMiddleware);
app.use("/api", [postRouter, commentsRouter]);
app.use('/user', userRouter);


const corsOptions = {
    origin: '*',
    // credentials: true
};

app.get('/', async (req, res) => {
    console.log("main_page")   
    bodyParser.json()
    res.sendFile(__dirname + "/test.html");
});


app.use(cors(corsOptions));

app.listen(3000, () => {
    console.log( new Date().toLocaleString() , '서버가 3000포트로 요청을 받을 준비가 됐어요');
});

