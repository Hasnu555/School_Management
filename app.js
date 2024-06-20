const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const classRoutes = require('./routes/classRoutes');
const courseRoutes = require('./routes/courseRoutes');
const markRoutes = require('./routes/markRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

dotenv.config();

const app = express();

// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(express.json());




connectDB();

app.use('/classes', classRoutes);
app.use('/courses', courseRoutes);
app.use('/marks', markRoutes);
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
