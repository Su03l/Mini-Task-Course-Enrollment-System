# Course Enrollment System - Backend

نظام تسجيل الكورسات - الباك اند (Laravel API)

---

## التقنيات المستخدمة

- **Laravel 11** - PHP Framework
- **Laravel Sanctum** - Token-based Authentication
- **Scramble** - API Documentation
- **PostgreSQL** - Database
- **API Resource** - Response Formatting

---

## Mini Task: Course Enrollment System

Build a small system where:

- **Admin** can manage courses
- **Student** can view courses and enroll

**Focus:** Clean code, API, basic frontend integration

---

## 1) Backend (Laravel API)

### A) Authentication (Sanctum)

**Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register (name, email, password) → role = student |
| POST | `/api/login` | Login |
| POST | `/api/logout` | Logout |

**Seeded Admin:**

```
email: admin@example.com
password: password
```

### B) Courses

**Admin only:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/courses` | Create course (title, capacity) |
| PUT | `/api/courses/{id}` | Update course |
| DELETE | `/api/courses/{id}` | Delete course |

**Admin & Student:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List courses (paginated) |

### C) Enrollment

**Student only:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/courses/{id}/enroll` | Enroll in course |

**Rules:**

- A student cannot enroll in the same course twice
- Course capacity must not be exceeded
- Must use Database transaction
- Unique constraint on (user_id, course_id)

### D) Standard API Response

All endpoints return:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {},
    "errors": null
}
```

---

## التشغيل

**Step 1:** تثبيت الـ dependencies

```bash
composer install
```

**Step 2:** نسخ ملف البيئة

```bash
cp .env.example .env
```

**Step 3:** توليد مفتاح التطبيق

```bash
php artisan key:generate
```

**Step 4:** إعداد قاعدة البيانات في `.env`

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=course_enrollment_system
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

**Step 5:** تشغيل الـ migrations

```bash
php artisan migrate
```

**Step 6:** تشغيل الـ seeders (للأدمن)

```bash
php artisan db:seed
```

**Step 7:** تشغيل السيرفر

```bash
php artisan serve
```

السيرفر سيعمل على: `http://localhost:8000`

---

## API Documentation (Scramble)

بعد تشغيل السيرفر، يمكنك الوصول لتوثيق الـ API على:

```
http://localhost:8000/docs/api
```
