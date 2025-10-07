'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {

    const lastPath = Cookies.get('lastActivePath');
    console.log('🔹 Last active path cookie value:', lastPath);

    setTimeout(() => {
      if (lastPath && lastPath !== '/') {
        router.push(lastPath);
      } else {
        router.push('/tabs');
      }
    }, 100);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  );
}
