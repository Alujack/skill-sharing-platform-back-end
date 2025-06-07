import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const categories = await Promise.all(
    Array.from({ length: 4 }, () =>
      prisma.category.create({
        data: {
          name: faker.commerce.department() + ' ' + faker.number.int(100),
        },
      })
    )
  );

  // Create Admin User
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'admin123',
      role: 'Admin',
      isVerified: true,
    },
  });

  // Create Instructors
  const instructors = await Promise.all(
    Array.from({ length: 5 }, async () => {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: 'password123',
          role: 'Instructor',
          isVerified: true,
        },
      });

      const instructor = await prisma.instructor.create({
        data: {
          userId: user.id,
          name: faker.person.fullName(),
          phone: faker.phone.number(),
          bio: faker.lorem.sentences(2),
          isApproved: true,
        },
      });

      return instructor;
    })
  );

  // Create Students
  const students = await Promise.all(
    Array.from({ length: 10 }, async () => {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: 'password123',
          role: 'Student',
          isVerified: true,
        },
      });

      const student = await prisma.student.create({
        data: {
          userId: user.id,
          name: faker.person.fullName(),
          phone: faker.phone.number(),
        },
      });

      return student;
    })
  );

  // Create Courses and Lessons
  const courses = await Promise.all(
    Array.from({ length: 10 }, async () => {
      const instructor = faker.helpers.arrayElement(instructors);
      const course = await prisma.course.create({
        data: {
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          price: parseFloat(faker.commerce.price()),
          instructorId: instructor.id,
          categoryId: faker.helpers.arrayElement(categories).id,
        },
      });

      // Add Lessons
      await Promise.all(
        Array.from({ length: 5 }, () =>
          prisma.lesson.create({
            data: {
              title: faker.lorem.words(4),
              videoUrl: faker.internet.url(),
              courseId: course.id,
            },
          })
        )
      );

      return course;
    })
  );

  // Create Enrollments
  await Promise.all(
    students.flatMap((student) => {
      const enrolledCourses = faker.helpers.arrayElements(courses, {
        min: 2,
        max: 4,
      });

      return enrolledCourses.map((course) =>
        prisma.enrollment.create({
          data: {
            studentId: student.id,
            courseId: course.id,
          },
        })
      );
    })
  );

  // Create Wishlists
  await Promise.all(
    students.flatMap((student) => {
      const wishlistCourses = faker.helpers.arrayElements(courses, {
        min: 1,
        max: 2,
      });

      return wishlistCourses.map((course) =>
        prisma.wishlist.create({
          data: {
            studentId: student.id,
            courseId: course.id,
          },
        })
      );
    })
  );
}

main()
  .then(() => {
    console.log('🌱 Seed completed!');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(' Seed failed:', e);
    return prisma.$disconnect();
  });
