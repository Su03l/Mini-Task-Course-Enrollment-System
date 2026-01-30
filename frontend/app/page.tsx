'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { isAuthenticated } from '@/lib/axios-client';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/courses');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-sky-500 rounded-2xl mb-6 animate-pulse shadow-lg shadow-sky-500/30">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-black mb-2">نظام الكورسات</h1>
        <p className="text-gray-500">جاري التحميل...</p>
      </div>
    </div>
  );
}
