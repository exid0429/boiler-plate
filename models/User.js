const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 50
    },
    email : {
        type : String,
        trim : true,
        unique : 1
    },
    password: {
        type: String,
        minlength : 5
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type: Number,
        default : 0
    },
    image : String,
    token : {
        type : String
    },
    tokenExp : { //유효기간
        type: Number
    }
    
})
//몽구스에서 가져옴
userSchema.pre('save', function (next) {
   
    var user = this; 
    if(user.isModified('password')){
         //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            //plainpassword = user.password
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash;
                next()
            })
        })
    
    } else {
        next()
    }
})
    
userSchema.methods.comparePassword = function(plainpassword, cb) {
    //planinPassword  1234567 암호화된 비밀번호 #$#$32423432
    bcrypt.compare(plainpassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null,isMatch)
    });
};

userSchema.methods.generateToken = function(cb) {
    var user = this;
    
    //jsonwebtoken을 이용해서 token 생성
    var token = jwt.sign(user._id.toHexString() , 'secretToken');
    //user._id + secretToken = token
    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null,user)
    })
}
userSchema.statics.findByToken = function ( token, cb) {
    var user = this;
    //token decode
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰와 디비에 있는거를 일치하는지 확인
        user.findOne({"_id" : decoded, "token" : token}, function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })
    })
}

//스키마를 모델로 감싸줘야함
//저장하기전에 여기에서 뭔가를 하겠다.
const User = mongoose.model('User', userSchema)

module.exports = { User }