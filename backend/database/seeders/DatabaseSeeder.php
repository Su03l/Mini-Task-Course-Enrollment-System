<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Check if admin exists to prevent duplicates
        if (!User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'name' => 'System Admin',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
                'role' => UserRole::ADMIN, // استخدام الـ Enum
            ]);
        }
    }
}
