const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const userRouter = require('./routes/user');


mongoose.connect('mongodb://localhost/mydb', {});

 

const app = express();
const router = express.Router();

app.use(express.json());
app.use('/', express.urlencoded({extended: false}), router); // API 요청에서 받은 body 값을 파싱(해석)하는 역할을 수행하는 것이 bodyParser
app.use('/user', userRouter);


const corsOptions = {
    origin: '*',
    // credentials: true
};

app.use(cors(corsOptions));

app.listen(3000, () => {
    console.log( new Date().toLocaleString() , '서버가 3000포트로 요청을 받을 준비가 됐어요');
});