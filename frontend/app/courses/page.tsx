'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    BookOpen,
    Users,
    Plus,
    Trash2,
    LogOut,
    UserCheck,
    X,
    Loader2,
    GraduationCap,
    AlertCircle,
    Pencil,
    AlertTriangle
} from 'lucide-react';
import axiosClient, { getUser, logout } from '@/lib/axios-client';
import { ApiResponse, Course, CoursesResponse, User } from '@/lib/types';

// Custom Confirmation Modal Component
function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'تأكيد',
    cancelText = 'إلغاء',
    type = 'danger'
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning';
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Modal */}
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                        <AlertTriangle className={`w-6 h-6 ${type === 'danger' ? 'text-red-600' : 'text-yellow-600'
                            }`} />
                    </div>
                    <h3 className="text-lg font-bold text-black">{title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-3 text-white font-medium rounded-xl transition-all ${type === 'danger'
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-yellow-500 hover:bg-yellow-600'
                            }`}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Edit Course Modal Component
function EditCourseModal({
    isOpen,
    onClose,
    course,
    onSuccess
}: {
    isOpen: boolean;
    onClose: () => void;
    course: Course | null;
    onSuccess: () => void;
}) {
    const [title, setTitle] = useState('');
    const [capacity, setCapacity] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (course) {
            setTitle(course.title);
            setCapacity(course.capacity.toString());
        }
    }, [course]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!course) return;

        if (!title || !capacity) {
            toast.error('يرجى إدخال جميع البيانات');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.put<ApiResponse<Course>>(`/courses/${course.id}`, {
                title,
                capacity: parseInt(capacity),
            });

            if (response.data.success) {
                toast.success(response.data.message || 'تم تحديث الكورس بنجاح');
                onSuccess();
                onClose();
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل تحديث الكورس');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !course) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Modal */}
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-black flex items-center gap-2">
                        <Pencil className="w-5 h-5 text-sky-500" />
                        تعديل الكورس
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2 font-medium text-black text-sm">عنوان الكورس</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all"
                            placeholder="أدخل عنوان الكورس"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className="block mb-2 font-medium text-black text-sm">السعة</label>
                        <input
                            type="number"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all"
                            placeholder="أدخل عدد المقاعد"
                            min="1"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-sky-500 text-white font-medium rounded-xl hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/30"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    جاري التحديث...
                                </>
                            ) : (
                                <>
                                    <Pencil className="w-4 h-4" />
                                    تحديث
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
                            disabled={loading}
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    // Add Course Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCapacity, setNewCapacity] = useState('');
    const [addLoading, setAddLoading] = useState(false);

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    // Confirm Modal State
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

    // Action loading states
    const [enrollingId, setEnrollingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Prevent double fetch in React Strict Mode
    const hasFetched = useRef(false);

    useEffect(() => {
        const currentUser = getUser();
        if (!currentUser) {
            router.push('/login');
            return;
        }
        setUser(currentUser);

        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchCourses();
        }
    }, [router]);

    const fetchCourses = async (showSuccessToast = false) => {
        try {
            const response = await axiosClient.get<ApiResponse<CoursesResponse>>('/courses');
            if (response.data.success) {
                setCourses(response.data.data.data);
                if (showSuccessToast) {
                    toast.success('تم تحديث القائمة');
                }
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل تحميل الكورسات');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId: number) => {
        setEnrollingId(courseId);
        try {
            const response = await axiosClient.post<ApiResponse<null>>(`/courses/${courseId}/enroll`);
            if (response.data.success) {
                toast.success(response.data.message || 'تم التسجيل بنجاح');
                fetchCourses();
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل التسجيل');
        } finally {
            setEnrollingId(null);
        }
    };

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newTitle || !newCapacity) {
            toast.error('يرجى إدخال جميع البيانات');
            return;
        }

        setAddLoading(true);
        try {
            const response = await axiosClient.post<ApiResponse<Course>>('/courses', {
                title: newTitle,
                capacity: parseInt(newCapacity),
            });

            if (response.data.success) {
                toast.success(response.data.message || 'تم إضافة الكورس بنجاح');
                setNewTitle('');
                setNewCapacity('');
                setShowAddForm(false);
                fetchCourses();
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل إضافة الكورس');
        } finally {
            setAddLoading(false);
        }
    };

    const handleDeleteClick = (course: Course) => {
        setCourseToDelete(course);
        setConfirmModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!courseToDelete) return;

        setConfirmModalOpen(false);
        setDeletingId(courseToDelete.id);

        try {
            const response = await axiosClient.delete<ApiResponse<null>>(`/courses/${courseToDelete.id}`);
            if (response.data.success) {
                toast.success(response.data.message || 'تم حذف الكورس بنجاح');
                fetchCourses();
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل حذف الكورس');
        } finally {
            setDeletingId(null);
            setCourseToDelete(null);
        }
    };

    const handleEditClick = (course: Course) => {
        setEditingCourse(course);
        setEditModalOpen(true);
    };

    const handleLogout = async () => {
        try {
            await axiosClient.post('/logout');
            toast.success('تم تسجيل الخروج بنجاح');
        } catch {
            // Silent fail
        } finally {
            logout();
            router.push('/login');
        }
    };

    const isAdmin = user?.role === 'admin';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500 rounded-2xl mb-4 animate-pulse">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-500">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/30">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-black">نظام الكورسات</h1>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>مرحباً، {user?.name}</span>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isAdmin
                                        ? 'bg-sky-100 text-sky-700'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {isAdmin ? (
                                            <>
                                                <UserCheck className="w-3 h-3" />
                                                مدير
                                            </>
                                        ) : (
                                            <>
                                                <GraduationCap className="w-3 h-3" />
                                                طالب
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">تسجيل الخروج</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Admin: Add Course Section */}
                {isAdmin && (
                    <div className="mb-8">
                        {!showAddForm ? (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-sky-500 text-white font-medium rounded-xl hover:bg-sky-600 active:scale-[0.98] transition-all shadow-lg shadow-sky-500/30"
                            >
                                <Plus className="w-5 h-5" />
                                إضافة كورس جديد
                            </button>
                        ) : (
                            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 max-w-md animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-black flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-sky-500" />
                                        إضافة كورس جديد
                                    </h3>
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <form onSubmit={handleAddCourse} className="space-y-4">
                                    <div>
                                        <label className="block mb-2 font-medium text-black text-sm">عنوان الكورس</label>
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all"
                                            placeholder="أدخل عنوان الكورس"
                                            disabled={addLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-medium text-black text-sm">السعة</label>
                                        <input
                                            type="number"
                                            value={newCapacity}
                                            onChange={(e) => setNewCapacity(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-500/10 transition-all"
                                            placeholder="أدخل عدد المقاعد"
                                            min="1"
                                            disabled={addLoading}
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={addLoading}
                                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-sky-500 text-white font-medium rounded-xl hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/30"
                                        >
                                            {addLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    جاري الإضافة...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4" />
                                                    إضافة
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="px-5 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all"
                                            disabled={addLoading}
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats Bar */}
                <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-sky-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">إجمالي الكورسات</p>
                                <p className="text-xl font-bold text-black">{courses.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Grid */}
                {courses.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-lg">لا توجد كورسات متاحة حالياً</p>
                        {isAdmin && (
                            <p className="text-gray-400 text-sm mt-2">اضغط على &quot;إضافة كورس جديد&quot; لإنشاء كورس</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => {
                            const isFull = course.students_count >= course.capacity;
                            const percentage = Math.round((course.students_count / course.capacity) * 100);

                            return (
                                <div
                                    key={course.id}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group"
                                >
                                    {/* Course Icon & Admin Actions */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                                            <BookOpen className="w-6 h-6 text-sky-600 group-hover:text-white transition-colors" />
                                        </div>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleEditClick(course)}
                                                className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-sky-100 hover:text-sky-600 transition-colors"
                                                title="تعديل الكورس"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Course Title */}
                                    <h3 className="text-lg font-bold text-black mb-4">
                                        {course.title}
                                    </h3>

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                الطلاب المسجلين
                                            </span>
                                            <span className={`font-medium ${isFull ? 'text-red-500' : 'text-sky-600'}`}>
                                                {course.students_count}/{course.capacity}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${isFull ? 'bg-red-500' : 'bg-sky-500'
                                                    }`}
                                                style={{ width: `${Math.min(percentage, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    {isFull && (
                                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm font-medium mb-4">
                                            <AlertCircle className="w-4 h-4" />
                                            الكورس ممتلئ
                                        </div>
                                    )}

                                    {/* Student: Enroll Button */}
                                    {!isAdmin && (
                                        <button
                                            onClick={() => handleEnroll(course.id)}
                                            disabled={enrollingId === course.id || isFull}
                                            className={`w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-xl transition-all ${isFull
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-sky-500 text-white hover:bg-sky-600 active:scale-[0.98] shadow-lg shadow-sky-500/30'
                                                } disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100`}
                                        >
                                            {enrollingId === course.id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    جاري التسجيل...
                                                </>
                                            ) : isFull ? (
                                                'الكورس ممتلئ'
                                            ) : (
                                                <>
                                                    <GraduationCap className="w-4 h-4" />
                                                    التسجيل في الكورس
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* Admin: Delete Button */}
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDeleteClick(course)}
                                            disabled={deletingId === course.id}
                                            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 transition-all"
                                        >
                                            {deletingId === course.id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    جاري الحذف...
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="w-4 h-4" />
                                                    حذف الكورس
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Edit Course Modal */}
            <EditCourseModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setEditingCourse(null);
                }}
                course={editingCourse}
                onSuccess={fetchCourses}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => {
                    setConfirmModalOpen(false);
                    setCourseToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="حذف الكورس"
                message={`هل أنت متأكد من حذف كورس "${courseToDelete?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
                confirmText="حذف"
                cancelText="إلغاء"
                type="danger"
            />
        </div>
    );
}
