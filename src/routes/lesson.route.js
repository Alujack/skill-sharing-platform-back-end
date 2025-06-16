const express = require('express');
const router = express.Router();
const {getAllLessons, getLessonbyCourse }= require('../controllers/lessons.controller');

router.get('/',getAllLessons );
// router.post('/', login);
// router.post('/logout', logout);
// router.get('/me', auth(), getCurrentUser);
module.exports = router;