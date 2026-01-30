// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data: T;
}

// User Types
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'student';
    created_at: string;
    updated_at: string;
}

// Auth Types
export interface LoginResponse {
    user: User;
    token: string;
}

export interface RegisterResponse {
    user: User;
}

// Course Types
export interface Course {
    id: number;
    title: string;
    capacity: number;
    students_count: number;
    created_at: string;
    updated_at: string;
}

export interface CoursesResponse {
    current_page: number;
    data: Course[];
    last_page: number;
    per_page: number;
    total: number;
}

// Form Types
export interface LoginForm {
    email: string;
    password: string;
}

export interface CourseForm {
    title: string;
    capacity: number;
}
