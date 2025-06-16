const prisma = require('../prisma');

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
const createLesson = async (data) => {
    try {
        const newLesson = await prisma.lesson.create({
            data,
            include: {
                course: true
            },
        });
        return newLesson;
    } catch (error) {
        console.error("Error creating lesson:", error);
        throw error;
    }
}
const updateLesson = async (id, data) => {
    try {
        const updatedLesson = await prisma.lesson.update({
            where: { id },
            data,
            include: {
                course: true
            },
        });
        return updatedLesson;
    } catch (error) {
        console.error("Error updating lesson:", error);
        throw error;
    }
}
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