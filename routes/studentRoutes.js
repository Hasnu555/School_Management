const express = require('express');
const studentController = require('../controllers/studentController');
const router = express.Router();

router.post('/', studentController.createStudent);
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

router.get('/:id/classes/:classId/courses', studentController.getStudentCourses);
router.post('/:id/classes/:classId/', studentController.addStudentToClass);

router.post('/:id/classes/:classId/enroll', studentController.enrollStudentInClass);

router.post('/:id/classes/:classId/courses/:courseId/enroll', studentController.enrollStudentInCourse);


module.exports = router;
