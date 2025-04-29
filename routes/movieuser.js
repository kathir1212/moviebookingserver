var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const  MovieUser  = require("../models/movieusers");
const jwt = require("jsonwebtoken")
const axios = require('axios')
const movieapi = require('../models/movielist');
const Showtime = require('../models/showtime');
const verifyAdmin = require('../middleware/verifyAdmin');
const auth = require('../middleware/authMiddleware');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource of kathirvel');
});



    router.get('/register', async (req, res) => {
      try {
          const register = await MovieUser.find();
          res.json(register);
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
  });

  router.get("/admin/users", verifyAdmin, async (req, res) => {
    const users = await MovieUser.find();
    res.json(users);
  });

  router.post('/register', async function(req, res, next) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
  
      req.body.password = hash;
  
      const movieuser = new MovieUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role || "user" // default to user if not passed
      });
  
      await movieuser.save();
  
      return res.json({ message: 'User registered successfully' });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  

  

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const userLogin = await MovieUser.findOne({ email });
      if (!userLogin) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
  
      const isValid = bcrypt.compareSync(password, userLogin.password);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
  
      const token = jwt.sign({ id: userLogin._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      return res.json({
        message: "Login successful",
        token: token,
        id:userLogin._id,
        role: userLogin.role,
        name: userLogin.name,
        email: userLogin.email,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  


// router.get("/movies/:title", async (req, res) => {
//   console.log("list");
  
//     try {
//         const { title } = req.params;
//         const response = await axios.get(`https://www.omdbapi.com/?apikey=1ea9b292&s=${title}&page=1`);
//         if (!response.data.Search) {
//           return res.status(404).json({ message: "No movies found" });
//       }
//         const movielist = await  movieapi.insertMany(response.data.Search);
        
//         res.json({message:"movies saved successfuly", data : movielist});
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching movie details" });
//     }
// });




router.get("/movies/:title" , async (req, res) => {
  console.log("list");

  try {
    const { title } = req.params;
    const response = await axios.get(`https://www.omdbapi.com/?apikey=1ea9b292&s=${title}&page=1`);

    if (!response.data.Search) {
      return res.status(404).json({ message: "No movies found" });
    }

    const savedMovies = [];

    for (const movie of response.data.Search) {
      const savedMovie = await movieapi.findOneAndUpdate(
        { imdbID: movie.imdbID }, // Match by imdbID
        { $set: movie },           // Update fields
        { upsert: true, new: true } // Insert if not exists
      );
      savedMovies.push(savedMovie);
    }

    res.json({ message: "Movies saved successfully", data: savedMovies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching movie details" });
  }
});



router.get("/movies/:title/:id", async (req, res) => {
  console.log("list");
  
    try {
        const { title } = req.params;
        const {id} = req.params.id;
        const response = await axios.get(`https://www.omdbapi.com/?apikey=1ea9b292&s=${title}&page=1/${id}`);
        if (!response.data.Search) {
          return res.status(404).json({ message: "No movies found" });
      }
        const movielist = await  movieapi.find();
        
        res.json({message:"movies saved successfuly", data : movielist});
    } catch (error) {
        res.status(500).json({ message: "Error fetching movie details" });
    }
});







module.exports = router;
