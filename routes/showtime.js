const express = require('express');
const router = express.Router();
const Showtime = require('../models/showtime');
const { populate } = require('../models/threaters');
const auth = require('../middleware/authMiddleware')


router.get('/find', async (req, res) => {
    const { movieId, theater, date, time } = req.query;
  
    try {
      const parsedDate = new Date(date);
  
      // Fetch all showtimes for the movie, theater, and date
      const showtimes = await Showtime.find({
        movie: movieId,
        date: parsedDate
      })
        .populate('movie', 'Title Poster')
        .populate('threater', 'threater_name');
  
      // Filter based on theater name and exact time from array
      const matchedShow = showtimes.find(show => 
        show.threater?.threater_name === theater &&
        show.time.includes(time)
      );
  
      if (!matchedShow) {
        return res.status(404).json({ message: 'No matching showtime found' });
      }
  
      res.json(matchedShow);
    } catch (error) {
      console.error('Error fetching showtime:', error);
      res.status(500).json({ error: 'Server Error' });
    }
  });
  

router.get('/grouped-showtimes',auth, async (req, res) => {
  try {
    const showtimes = await Showtime.find()
      .populate('movie', 'Title Poster')
      .populate('threater', 'threater_name'); 

    const grouped = {};

    showtimes.forEach(show => {
      const movieTitle = show.movie.Title;

      if (!grouped[movieTitle]) {
        grouped[movieTitle] = {
          _id: show.movie._id, 
          Title: movieTitle,
          Poster: show.movie.Poster,
          shows: []
        };
      }

      grouped[movieTitle].shows.push({
        _id: show._id, 
        theater: show.threater.threater_name, 
        date: show.date,
        time: show.time,
        seatsoccupied: show.seatsoccupied,
        ticketPrice: show.ticketPrice
      });
    });

    const groupedArray = Object.values(grouped);
    res.json(groupedArray);
  } catch (error) {
    console.error('Error fetching grouped showtimes:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


router.delete('/show/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedShowtime = await Showtime.findByIdAndDelete(id);

    if (!deletedShowtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.json({ message: 'Showtime deleted successfully', data: deletedShowtime });
  } catch (error) {
    console.error('Error deleting showtime:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});




// router.get('/grouped-showtimes/:movieId', async (req, res) => {
//   const { movieId } = req.params;

//   try {
//     const showtimes = await Showtime.find({ movie: movieId })
//       .populate('movie', 'Title Poster')
//       .populate('threater', 'threater_name'); // ✅ Check for correct field name

//     const grouped = {};

//     showtimes.forEach(show => {
//       const movieTitle = show.movie.Title;

//       if (!grouped[movieTitle]) {
//         grouped[movieTitle] = {
//           _id: show.movie._id,
//           Title: movieTitle,
//           Poster: show.movie.Poster,
//           shows: []
//         };
//       }

//       grouped[movieTitle].shows.push({
//         _id: show._id,
//         theater: show.threater.threater_name,
//         date: show.date,
//         time: show.time,
//         seatsoccupied: show.seatsoccupied,
//         ticketPrice: show.ticketPrice
//       });
//     });

//     const groupedArray = Object.values(grouped);
//     console.log(JSON.stringify(groupedArray, null, 2));
    
//     res.json(groupedArray);
//   } catch (error) {
//     console.error('Error fetching grouped showtimes by movieId:', error);
//     res.status(500).json({ error: 'Server Error' });
//   }
// });

router.get('/grouped-showtimes/:movieId', async (req, res) => {
  const { movieId } = req.params; // Get movieId from URL parameter

  try {
    // Fetch all showtimes for the given movieId
    const showtimes = await Showtime.find({ movie: movieId })
      .populate('movie', 'Title Poster') // Populate movie details (Title and Poster)
      .populate('threater', 'threater_name'); // Populate theater details (threater_name)

    if (!showtimes || showtimes.length === 0) {
      return res.status(404).json({ message: 'No showtimes found for this movie' });
    }

    // Group showtimes by movie title
    const grouped = {};

    showtimes.forEach(show => {
      const movieTitle = show.movie.Title;

      // Initialize grouping if not already done
      if (!grouped[movieTitle]) {
        grouped[movieTitle] = {
          _id: show.movie._id,
          Title: movieTitle,
          Poster: show.movie.Poster,
          shows: []
        };
      }

      // Push showtime details into the 'shows' array
      grouped[movieTitle].shows.push({
        _id: show._id,
        theater: show.threater.threater_name,
        date: show.date,
        time: show.time,
        seatsoccupied: show.seatsoccupied,
        ticketPrice: show.ticketPrice
      });
    });

    // Convert the grouped object into an array
    const groupedArray = Object.values(grouped);

    // Respond with the grouped movie showtimes
    res.json(groupedArray);
  } catch (error) {
    console.error('Error fetching grouped showtimes:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});





// ✅ 3. GET ALL SHOWTIMES
router.get('/', async (req, res) => {
  try {
    const showtimes = await Showtime.find()
      .populate('movie')
      .populate('threater');
    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/moviebythreater', async(req,res)=>{
  try{
    console.log(req.body.threater,"threater");
    
    const showtimes = await Showtime.find({threater : req.body.threater}).populate('movie')
    .populate('threater')
    .sort({
      createAt : -1,
    })
  return res.json( {message:"moviebythreater successful",
      data :showtimes});
  }
  catch(err){
    res.status(500).json({ message: err.message });

  }
})

// ✅ 4. GET SHOWTIME BY ID
router.get('/:id', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate('movie')
      .populate('threater');

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    res.json(showtime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// ✅ 6. GET PARTICULAR SHOWTIME FOR A MOVIE

  

// ✅ 5. CREATE NEW SHOWTIME
router.post('/show', async (req, res) => {
  try {
    const newShowtime = new Showtime({
      movie: req.body.movie,
      threater: req.body.threater,
      date: req.body.date,
      time: req.body.time,
      seatsoccupied: req.body.seatsoccupied,
      ticketPrice: req.body.ticketPrice
    });

    const savedShowtime = await newShowtime.save();
    res.status(201).json(savedShowtime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/show/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedShowtime = await Showtime.findByIdAndDelete(id);

    if (!deletedShowtime) {
      return res.status(404).json({ message: "Showtime not found with the given ID" });
    }

    res.json({ message: "Showtime deleted successfully", data: deletedShowtime });
  } catch (err) {
    console.error("Error deleting showtime:", err);
    res.status(500).json({ message: "Failed to delete showtime" });
  }
});


module.exports = router;
