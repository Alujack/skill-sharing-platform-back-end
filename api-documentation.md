# Skill-Sharing Platform API Documentation

## Base URL
`https://api.yourplatform.com/v1`

## Authentication
| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|------------------|
| POST | `/auth/register` | Register new user | `name`, `email`, `password`, `user_type` |
| POST | `/auth/login` | Login with credentials | `email`, `password` |
| GET | `/auth/me` | Get current user details |c  `token` |

## User Management
| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|------------------|
| GET | `/users` | List all users (Admin only) | - |
| GET | `/users/{id}` | Get user details | - |
| PUT | `/users/{id}` | Update user profile | `name`, `email`, `user_type` |
| DELETE | `/users/{id}` | Delete user (Admin/self) | - |
| POST | `/users/{id}/instructor` | Create instructor profile | `bio` |
| PUT | `/users/{id}/instructor` | Update instructor profile | `bio` |

## Course Management
| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|------------------|
| GET | `/courses` | List all courses | - |
| POST | `/courses` | Create new course (Instructor) | `title`, `description`, `price`, `category_id` |
| GET | `/courses/{id}` | Get course details | - |
| PUT | `/courses/{id}` | Update course (Instructor) | `title`, `description`, `price`, `category_id` |
| DELETE | `/courses/{id}` | Delete course (Instructor) | - |
| GET | `/courses/instructor/{id}` | Get instructor's courses | - |

## Lesson Management
| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|------------------|
| POST | `/courses/{id}/lessons` | Add lesson to course (Instructor) | `title`, `content_url`, `duration` |
| GET | `/lessons/{id}` | Get lesson details | - |
| PUT | `/lessons/{id}` | Update lesson (Instructor) | `title`, `content_url`, `duration` |
| DELETE | `/lessons/{id}` | Delete lesson (Instructor) | - |

## Enrollment
| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|------------------|
| POST | `/enrollments` | Enroll in course | `course_id` |
| GET | `/enrollments/{id}` | Get enrollment details | - |
| GET | `/enrollments/user/{id}` | Get user's enrollments | - |
| GET | `/enrollments/course/{id}` | Get course enrollments | - |

## Payment
| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|------------------|
| POST | `/payments` | Create payment record | `user_id`, `course_id`, `amount` |
| PUT | `/payments/{id}` | Update payment status | `status` |
| GET | `/payments/user/{id}` | Get user's payments | - |
| GET | `/payments/course/{id}` | Get course payments | - |

## Categories
| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|------------------|
| GET | `/categories` | List all categories | - |
| POST | `/categories` | Create category (Admin) | `name` |
| PUT | `/categories/{id}` | Update category (Admin) | `name` |
| DELETE | `/categories/{id}` | Delete category (Admin) | - |

## Instructor Endpoints
| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|------------------|
| GET | `/instructors` | List all instructors | - |
| GET | `/instructors/{id}` | Get instructor details | - |
| GET | `/instructors/{id}/stats` | Get instructor statistics | - |