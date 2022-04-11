// require('dotenv').config();
const express = require('express');
const connect = require('./schemas/comment');
const app = express();
const commentsRouter = require('./routes/comment');
const bodyParser = require('body-parser');
// const postRouter = require('./routes/post');
// const userRouter = require('./routes/user');
const port = 3000;
connect();

const mongoose = require("mongoose");
var db = mongoose
.connect("mongodb+srv://test:sparta@cluster0.kjgca.mongodb.net/cluster0?retryWrites=true&w=majority",{
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

//body 읽기
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());


// app.use(cors());

// Middleware
app.use(requestMiddleware);
app.use('/api', [commentsRouter])


// 여러 라우터를 사용할 경우 배열 형태로 배치
// app.use(
//     '/api',
//     [commentsRouter]
//     // [postRouter, commentsRouter, userRouter] /* [goodRouter,userRouter] 이런식으로 쓸수도*/
// );

app.get('/', async (req, res) => {
    //await user.create({ userId: 'test', password: 'test', nickname: 'test' });
    // res.send('Hello World');
    console.log("main_page")   
    bodyParser.json()
    res.sendFile(__dirname + "/test.html");
});


app.listen(port, () => {
    console.log('running on port', port);
});