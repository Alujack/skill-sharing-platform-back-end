const lessonService = require('../services/lesson.service');
const path = require('path');
const fs = require('fs');
// Get all lessons
const getAllLessons = async (req, res) => {
    try {
        const lessons = await lessonService.getAllLessons();
        res.status(200).json({ success: true, data: lessons });
    } catch (error) {
        console.error('[Lesson Controller] getAllLessons error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching lessons'
        });
    }
};

// Get lessons by course ID
const getLessonByCourse = async (req, res) => {
    const { courseId } = req.params;

    if (!courseId || isNaN(courseId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid course ID format'
        });
    }

    try {
        const lessons = await lessonService.getLessonByCourse(Number(courseId));
        res.status(200).json({
            success: true,
            data: lessons,
            count: lessons.length
        });
    } catch (error) {
        console.error(`[Lesson Controller] getLessonByCourse error (courseId: ${courseId}):`, error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching course lessons'
        });
    }
};

// Get single lesson by ID
const getLessonById = async (req, res) => {
    const { lessonId } = req.params;

    if (!lessonId || isNaN(lessonId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid lesson ID format'
        });
    }

    try {
        const lesson = await lessonService.getLessonById(Number(lessonId));

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found'
            });
        }

        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        console.error(`[Lesson Controller] getLessonById error (lessonId: ${lessonId}):`, error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching lesson'
        });
    }
};

// Create new lesson
const createLesson = async (req, res) => {
    try {
        const { title, courseId } = req.body;
        const file = req.file;

        // Validation
        if (!title || !courseId || !file) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields (title, courseId, or video file)',
            });
        }

        // 1. Create lesson without videoUrl for now
        const newLesson = await lessonService.createLesson({
            title,
            videoUrl: '',
            courseId: Number(courseId),
        });

        const lessonId = newLesson.id;
        const courseDir = path.join(__dirname, '..', 'videos', `course_${courseId}`);
        const finalFileName = `lesson_${lessonId}.mp4`;
        const finalFilePath = path.join(courseDir, finalFileName);

        // 2. Create directory if not exist
        fs.mkdirSync(courseDir, { recursive: true });

        // 3. Move file to permanent location
        fs.renameSync(file.path, finalFilePath);

        // 4. Build public path for frontend (if serving statically)
        const videoUrl = `/videos/course_${courseId}/${finalFileName}`;

        // 5. Update lesson with final video URL
        await lessonService.updateLessonVideoUrl(lessonId, videoUrl);

        res.status(201).json({
            success: true,
            message: 'Lesson created successfully',
            data: {
                ...newLesson,
                videoUrl,
            },
        });
    } catch (error) {
        console.error('[Lesson Controller] createLesson error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating lesson',
            error: error.message,
        });
    }
};

// Update lesson
const updateLesson = async (req, res) => {
    const { lessonId } = req.params;
    const updateData = req.body;

    if (!lessonId || isNaN(lessonId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid lesson ID format'
        });
    }

    try {
        const updatedLesson = await lessonService.updateLesson(
            Number(lessonId),
            updateData
        );

        if (!updatedLesson) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedLesson
        });
    } catch (error) {
        console.error(`[Lesson Controller] updateLesson error (lessonId: ${lessonId}):`, error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating lesson'
        });
    }
};

// Delete lesson
const deleteLesson = async (req, res) => {
    const { lessonId } = req.params;

    if (!lessonId || isNaN(lessonId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid lesson ID format'
        });
    }

    try {
        const deletedLesson = await lessonService.deleteLesson(Number(lessonId));

        if (!deletedLesson) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Lesson deleted successfully'
        });
    } catch (error) {
        console.error(`[Lesson Controller] deleteLesson error (lessonId: ${lessonId}):`, error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting lesson'
        });
    }
};

module.exports = {
    getAllLessons,
    getLessonByCourse,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson
};