# Ruang Diskusi

Aplikasi forum diskusi berbasis React + Redux Toolkit yang memanfaatkan
[Dicoding Forum API](https://forum-api.dicoding.dev/v1/). Dibuat untuk
submission "Membangun Aplikasi React dengan Redux".

## Menjalankan proyek

```bash
npm install
npm run dev       # jalankan mode development
npm run build     # build untuk produksi -> folder dist/
npm run lint      # jalankan ESLint (Airbnb style guide)
```

## Fitur

- Registrasi & login akun
- Melihat daftar thread beserta filter kategori (murni di sisi Front-End)
- Melihat detail thread beserta komentar
- Membuat thread & komentar baru (wajib login)
- Upvote / downvote thread & komentar dengan **optimistic update**
- Halaman leaderboard
- Loading indicator global saat memuat data dari API

## Arsitektur

```
src/
├── components/   # UI reusable (Navbar, ThreadItem, VoteControls, dst)
├── pages/        # Halaman (route-level components)
├── states/       # Redux Toolkit: satu folder per domain (slice + thunk)
│   ├── auth/
│   ├── threads/
│   ├── users/
│   ├── leaderboards/
│   ├── loadingBar/   # reducer generik pelacak status loading dari semua thunk
│   ├── shared/        # middleware untuk menampilkan toast saat thunk gagal
│   └── store.js
└── utils/
    ├── api.js        # satu-satunya tempat pemanggilan REST API
    └── formatTime.js
```

Poin arsitektur penting:
- Semua pemanggilan `fetch()` hanya ada di `src/utils/api.js`, dipanggil lewat
  Redux thunk (`createAsyncThunk` atau thunk manual) — **tidak ada** pemanggilan
  API langsung di dalam `useEffect`/lifecycle komponen.
- State dari API (`threads`, `threadDetail`, `users`, `leaderboards`, `authUser`)
  seluruhnya disimpan di Redux Store. Hanya form input (controlled component)
  yang mengelola state-nya sendiri secara lokal.
- `loadingBar` reducer bekerja generik dengan mendeteksi akhiran action type
  `/pending`, `/fulfilled`, `/rejected` dari *semua* thunk, sehingga loading
  indicator otomatis aktif tanpa perlu didaftarkan manual di setiap thunk.
- Vote thread & komentar diterapkan secara **optimistic**: UI langsung
  diperbarui saat tombol vote ditekan, lalu di-revert otomatis bila request ke
  API gagal.

## Konfigurasi

Base URL API di-hardcode di `src/utils/api.js` sebagai
`https://forum-api.dicoding.dev/v1`. Ubah nilai `BASE_URL` di file tersebut
bila API endpoint berubah.
