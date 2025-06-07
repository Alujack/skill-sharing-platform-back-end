const prisma = require('../prisma');

// Get total counts for admin dashboard
exports.getDashboardCounts = async (req, res) => {
    console.log("i am here")
    try {
        // Get total users (all roles)
        const totalUsers = await prisma.user.count();
        
        // Get total students (users with Student role)
        const totalStudents = await prisma.Student.count();
        
        // Get total instructors (users with Instructor role)
        const totalInstructors = await prisma.Instructor.count();
        
        // Get total approved instructors
        const totalApprovedInstructors = await prisma.Instructor.count({
            where: { isApproved: true }
        });
        
        // Get total courses
        const totalCourses = await prisma.course.count();
        
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalInstructors,
                totalApprovedInstructors,
                totalCourses
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard counts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
};