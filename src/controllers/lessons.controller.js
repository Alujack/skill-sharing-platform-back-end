const service = require('../services/lesson.service');

const getAllLessons = async (req, res) => {
    try {
        const lessons = await service.getAllLessons();
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lessons', error });
    }
}
const getLessonByCourse = async (req, res) => {

    const { courseId } = req.params;
    console.log(courseId);
    try {
        const lessons = await service.getLessonByCourse(Number(courseId));
        if (lessons.length === 0) {
            return res.status(404).json({ message: 'No lessons found for this course' });
        }
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lessons for course', error });
    }
}
const getLessonById = async (req, res) => {
    const { lessonId } = req.params;
    try {
        const lesson = await service.getLessonById(Number(lessonId));
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.status(200).json(lesson);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching lesson', error });
    }
}
const createLesson = async (req, res) => {
    const { title, videoUrl, courseId } = req.body;
    console.log(req.body)
    
    // Add validation
    if (!title || !videoUrl || !courseId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const courseIdnew = Number(courseId);
    
    // Check if courseId is valid
    if (isNaN(courseIdnew)) {
        return res.status(400).json({ message: 'Invalid courseId' });
    }
    
    try {
        const newLesson = await service.createLesson(req.body);
        res.status(201).json(newLesson);
    } catch (error) {
        console.error('Create lesson error:', error); // Add this for debugging
        res.status(500).json({ message: 'Error creating lesson', error: error.message });
    }
}
const updateLesson = async (req, res) => {
    const { lessonId } = req.params;
    const { title, content } = req.body;
    try {
        const updatedLesson = await service.updateLesson(Number(lessonId), { title, content });
        if (!updatedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.status(200).json(updatedLesson);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lesson', error });
    }
}
const deleteLesson = async (req, res) => {
    const { lessonId } = req.params;
    try {
        const deletedLesson = await service.deleteLesson(Number(lessonId));
        if (!deletedLesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lesson', error });
    }
}
module.exports = {
    getAllLessons,
    getLessonByCourse,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson
};

