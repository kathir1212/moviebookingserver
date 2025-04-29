var express = require('express');
var router = express.Router();
var movielist = require('../models/movielist')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource of kathirvel');
});


router.get("/movies/:title", async (req, res) => {
    console.log("list");
    
      try {
          const { title } = req.params;
          const response = await axios.get(`https://www.omdbapi.com/?apikey=1ea9b292&s=${title}&page=1`);
          res.json(response.data);
      } catch (error) {
          res.status(500).json({ message: "Error fetching movie details" });
      }
  });

module.exports = router;
