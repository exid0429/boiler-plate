/*시작점이라고  생각
https://expressjs.com/en/starter/hello-world.html 여기 들어가서 참조해.
*/


const express = require('express') //express 모듈을 가져온다.
const app = express() //function을 이용해서 app을 만들어주고
const port = 3000 // 포트 번호는 3000번
const bodyParser = require('body-parser');
const { User } = require("./models/User");

//application/x-www-form-urlencoded
//이런 데이터들을 분석해서 가져올수 있게 하는것
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://munyeong:ansdud123@base.slzu7.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex : true, useFindAndModify:false
}).then(() => console.log('MongoDb connect...'))
.catch(err => console.log(err))

app.get('/', (req, res) => { 
  res.send('Hello World!')
})

app.post('/register', (req,res) => {
// 회원가입할 때 필요한 정보를 Client측에서 보내온걸 가져오면 그걸 몽고DB에 넣어주자.

const user = new User(req.body) //인스턴스 생성
user.save((err,userInfo) => {
    if(err) return res.json({ success : false, err})
    return res.status(200).json({
        success: true
        })
    }) //몽고 메서드 유저정보 저장
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})