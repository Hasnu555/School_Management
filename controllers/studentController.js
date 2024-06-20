const Student = require('../models/studentModel');
const Course = require('../models/courseModel');


exports.createStudent = async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).send(newStudent);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getStudents = async (req, res) => {
  try {
    const { page = 1, limit = 1 } = req.query;

    const students = await Student.find()
      .populate('classes courses')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalStudents = await Student.countDocuments();

    res.status(200).send({
      totalStudents,
      totalPages: Math.ceil(totalStudents / limit),
      currentPage: page,
      students,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.getStudentById = async (req, res) => {
  try {
    const studentData = await Student.findById(req.params.id).populate('classes courses');
    if (!studentData) {
      return res.status(404).send();
    }
    res.status(200).send(studentData);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedStudent) {
      return res.status(404).send();
    }
    res.status(200).send(updatedStudent);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const studentData = await Student.findByIdAndDelete(req.params.id);
    if (!studentData) {
      return res.status(404).send();
    }
    res.status(200).send(studentData);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getStudentCourses = async (req, res) => {
  try {
    const studentId = req.params.id;
    const classId = req.params.classId;
    const studentData = await Student.findById(studentId).populate({
      path: 'courses',
      match: { classes: classId }
    });
    if (!studentData) {
      return res.status(404).send();
    }
    res.status(200).send(studentData.courses);
  } catch (error) {
    res.status(500).send(error);
  }
};



exports.addStudentToClass = async (req, res) => {
    try {
      const studentId = req.params.id;
      const classId = req.params.classId;
      
      // Find the student by ID
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).send({ error: 'Student not found' });
      }
  
      // Add the class if it's not already present
      if (!student.classes.includes(classId)) {
        student.classes.push(classId);
      }
  
      
      // Save the updated student
      await student.save();
  
      res.status(200).send(student);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  exports.enrollStudentInClass = async (req, res) => {
    try {
      const studentId = req.params.id;
      const classId = req.params.classId;
  
      // Find the student by ID
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).send({ error: 'Student not found' });
      }
  
      // Add the class if it's not already present
      if (!student.classes.includes(classId)) {
        student.classes.push(classId);
      }
  
      // Find all courses for the specified class
      const courses = await Course.find({ classes: classId });
  
      // Add each course to the student's courses if it's not already present
      courses.forEach(course => {
        if (!student.courses.includes(course._id)) {
          student.courses.push(course._id);
        }
      });
  
      // Save the updated student
      await student.save();
  
      res.status(200).send(student);
    } catch (error) {
      res.status(400).send(error);
    }
  };


  
  exports.enrollStudentInCourse = async (req, res) => {
    try {
      const studentId = req.params.id;
      const classId = req.params.classId;
      const courseId = req.params.courseId;
  
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).send({ error: 'Student not found' });
      }
  
      if (!student.classes.includes(classId)) {
        return res.status(400).send({ error: 'Student not enrolled in the specified class' });
      }
  
      if (!student.courses.includes(courseId)) {
        student.courses.push(courseId);
      }
  
      await student.save();
  
      res.status(200).send(student);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  
