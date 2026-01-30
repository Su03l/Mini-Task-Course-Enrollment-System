<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'capacity',
    ];

    // العلاقة بين الطالب والكورس
    public function students()
    {
        return $this->belongsToMany(User::class, 'course_user');
    }
}
