const Teacher = require('../models/teacherModel');

exports.createTeacher = async (req, res) => {
  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res.status(201).send(newTeacher);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 1 } = req.query;

    const teachers = await Teacher.find()
      .populate('classes courses')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalTeachers = await Teacher.countDocuments();

    res.status(200).send({
      totalTeachers,
      totalPages: Math.ceil(totalTeachers / limit),
      currentPage: page,
      teachers,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    const teacherData = await Teacher.findById(req.params.id).populate('classes courses');
    if (!teacherData) {
      return res.status(404).send();
    }
    res.status(200).send(teacherData);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedTeacher) {
      return res.status(404).send();
    }
    res.status(200).send(updatedTeacher);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacherData = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacherData) {
      return res.status(404).send();
    }
    res.status(200).send(teacherData);
  } catch (error) {
    res.status(500).send(error);
  }
};
