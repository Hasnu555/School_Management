const Marks = require('../models/markModel');
const Student = require('../models/studentModel');
const Course = require('../models/courseModel');
const Class = require('../models/classModel');
const Teacher = require('../models/teacherModel');

exports.createMark = async (req, res) => {
  try {
    const newMark = new Marks(req.body);
    await newMark.save();
    res.status(201).send(newMark);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getMarks = async (req, res) => {
  try {
    const marks = await Marks.find().populate('student course class teacher');
    res.status(200).send(marks);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getMarkById = async (req, res) => {
  try {
    const markData = await Marks.findById(req.params.id).populate('student course class teacher');
    if (!markData) {
      return res.status(404).send();
    }
    res.status(200).send(markData);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.addMark = async (req, res) => {
  try {
    const { studentId, courseId, classId, teacherId, marks } = req.body;

    // Validate existence of student, course, class, and teacher
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send({ error: 'Student not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ error: 'Course not found' });
    }

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).send({ error: 'Class not found' });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).send({ error: 'Teacher not found' });
    }

    // Check if the student is enrolled in the class
    if (!student.classes.includes(classId)) {
      return res.status(400).send({ error: 'Student not enrolled in the specified class' });
    }

    // Check if the student is enrolled in the course
    if (!student.courses.includes(courseId)) {
      return res.status(400).send({ error: 'Student not enrolled in the specified course' });
    }

    // Create new marks entry
    const newMark = new Marks({
      student: studentId,
      course: courseId,
      class: classId,
      teacher: teacherId,
      marks
    });

    await newMark.save();

    res.status(201).send(newMark);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.addMultipleMarks = async (req, res) => {
  try {
    const { studentId, classId, marks } = req.body;

    // Validate existence of student and class
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send({ error: 'Student not found' });
    }

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).send({ error: 'Class not found' });
    }

    // Check if the student is enrolled in the class
    if (!student.classes.includes(classId)) {
      return res.status(400).send({ error: 'Student not enrolled in the specified class' });
    }

    const newMarks = [];

    for (const markEntry of marks) {
      const { courseId, teacherId, marks } = markEntry;

      // Validate existence of course and teacher
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).send({ error: `Course not found for courseId ${courseId}` });
      }

      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).send({ error: `Teacher not found for teacherId ${teacherId}` });
      }

      // Check if the student is enrolled in the course
      if (!student.courses.includes(courseId)) {
        return res.status(400).send({ error: `Student not enrolled in the specified course ${courseId}` });
      }

      // Create new marks entry
      const newMark = new Marks({
        student: studentId,
        course: courseId,
        class: classId,
        teacher: teacherId,
        marks
      });

      await newMark.save();
      newMarks.push(newMark);
    }

    res.status(201).send(newMarks);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getMarksByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const marks = await Marks.find({ course: courseId }).populate('student course class teacher');
    if (!marks.length) {
      return res.status(404).send({ error: 'No marks found for the specified course' });
    }

    res.status(200).send(marks);
  } catch (error) {
    res.status(500).send(error);
  }
};

