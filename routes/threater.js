var express = require('express');
var router = express.Router();
const threaterlist = require('../models/threaters');
const auth = require('../middleware/authMiddleware')


router.get('/', function(req, res, next) {
  res.send('respond with a resource of kathirvel');
});


router.get('/threaterlist', auth , async function(req, res, next) {
    console.log(req.body,"ioio");
    
   const movies = await threaterlist.find() 
   res.json(movies)

    });

    

router.post('/threaterlist', async function(req, res, next) {
    console.log("lifgfgf");
    
   
    try{
       
       
        const threaterlistsinfo = new threaterlist({
            threater_name: req.body.threater_name,
            threater_location: req.body.threater_location,
            phone_no: req.body.phone_no
        });
    
        console.log(threaterlistsinfo,'4');
    
         await threaterlistsinfo.save();
    
         console.log( await threaterlistsinfo.save(),"5");
         
       
       
      return  res.json({message:'respond with a resource of kathirvel'});
     
    }
    catch (error){
    console.log(error);
    
    return res.status(500).json({ message:'internal server error '});
    
    }
    });
    
router.delete('/threaterlist/:id', async function(req, res) {
  try {
    const { id } = req.params;

    const deleted = await threaterlist.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Theater not found' });
    }

    res.status(200).json({ message: 'Theater deleted successfully' });
  } catch (error) {
    console.error('Error deleting theater:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




module.exports = router;
