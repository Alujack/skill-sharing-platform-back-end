const prisma = require('../prisma');

// Get lesson by ID
const getLessonById = async (id) => {
    try {
        return await prisma.lesson.findUnique({
            where: { id },
            include: { course: true },
        });
    } catch (error) {
        console.error("Error fetching lesson by ID:", error);
        throw error;
    }
};

// Get all lessons
const getAllLessons = async () => {
    try {
        return await prisma.lesson.findMany({
            include: { course: true },
        });
    } catch (error) {
        console.error("Error fetching all lessons:", error);
        throw error;
    }
};

// Get lessons by course
const getLessonByCourse = async (courseId) => {
    try {
        return await prisma.lesson.findMany({
            where: { courseId },
            include: { course: true },
        });
    } catch (error) {
        console.error("Error fetching lessons by course ID:", error);
        throw error;
    }
};

// Create lesson
const createLesson = async ({ title, videoUrl = '', courseId }) => {
    try {
        return await prisma.lesson.create({
            data: {
                title,
                videoUrl,
                courseId,
            },
        });
    } catch (error) {
        console.error("Error creating lesson:", error);
        throw error;
    }
};

const updateLesson = async (id, title) => {
    try {
        return await prisma.lesson.update({
            where: { id },
            data: {
                title
            },
        });
    } catch (error) {
        console.error("Error updating lesson:", error);
        throw error;
    }
};


const updateLessonVideoUrl = async (id, videoUrl) => {
    try {
        return await prisma.lesson.update({
            where: { id },
            data: {
                videoUrl
            },
        });
    } catch (error) {
        console.error("Error updating lesson:", error);
        throw error;
    }
};


const deleteLesson = async (id) => {
    try {
        return await prisma.lesson.delete({
            where: { id },
        });
    } catch (error) {
        console.error("Error deleting lesson:", error);
        throw error;
    }
};

module.exports = {
    getLessonById,
    getAllLessons,
    getLessonByCourse,
    createLesson,
    updateLesson,
    updateLessonVideoUrl,
    deleteLesson,
};
