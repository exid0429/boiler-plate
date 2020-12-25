/*시작점이라고  생각
https://expressjs.com/en/starter/hello-world.html 여기 들어가서 참조해.
*/


const express = require('express') //express 모듈을 가져온다.
const app = express() //function을 이용해서 app을 만들어주고
const port = 3000 // 포트 번호는 3000번

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://munyeong:ansdud123@base.slzu7.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex : true, useFindAndModify:false
}).then(() => console.log('MongoDb connect...'))
.catch(err => console.log(err))

app.get('/', (req, res) => { 
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})