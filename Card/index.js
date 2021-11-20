const { s3 } = require('../s3')
const multerS3 = require('multer-s3')
const multer = require('multer')
require('dotenv').config()
const express = require('express');
const authenticateToken = require('../middleware/authenticate');
const CardSchema = require('./model');
const User = require('../user/model/user');
const DistrictSchema = require('../District/model');
const CardApp = express.Router();


const uploadPost = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'jeevanimg',
        acl:"public-read",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            var newFileName = Date.now() + "-" + file.originalname;
            var fullPath = 'post/' + newFileName;
            cb(null, fullPath); //use Date.now() for unique file keys
        }
    })
});

CardApp.post('/add', authenticateToken, uploadPost.single('image'), async (req, res) => {
    const id = req.user.id;
    console.log(id)
    const { name, phone, father, district, dob, address } = req.body;

    try {
        await CardSchema.create({
            id: `GHCC${Math.floor(100000000 + Math.random() * 900000000)}`,
            name,
            father,
            phone,
            address,
            district,
            dob: JSON.parse(dob),
            created: new Date(),
            updated: new Date(),
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
            created_by: id,
            image: req.file.location
        })
        await User.findOneAndUpdate({ id: id }, {
            $inc: {
                cards_created: 1
            },
            $set: {
                dd: 'gg'
            }
        })
        return res.json({ status: "ok", msg: "Added" })
    } catch (e) {
        console.log(e)
        return res.json({ status: "failed", msg: "Server error" })
    }

})

CardApp.get('/all/:page', authenticateToken, async (req, res) => {

    const page = req.params.page;

    const val = await CardSchema.find({}).limit(50).skip(page * 50).sort({ created: -1 })

    if (!val) {
        return res.json({ status: "failed", msg: "No card present" })
    }

    return res.json({ status: "ok", data: val })
});


CardApp.get('/search/:text', authenticateToken, async (req, res) => {

    const text = req.params.text;

    const val = await CardSchema.find({ id: new RegExp(text, 'i') }).sort({ created: -1 })

    if (!val) {
        return res.json({ status: "failed", msg: "No user present" })
    }

    return res.json({ status: "ok", data: val })
});

CardApp.get('/count', authenticateToken, async (req, res) => {
    try {

        const user = await User.countDocuments({})
        const cards = await CardSchema.countDocuments({})
        const district = await DistrictSchema.countDocuments({})

        return res.json({ status: 'ok', user, cards, district })
    } catch (e) {
        console.log(e)
        return res.json({ status: 'failed', msg: "Server error" })
    }
})

CardApp.get('/delete/:id', authenticateToken, async (req, res) => {
    const id = req.params.id

    try {
        await CardSchema.deleteOne({ id })
        return res.send({ status: "ok", msg: "deleted" })
    } catch (e) {
        console.log(e)
        return res.send({ status: "failed", msg: "Server error" })
    }


})


module.exports = CardApp;