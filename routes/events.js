const router=require('express').Router();

const eventController=require('../controllers/events')

router.get('/',eventController.getEvents)

router.get('/:id',eventController.getEvent)

router.get('/add/sync',eventController.GET_addEvent_sync)

router.post('/add/sync',eventController.POST_addEvent_sync)

router.get('/add/async',eventController.GET_addEvent_async)

router.post('/add/async',eventController.POST_addEvent_async)

router.get('/add/user1',eventController.addData_user1)

router.get('/add/user2',eventController.addData_user2)

router.post('/delete/:id',eventController.deleteEvent)

router.post('/update/:id',eventController.updateEvent)

module.exports=router