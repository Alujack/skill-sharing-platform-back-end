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
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'Admin',
      phone: faker.phone.number(),
      isVerified: true,
    },
  });

  // Create Instructors
  const instructors = await Promise.all(
    Array.from({ length: 10 }, async () => {
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: 'password123',
          role: 'Instructor',
          phone: faker.phone.number(),
          isVerified: true,
        },
      });

      await prisma.instructorProfile.create({
        data: {
          userId: user.id,
          bio: faker.lorem.sentences(2),
          isApproved: true,
        },
      });

      return user;
    })
  );

  // Create Students
  const students = await Promise.all(
    Array.from({ length: 20 }, () =>
      prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: 'password123',
          role: 'Student',
          phone: faker.phone.number(),
          isVerified: true,
        },
      })
    )
  );

  // Create Courses and Lessons
  const courses = await Promise.all(
    Array.from({ length: 5 }, async () => {
      const instructorProfile = await prisma.instructorProfile.findFirst({
        orderBy: { id: 'asc' },
        where: { isApproved: true },
      });

      const course = await prisma.course.create({
        data: {
          title: faker.lorem.words(3),
          description: faker.lorem.paragraph(),
          price: parseFloat(faker.commerce.price()),
          instructorId: instructorProfile.id,
          categoryId: faker.helpers.arrayElement(categories).id,
        },
      });

      // Add Lessons
      await Promise.all(
        Array.from({ length: 10 }, () =>
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
        max: 3,
      });

      return enrolledCourses.map((course) =>
        prisma.enrollment.create({
          data: {
            userId: student.id,
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
            userId: student.id,
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
    console.error('❌ Seed failed:', e);
    return prisma.$disconnect();
  });
