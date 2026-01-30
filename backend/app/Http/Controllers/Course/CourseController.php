<?php

namespace App\Http\Controllers\Course;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\Course\UpdateCourseRequest;
use App\Models\Course;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    use ApiResponse;

    // GET /api/courses (Admin & Student)
    public function index()
    {
        // get all courses and using pagination
        // withCount to return the number of students enrolled in each course
        $courses = Course::withCount('students')->paginate(10);

        return $this->successResponse($courses, 'تم تحميل جميع الكورسات بنجاح');
    }

    // POST /api/courses (Admin Only)
    public function store(StoreCourseRequest $request)
    {
        // create course
        $course = Course::create($request->validated());


        return $this->successResponse($course, 'تم إنشاء الكورس بنجاح', 201);
    }

    // PUT /api/courses/{id} (Admin Only)
    public function update(UpdateCourseRequest $request, Course $course)
    {
        // update course
        $course->update($request->validated());

        return $this->successResponse($course, 'تم تحديث الكورس بنجاح');
    }

    // DELETE /api/courses/{id} (Admin Only)
    public function destroy(Course $course)
    {
        // delete course
        $course->delete();

        return $this->successResponse([], 'تم حذف الكورس بنجاح');
    }

    // POST /api/courses/{id}/enroll
    public function enroll(Course $course, Request $request)
    {
        $user = $request->user();

        //check for the authrize (student onl)
        if ($user->role !== UserRole::STUDENT) {
            return $this->errorResponse('لم يتم التحقق من الصلاحية', 403);
        }

        // Start The Transactions
        try {
            return DB::transaction(function () use ($course, $user) {
                // Lock For Update | Close the classroom until the student has completed the request
                $courseLocked = Course::lockForUpdate()->withCount('students')->find($course->id);

                //check is the student register before ?
                $isEnrolled = $courseLocked->students()->where('user_id', $user->id)->exists();
                if ($isEnrolled) {
                    return $this->errorResponse('انت مسجل بالفعل في هذا الكورس', 400);
                }

                // check if the capacity is Full ?
                if ($courseLocked->students_count >= $courseLocked->capacity) {
                    return $this->errorResponse('الكورس ممتلئ بالفعل ', 400);
                }

                // The Register
                $courseLocked->students()->attach($user->id);

                return $this->successResponse([], 'تم التسجيل في الكورس بنجاح');
            });
        } catch (\Exception $e) {
            // if there any problem
            return $this->errorResponse('حدث خطأ ما : ' . $e->getMessage(), 500);
        }
    }
}
