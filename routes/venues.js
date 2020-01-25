const router=require('express').Router();

const venuesController=require('../controllers/venues.js')

router.get('/',venuesController.getVenues)

router.post('/add',venuesController.addVenue)

router.post('/delete/:id',venuesController.deleteVenue)

module.exports=router