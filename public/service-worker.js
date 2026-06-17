const CACHE_NAME = 'sahacare-cache-v1';

// الملفات الثابتة الأساسية لعمل كاش مبدئي لها
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/sahscare.jpg'
];

// حدث التثبيت: نقوم بتخزين الملفات الثابتة
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// حدث التفعيل: مسح الكاش القديم إن وجد
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// حدث الجلب (Fetch): استراتيجية Network First, falling back to cache
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // تطبيق الاستراتيجية على جميع الطلبات (APIs والصفحات)
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // التحقق من صحة الاستجابة
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // حفظ نسخة من الاستجابة الحية في الكاش لاستخدامها عند انقطاع الإنترنت
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      })
      .catch(async (error) => {
        // الخطة البديلة (Offline Fallback): في حال انقطاع الإنترنت، جلب آخر نسخة ناجحة من الكاش
        console.log('[Service Worker] Network request failed, serving from cache.', request.url);
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // يمكننا هنا إرجاع صفحة Offline مخصصة إذا أردنا
        throw error;
      })
  );
});
