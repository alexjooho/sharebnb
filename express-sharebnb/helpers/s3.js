require('dotenv').config();
const fs = require('fs');
const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand } = require('@aws-sdk/client-s3');

// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');

const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;

const AWS_BASE_URL = `https://${bucketName}.s3.${region}.amazonaws.com`
// https://ak-sharebnb.s3.us-west-1.amazonaws.com/Champion-List.jpg

const s3 = new S3Client({
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    region
});

// uploads a file to s3
async function uploadImg(Key, Body, ContentType) {

    const buffer = await
        sharp(Body).resize(
            { height: 1000, width: 1000, fit: "contain" }
        ).toBuffer();
    const params = {
        Bucket: bucketName,
        Key,
        Body: buffer,
        ContentType
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);

    // return s3.upload(uploadParams).promise();
}

function getImgUrl(key) {
    // const params = {
    //     Bucket: bucketName,
    //     Key
    // };
    // https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
    // const command = new GetObjectCommand(params);
    // const seconds = 3600;
    // const url = await getSignedUrl(s3, command, { expiresIn: seconds });
    const url = `${AWS_BASE_URL}/${key}`
    
    return url;
}

function deleteImg(fileName) {
    const deleteParams = {
        Bucket: bucketName,
        Key: fileName,
    };

    return s3.send(new DeleteObjectCommand(deleteParams));
}

module.exports = {
    uploadImg,
    getImgUrl,
    deleteImg
};

let obj = {
    "name": "cool condo",
    "address": "123 cool way drive",
    "owner": "testuser",
    "price": 5000000000
}