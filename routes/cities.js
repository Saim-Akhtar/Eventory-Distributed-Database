const router=require('express').Router();

const cityController=require('../controllers/cities.js')

router.get('/',cityController.getCities)

router.post('/add',cityController.addCity)

router.post('/delete/:id',cityController.deleteCity)

module.exports=router