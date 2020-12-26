const { User } = require('../models/User');

let auth = (req, res, next) => {
    //인증처리를 하는곳

    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    //토큰을 복호화한후 유저를 찾는다.
    User.findByToken(token, (err,user) =>{
        if(err) throw err;
        if(!user) return require.json({isAuth: false, error:true})

        req.token = token
        req.user = user;
        next(); //미들웨어에서 계속 갈수 있게
    })
    //유저가 있으면 인증 ㅇ

    //유저가 없으면 인증 ㄴㄴ

}

module.exports = {
    auth
};