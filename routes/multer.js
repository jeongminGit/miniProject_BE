const express = require("express");
const router = express.Router();
const multer = require('multer');

var upload = multer({dest: '/uploads/'});


router.post('/uploads/', (req, res) => {
    res.send('Uploaded');
});
