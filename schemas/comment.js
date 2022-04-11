const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    post_id: {
        type: Number,
        require: true,
        // unique: true,
    },
    comment_id: {
        type: Number,
        required: true,
        // unique: true,
    },
    // postId: {
    //     type: Number,
    //     required: true,
    //     unique: true,
    // },
    // commentId: {
    //     type: Number,
    //     required: true,
    //     unique: true,
    // },
    user_name: {
        type: String,
        require: true,
    },
    // title: {
    //     type: String,
    //     required: true,
    // },
    // content: {
    //     type: String,
    //     required: true,
    // },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Number,
        required: true,
    },
    // createdAt: {
    //     type: Date,
    //     default:  Date.now(),
    //     required: true,
    // },
},
    // { timestamps: true } // createdAt, updatedAt 으로 Date형 객체 입력
);
//
// commentsSchema.virtual('commentId').get(function () {
//     return this._id.toHexString();
// });
// commentsSchema.set('toJSON', {
//     virtuals: true,
// });

const Comments = mongoose.model('Comments', commentsSchema);
module.exports = Comments;