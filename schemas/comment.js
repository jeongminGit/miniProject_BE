const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    user_name: {
        type: String,
        required: true,
    },
    post_id: {
        type: Number,
        required: true,
    },
    comment_id: {
        type: Number,
        required: true,
        unique: true,
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
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

module.exports = mongoose.model('Comments', commentsSchema);
