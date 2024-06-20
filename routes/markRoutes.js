const express = require('express');
const markController = require('../controllers/markController');
const router = express.Router();

router.post('/', markController.createMark);
router.get('/', markController.getMarks);
router.get('/:id', markController.getMarkById);
router.post('/add', markController.addMark);
router.post('/add-multiple', markController.addMultipleMarks);
router.get('/course/:courseId', markController.getMarksByCourse);


module.exports = router;
