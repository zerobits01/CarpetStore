let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');


let UserSchema = mongoose.Schema({
    email : {
        type : String ,
        unique : true ,
        required : true
    } ,

    password : {
        type : String,
        required : true
    } ,

});

var User = mongoose.model(
    "User" ,
    UserSchema);

module.exports = User;

module.exports.register = function(userDoc, cb){
    bcrypt.hash(userDoc.password , 10 , function (err, hash) {
        if(!err){
            userDoc.password = hash;
            userDoc.save(cb);
        }
    });
};

module.exports.getUserByemail =  function(email , cb){
    User.findOne({email : email} , cb);
};

module.exports.authenticate = async function(email , password){
  let user = await User.findOne({email : email});
  if(user){
      let flag = await bcrypt.compare(password , user.password);
      return flag;
  }else{
      return false;
  }
};
