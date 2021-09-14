const router = require('express').Router();
const List = require('../models/List');
const verify = require("./verifyToken");

// CREATE LIST ROUTE
router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin){
        const newList = new List(req.body);

        try {
            const savedList = await newList.save();
            res.status(201).json({
                success: true,
                message: "List added successful",
                data: {savedList}
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }
    }else{
        res.status(403).json({
            success: false,
            message: "You are not allowed!"
        });
    }
    
});

// UPDATE LIST ROUTE
router.put("/:id", verify, async (req, res) => {
    if(req.user.isAdmin){
        try {
            const updatedList = await List.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {new: true});
            res.status(200).json({
                success: true,
                message: "List updated successful",
                data: {updatedList}
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }
    }else{
        res.status(403).json({
            success: false,
            message: "You are not allowed!"
        });
    }
    
});

// DELETE LIST ROUTE
router.delete("/:id", verify, async (req, res) => {
    if(req.user.isAdmin){
        try {
            await List.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "List deleted successful"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }
    }else{
        res.status(403).json({
            success: false,
            message: "You are not allowed!"
        });
    }
    
});

// GET LIST ROUTE
router.get("/:id", verify, async (req, res) => {
    try {
        const list = await List.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: "List gotten successful",
            data: list
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
    
});

// GET ALL LISTS ROUTE
router.get("/", verify, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    try {
        if(typeQuery){
            if(genreQuery){
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery, genre: genreQuery } },
                ]);
            }else{
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery } },
                ]);
            }
        }else{
            list = await List.aggregate([{ $sample: { size: 10 } }]);
        }
        res.status(200).json({
            success: true,
            message: "Lists gotten successful",
            data: list
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
    
});


module.exports = router;