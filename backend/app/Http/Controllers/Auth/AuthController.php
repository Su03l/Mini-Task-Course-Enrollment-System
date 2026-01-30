<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    // لتوحيد الاستجابة وهنا يعني تفعيل Traits

    // For Register User (New Account)
    public function register(RegisterRequest $request)
    {
        // create user in database
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => UserRole::STUDENT, // Default new Register is Student
        ]);

        // return response
        return $this->successResponse([
            'user' => $user,
        ], 'تم إنشاء الحساب بنجاح', 201);
    }

    // For Login User
    public function login(LoginRequest $request)
    {
        // here check for user info Login
        if (!Auth::attempt($request->only(['email', 'password']))) {
            return $this->errorResponse('البريد الإلكتروني أو كلمة المرور غير صحيحة', 401);
        }

        // get user
        $user = User::where('email', $request->email)->first();

        // create the token
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => $user,
            'token' => $token,
        ], 'تم تسجيل الدخول بنجاح');
    }

    // For Logout User
    public function logout(Request $request)
    {
        // Delete the token
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse([], 'تم تسجيل الخروج بنجاح');

    }
}
