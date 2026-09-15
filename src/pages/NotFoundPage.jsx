import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="page status-block">
      <h1 className="page-heading">Halaman tidak ditemukan</h1>
      <p>
        <Link to="/">Kembali ke daftar thread</Link>
      </p>
    </div>
  );
}

export default NotFoundPage;
