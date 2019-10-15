const express = require("express");
const router = express.Router();
const profile = require("../../models/profile");
const passport = require("passport")
const keys = require("../../config/key").kes;
/**
 * @router GET api/profile/test
 */
router.get("/test", (req, res) => {
    res.json({ msg: "xiao王八" })
});
/**
 * @router GET api/profile/add
 */
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
    const profileFields = {};
    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describee;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;
    new profile(profileFields).save().then(profile => {
        res.json(profile)
    })
})

/**
 * @router GET api/profile
 */
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.find().then(profile => {
        if (!profile) {
            return res.json({ msg: '暂无数据信息' })
        };
        res.json(profile)
    }).catch(err => {
        console.log(err)
    })
});
/**
 * @router GET api/profile 
 * 查询一个接口
 */
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ _id: req.params.id }).then(profile => {
        if (!profile) {
            return res.json({ msg: '暂无数据信息' })
        };
        res.json(profile)
    }).catch(err => {
        console.log(err)
    })
});
/**
 * @router GET api/profile/edit
 */
router.post("/edit/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    const profileFields = {};
    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describee;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expend) profileFields.expend = req.body.expend;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;
    Profile.findOneAndUpdate({ _id: req.params.id }, { $set: profileFields }, { new: true }).then(profile => {
        res.json(profile)
    })
});
/**
 * @router GET api/profile 
 * 删除一个数据
 */
router.delete("/delete/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOneAndRemove({ _id: req.params.id }).then(profile => { profile.save().then(profile => res.json(profile)) })
        .catch(err => res.status(400).json("删除失败"));
})

module.exports = router;