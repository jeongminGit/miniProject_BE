// const AWS = require("aws-sdk");
// require('dotenv').config();
// const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, BUCKET_NAME } = process.env;

// module.exports = (post) => {
//     // const uri = post.image.split("/").slice(-1)
//     // const key = "original/" + decodeURI(uri);
//     const key = "original/";

//     const S3 = new AWS.S3({
//         accessKeyId: S3_ACCESS_KEY_ID,
//         secretAccessKey: S3_SECRET_ACCESS_KEY,
//         region: S3_REGION,
//     });

//     S3.deleteObject(
//         {
//             Bucket: process.env.BUCKET_NAME, // 사용자 버켓 이름
//             Key: key, // 버켓 내 경로
//         },
//         (err, data) => {
//             if (err) {
//                 throw err;
//             }
//             console.log("S3 내 image 삭제완료");
//         }
//     );
// }