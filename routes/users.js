const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require("crypto-js");
const verify = require("./verifyToken");

// UPDATE USER ROUTE
router.put("/:id", verify, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {new: true});
            const {password, ...info} = user._doc;
            res.status(200).json({
                success: true,
                message: "Update successful",
                data: {...info}
            });
        } catch (error) {
            res.status(403).json({
                success: false,
                message: error
            });
        }
    }else{
        res.status(403).json({
            success: false,
            message: "You can update only your account!"
        });
    }
    
});

// DELETE USER ROUTE
router.delete("/:id", verify, async (req, res) => {
    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password){
            req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
        }

        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        } catch (error) {
            res.status(403).json({
                success: false,
                message: error
            });
        }
    }else{
        res.status(403).json({
            success: false,
            message: "You can delete only your account!"
        });
    }
    
});

// GET USER ROUTE
router.get("/find/:id", verify, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, ...info} = user._doc;
        res.status(200).json({
            success: true,
            message: "User gotten successfully",
            data: {info}
        });
    } catch (error) {
        res.status(403).json({
            success: false,
            message: error
        });
    }
    
});

// GET ALL USERS ROUTE
router.get("/", verify, async (req, res) => {
    const query = req.query.new;
    if(req.user.isAdmin){
        try {
            const users = query ? await User.find().limit(10) : await User.find();
            res.status(200).json({
                success: true,
                message: "Users gotten successfully",
                data: users
            });
        } catch (error) {
            res.status(403).json({
                success: false,
                message: error
            });
        }
    }else{
        res.status(403).json({
            success: false,
            message: "You are not allowed to see all users!"
        });
    }
    
});

// GET USER STATS ROUTE
router.get("/stats", async (req, res) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear() - 1);

    const monthsArray = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    try {
        const data = await User.aggregate([
            {
                $project:{
                    month: {$month: "$createdAt"}
                }
            },{
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ]);
        res.status(200).json({
            success: false,
            message: "Data gotten successfully!",
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
})

module.exports = router;