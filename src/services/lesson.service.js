const prisma = require('../prisma');
const path = require('path');
const fs = require('fs');


const getLessonById = async (id) => {
    try {
        const lesson = await prisma.lesson.findUnique({
            where: { id },
            include: {
                course: true
            },
        });
        return lesson;
    } catch (error) {
        console.error("Error fetching lesson by ID:", error);
        throw error;
    }
}
const getAllLessons = async () => {
    try {
        const lessons = await prisma.lesson.findMany({
            include: {
                course: true
            },
        });
        return lessons;
    } catch (error) {
        console.error("Error fetching all lessons:", error);
        throw error;
    }
}
const getLessonByCourse = async (courseId) => {
    try {
        const lessons = await prisma.lesson.findMany({
            where: { courseId },
            include: {
                course: true
            },
        });
        return lessons;
    } catch (error) {
        console.error("Error fetching lessons by course ID:", error);
        throw error;
    }
}
const createLesson = async (req, res) => {
    try {
        const { title, courseId } = req.body;
        const file = req.file;

        // Validation
        if (!title || !courseId || !file) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields (title, courseId or video file)',
            });
        }

        // 1. Create lesson first (videoUrl is empty initially)
        const newLesson = await lessonService.createLesson({
            title,
            videoUrl: '',
            courseId: Number(courseId),
        });

        const lessonId = newLesson.id;
        const courseDir = path.join(__dirname, '..', 'videos', `course_${courseId}`);
        const finalFileName = `lesson_${lessonId}.mp4`;
        const finalFilePath = path.join(courseDir, finalFileName);

        // 2. Create directory if not exists
        fs.mkdirSync(courseDir, { recursive: true });

        // 3. Move uploaded file to final location
        fs.renameSync(file.path, finalFilePath);

        // 4. Update lesson with actual video URL path
        const relativeVideoUrl = `/videos/course_${courseId}/${finalFileName}`;
        await lessonService.updateLessonVideoUrl(lessonId, relativeVideoUrl);

        res.status(201).json({
            success: true,
            message: 'Lesson created successfully',
            data: {
                ...newLesson,
                videoUrl: relativeVideoUrl,
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
}
const updateLessonVideoUrl = async (id, videoUrl) => {
    try {
        const updatedLesson = await prisma.lesson.update({
            where: { id },
            data: { videoUrl },
        });
        return updatedLesson;
    } catch (error) {
        console.error("Error updating videoUrl:", error);
        throw error;
    }
};

const deleteLesson = async (id) => {
    try {
        const deletedLesson = await prisma.lesson.delete({
            where: { id },
            include: {
                course: true
            },
        });
        return deletedLesson;
    } catch (error) {
        console.error("Error deleting lesson:", error);
        throw error;
    }
}
module.exports = {
    getLessonById,
    getAllLessons,
    getLessonByCourse,
    createLesson,
    updateLesson,
    deleteLesson
};