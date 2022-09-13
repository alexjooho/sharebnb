"use strict";

/** Routes for properties. */

const express = require("express");
const router = new express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

/** POST /properties */

router.post("/properties/image", upload.single("image"), function (req, res, next) {
    const file = req.file;
    console.log(file)
    // has filename, path, destination, etc
    
    // const description = req.body.description;
})