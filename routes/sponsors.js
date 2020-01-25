const router=require('express').Router();

const sponsorsController=require('../controllers/sponsors.js')

router.get('/',sponsorsController.getSponsors)

router.post('/add',sponsorsController.addSponsor)

router.post('/delete/:id',sponsorsController.deleteSponsor)

module.exports=router