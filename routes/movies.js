const router = require('express').Router();
const Movie = require('../models/Movie');
const verify = require("./verifyToken");

// CREATE MOVIE ROUTE
router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin){
        const newMovie = new Movie(req.body);

        try {
            const savedMovie = await newMovie.save();
            res.status(201).json({
                success: true,
                message: "Movie added successful",
                data: {savedMovie}
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
            message: "You are not allowed!"
        });
    }
    
});

// UPDATE MOVIE ROUTE
router.put("/:id", verify, async (req, res) => {
    if(req.user.isAdmin){
        try {
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {new: true});
            res.status(200).json({
                success: true,
                message: "Movie updated successful",
                data: {updatedMovie}
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
            message: "You are not allowed!"
        });
    }
    
});

// DELETE MOVIE ROUTE
router.delete("/:id", verify, async (req, res) => {
    if(req.user.isAdmin){
        try {
            await Movie.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "Movie deleted successful"
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
            message: "You are not allowed!"
        });
    }
    
});

// GET MOVIE ROUTE
router.get("/find/:id", verify, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Movie gotten successful",
            data: movie
        });
    } catch (error) {
        res.status(403).json({
            success: false,
            message: error
        });
    }
    
});

// GET ALL MOVIES ROUTE
router.get("/", verify, async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json({
            success: true,
            message: "Movies gotten successful",
            data: movies.reverse()
        });
    } catch (error) {
        res.status(403).json({
            success: false,
            message: error
        });
    }
    
});


// GET RANDOM MOVIE ROUTE
router.get("/random", verify, async (req, res) => {
    try {
        const type = req.query.type;
        let movie;
        if(type === "series"){
            movie = await Movie.aggregate([
                { $match: {isSeries: true}, },
                { $sample: {size: 1}, }
            ]);
        }else{
            movie = await Movie.aggregate([
                { $match: {isSeries: false}, },
                { $sample: {size: 1}, }
            ]);
        }
        res.status(200).json({
            success: true,
            message: "Movie gotten successful",
            data: movie
        });
    } catch (error) {
        res.status(403).json({
            success: false,
            message: error
        });
    }
    
});


module.exports = router;