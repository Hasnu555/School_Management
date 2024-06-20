const Course = require('../models/courseModel');
const Teacher = require('../models/teacherModel');

exports.createCourse = async (req, res) => {
  const session = await Course.startSession();
  session.startTransaction();
  try {
    const newCourse = new Course(req.body);
    await newCourse.save({ session });

    // Update each teacher to include the new course and associated classes
    for (let teacherId of newCourse.teachers) {
      const teacher = await Teacher.findById(teacherId).session(session);
      if (!teacher) {
        throw new Error(`Teacher not found with id: ${teacherId}`);
      }
      teacher.courses.addToSet(newCourse._id);
      teacher.classes.addToSet(...newCourse.classes);
      await teacher.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).send(newCourse);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating course: ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const courses = await Course.find()
      .populate('teachers classes')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCourses = await Course.countDocuments();

    res.status(200).send({
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
      courses,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.getCourseById = async (req, res) => {
  try {
    const courseData = await Course.findById(req.params.id).populate('teachers classes');
    if (!courseData) {
      return res.status(404).send();
    }
    res.status(200).send(courseData);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedCourse) {
      return res.status(404).send();
    }
    res.status(200).send(updatedCourse);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const courseData = await Course.findByIdAndDelete(req.params.id);
    if (!courseData) {
      return res.status(404).send();
    }
    res.status(200).send(courseData);
  } catch (error) {
    res.status(500).send(error);
  }
};
