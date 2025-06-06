const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const ApiError = require('./utils/apiError');
const config = require('./config');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const instructorRoutes = require('./routes/instructor.routes');
const studentRoutes = require('./routes/student.routes');
const adminRoutes = require('./routes/admin.routes');
const userRoutes = require('./routes/user.routes')
const adminDashboardRoutes = require('./routes/admin.dashboard.route')



const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3001'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/courses', courseRoutes);
app.use('/v1/enrollments', enrollmentRoutes);
app.use('/v1/instructor', instructorRoutes);
app.use('/v1/student', studentRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/dashboard',adminDashboardRoutes);


// 404 handler
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Error handling
app.use(errorConverter);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

module.exports = app;