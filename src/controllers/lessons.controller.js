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
    try {
        const lessons = await service.getLessonByCourse(courseId);
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
        const lesson = await service.getLessonById(lessonId);
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
    const { title, content, courseId } = req.body;
    try {
        const newLesson = await service.createLesson({ title, content, courseId });
        res.status(201).json(newLesson);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lesson', error });
    }
}
const updateLesson = async (req, res) => {
    const { lessonId } = req.params;
    const { title, content } = req.body;
    try {
        const updatedLesson = await service.updateLesson(lessonId, { title, content });
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
        const deletedLesson = await service.deleteLesson(lessonId);
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

