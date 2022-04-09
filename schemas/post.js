const mongoose = require("mongoose");


//mongoose 데이터 모델링 -> Schema 객체 사용 -> Document 사용
const postSchema = new mongoose.Schema({
  post_id : {
    type: Number,
    require: true,
    unique: true,
  },
  // user_id : {
  //   type: String,
  //   require: true,
  // },
  user_name : {
    type: String,
    require: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true
  },
  // imageUrl Schema 여부 확인 필요.
//   imageUrl: {
//     type: String,
//   },

});


module.exports = mongoose.model("post", postSchema);