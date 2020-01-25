const router=require('express').Router();

const mainController=require('../controllers/main')


router.get('/',mainController.displayMain)

router.get('/queued',mainController.GET_queuedData);

router.post('/trigger',mainController.trigger)

module.exports=router;