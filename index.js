/*시작점이라고  생각
https://expressjs.com/en/starter/hello-world.html 여기 들어가서 참조해.
*/


const express = require('express') //express 모듈을 가져온다.
const app = express() //function을 이용해서 app을 만들어주고
const port = 3000 // 포트 번호는 3000번
const bodyParser = require('body-parser');
const { User } = require("./models/User");
const cookieParser = require('cookie-parser');
const { auth }  = require('./middleware/auth');
//application/x-www-form-urlencoded
//이런 데이터들을 분석해서 가져올수 있게 하는것
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());
const config = require('./config/key');
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex : true, useFindAndModify:false
}).then(() => console.log('MongoDb connect...'))
.catch(err => console.log(err))

app.get('/', (req, res) => { 
  res.send('Hello World!')
})

app.post('/api/users/register', (req,res) => {
// 회원가입할 때 필요한 정보를 Client측에서 보내온걸 가져오면 그걸 몽고DB에 넣어주자.

const user = new User(req.body) //인스턴스 생성
user.save((err,userInfo) => {
    if(err) return res.json({ success : false, err})
    return res.status(200).json({
        success: true
        })
    }) //몽고 메서드 유저정보 저장
})


app.post('/login', (req,res) => {
    //요청된 이메일을 데이터베이스에 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSuccess : false,
                message : "제공된 이메일에 해당하는 유저가 존재하지 않는다."
            })
        }

        //요청된 이메일이 디비에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
        user.comparePassword(req.body.password , (err,isMatch) =>{
            if(!isMatch) 
            return res.json({loginSuccess : false, message : "비밀번호 틀림."});

            //비밀번호까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //token을 저장한다. 어디에? 쿠키 , 로컬스토리지에 다가
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true, userId : user._id});
                
            })
            

        })
    })
})

app.get('/api/users/auth', auth , (req, res) => {
    //여기까지 미들웨어를 통과했다는 거는 Authentication 이 트루
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role : req.user.role,
        image : req.user.image
    })

})

app.get('/api/users/logout', auth, (req,resl) => {
    User.findOneAndUpdate({_id: req.user._id},
        {token : ""}
        ,(err, user) => {
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        })
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})