const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/key").kes;
// router.get("/test", (req, res) => {
//     res.json({ msg: "xiao王" })
// });
router.post("/register", (req, res) => {
    // console.log(req.body)
    //查询数据库中是否有邮箱
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                console.log(user)
                return res.status(400).json({ email: '邮箱已经被注册' })
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    identity: req.body.identity,
                    password: req.body.password,
                    avatar,


                })
                console.log("newUser", newUser)

                bcrypt.genSalt(10, (err, salt) => {
                    console.log("salt", salt)

                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err = console.log(err));
                        // Store hash in your password DB.
                    });
                });
            }
        })
})
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //查询数据库
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status('400').json({ email: '用户不存在' })
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = {
                            id: user.id,
                            name: user.name,
                            identity: user.identity,
                        };
                        // jwt.sign("规则","加密名字","过期时间",'箭头函数')
                        jwt.sign(rule, keys, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success: "true",
                                token: "Bearer " + token
                            })
                        })

                        // res.json({ msg: "sucess" })
                    } else {
                        res.status(400).json({ password: "密码错误！" })
                    }
                });
        })
})
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})
module.exports = router;