const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user")
const Joi = require("joi")
const cors = require('cors')
const bcrypt = require('bcrypt')
const authMiddleware = require("../middlewares/auth");
const corsOptions = {
    origin: '*',
    // credentials: true
};
const router = express.Router();
router.use(cors(corsOptions));

//  회원 가입 양식
const registerSchema = Joi.object({
    user_id: Joi
        .string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    user_name: Joi
        .string()
        .required()
        .pattern(new RegExp(/^[a-zA-Z0-9가-힣]{2,8}$/)),//영문(대소문자) 한글 숫자 2~8자
    password: Joi
        .string()
        .required()
        .pattern(new RegExp(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,20}$/)),//영문(대소문자) + 최소 1개의 숫자 혹은 특수 문자 8~20자
    passwordConfirm: Joi
        .string()
        .required()
})

//회원가입
router.post("/signup", async (req, res) => {

    try {
        const { user_id, user_name, password, passwordConfirm } = await registerSchema.validateAsync(req.body)


        if (password.includes(user_name)) {
            res.status(400).send({
                errorMessage: "사용자의 이름은 비밀번호에 사용할 수 없습니다."
            })
            return;
        }

        if (password !== passwordConfirm) {
            res.status(400).send({
                errorMessage: '비밀번호가 동일하지 않습니다.',
            })
            return;
        }

        const existId = await User.find({ user_id })
        if (existId.length) {
            res.status(400).send({
                errorMessage: '이미 사용 중인 이메일입니다.'
            })
            return;
        }

        const existUsers = await User.find({ user_name })
        if (existUsers.length) {
            res.status(400).send({
                errorMessage: '이미 사용 중인 이름입니다.'
            })
            return;
        }

        const hashed = await bcrypt.hash(password,10)
        const user = new User({ user_id, user_name, password: hashed })
        await user.save()
        console.log(user)
        res.status(201).send({ result: 'success' })

    } catch (err) {

        let whatError = err.details[0].message;
        console.log(whatError)

        if (whatError.includes('user_id')) {
            res.status(400).send({
                errorMessage: '이메일 형식을 확인해주세요.'
            })
        }
        if (whatError.includes('user_name')) {
            res.status(400).send({
                errorMessage: '이름 형식을 확인해주세요.'
            })
        }
        if (whatError.includes('password')) {
            res.status(400).send({
                errorMessage: '비밀번호 형식을 확인해주세요.'
            })
        }
    }

})


//로그인, 토큰생성
router.post("/login", async (req, res) => {
    const { user_id, password } = req.body
    const user = await User.findOne({ user_id })
    console.log(user)
    var _id = user._id
    var user_name = user.user_name
    console.log(user_id, user_name, password, _id)
    if (!user) {
        res.status(401).send({
            errorMessage: "존재하지 않는 이메일입니다."
        })
        return
    } else {
        const correctPassword = await bcrypt.compareSync(password, user.password)//hash 값과 req값을 비교해서 일치하면 true 출력
        console.log(correctPassword)
        if (correctPassword) {
            const token = jwt.sign({ user_id: user.user_id }, `${process.env.KEY}`);
    res.status(200).send({ token, user_id, user_name, _id })
        } else {
            res.status(400).send({errorMessage: '비밀번호를 확인해주세요.' })
        }
    }
})

// 아이디, 닉네임 중복확인
router.post('/idCheck', async (req, res) => {
    const {user_id, user_name} = req.body;

    const existUsers = await users.find({
        $or: [{user_id}, {user_name}],
    });
    if (existUsers.length) {
        res.send({
            alert: "이메일 또는 아이디를 다시 입력해주세요."
        });
        return;
    }
    
    res.send({
        alert: '사용 가능합니다.'
    });
});

router.get("/checkLogin", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    res.send({
      user_name: user[0].user_name,
      _id : user[0]._id,
    });
  });



module.exports = router;
