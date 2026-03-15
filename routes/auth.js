var express = require("express");
var router = express.Router();
let userController = require('../controllers/users')
let { RegisterValidator, validatedResult } = require('../utils/validator')
let {CheckLogin} = require('../utils/authHandler')
const bcrypt = require('bcrypt');
let { ChangepasswordValidator } = require('../utils/validator');
//login
router.post('/login',async function (req, res, next) {
    let { username, password } = req.body;
    let result = await userController.QueryLogin(username,password);
    if(!result){
        res.status(404).send("thong tin dang nhap khong dung")
    }else{
        res.send(result)
    }
    
})
router.post('/register', RegisterValidator, validatedResult, async function (req, res, next) {
    let { username, password, email } = req.body;
    let newUser = await userController.CreateAnUser(
        username, password, email, '69b6231b3de61addb401ea26'
    )
    res.send(newUser)
})
router.get('/me',CheckLogin,function(req,res,next){
    res.send(req.user)
})

//register
//changepassword
//me
//forgotpassword
//permission



router.post('/changepassword',
    CheckLogin,
    ChangepasswordValidator,
    validatedResult,
    async function (req, res, next) {
        const { oldpassword, newpassword } = req.body;
        const userArr = req.user;
        const user = Array.isArray(userArr) ? userArr[0] : userArr;
        if (!user || !user.password) {
            return res.status(400).send({ message: 'user khong hop le' });
        }
        if (!bcrypt.compareSync(oldpassword, user.password)) {
            return res.status(400).send({ message: 'oldpassword khong dung' });
        }
        try {
            let salt = bcrypt.genSaltSync(10);
            let hashed = bcrypt.hashSync(newpassword, salt);
            await userController.UpdatePassword(user._id, hashed);
            res.send({ message: 'doi mat khau thanh cong' });
        } catch (err) {
            res.status(500).send({ message: 'Loi server' });
        }
    }
);
module.exports = router;