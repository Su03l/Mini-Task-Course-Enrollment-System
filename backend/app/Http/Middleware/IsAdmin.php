<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use App\Traits\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    use ApiResponse;

    public function handle(Request $request, Closure $next): Response
    {
        // التحقق باستخدام الـ Enum
        if ($request->user()->role !== UserRole::ADMIN) {
            return $this->errorResponse('Access Denied. Admins only.', 403);
        }

        return $next($request);
    }
}
