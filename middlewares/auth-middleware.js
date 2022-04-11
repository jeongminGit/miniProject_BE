const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.send({
            ok: false,
            result: 'auth-middleware 사용자 인증 실패. 인증 토큰이 비어있습니다.',
            headers: req.headers,
        });
        return;
    }
    const [tokenType, tokenValue] = authorization.split(' '); // 공백을 기준으로 잘라 배열로 반환.

    // tokenType 값이 'Bearer' 가 아닌 경우 토큰값이 없다고 판별하고 튕겨냄.
    // .. 라고 생각했는데, localStorage를 비우고 난 후에 주소로 접근하면 "Bearer null" 로 들어옴.

    // 프론트단에서 로그인이 필요한 페이지의 경우, headers를 아래와 같이 붙여서 접근함.
    // headers: { authorization: `Bearer ${localStorage.getItem('token')}`, },
    if (tokenType !== 'Bearer') {
        res.send({
            ok: false,
            result: '로그인이 필요한 페이지 입니다.',
        });
        return;
    }
    try {
        const { userId } = jwt.verify(tokenValue, process.env.JWT_SECRET); // 유효한 토큰인지 확인. verify
        // const user = User.findById(userId).exec(); // 이렇게 해서 찾아왔던 user를, 아래 구문과 같이 변경
        /**
         * user 내용 예시
         * { user: { _id: new ObjectId("61f39afc469383be12e78e81"), email: 'test@test.com', nickname: 'mynickname', password: '1234', __v: 0 }}
         */
        User.findOne({ userId: userId })
            .exec()
            .then((user) => {
                res.locals.user = user; // res.locals 를 사용하면 이 미들웨어를 거쳐가는 다른 곳에서도 다 공통적으로 사용할 수 있음.
                next();
            });
    } catch (error) {
        // 토큰이 없거나, 유효하지 않은 토큰인 경우 이쪽으로 접근.
        res.send({
            ok: false,
            result: '로그인이 필요한 페이지 입니다.',
        });
        return;
    }
};