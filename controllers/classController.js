const Class = require('../models/classModel');

exports.createClass = async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.status(201).send(newClass);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getClasses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const classes = await Class.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalClasses = await Class.countDocuments();

    res.status(200).send({
      totalClasses,
      totalPages: Math.ceil(totalClasses / limit),
      currentPage: page,
      classes,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).send();
    }
    res.status(200).send(classData);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateClass = async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedClass) {
      return res.status(404).send();
    }
    res.status(200).send(updatedClass);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);
    if (!classData) {
      return res.status(404).send();
    }
    res.status(200).send(classData);
  } catch (error) {
    res.status(500).send(error);
  }
};
