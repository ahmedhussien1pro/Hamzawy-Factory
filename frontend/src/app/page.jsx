// src/app/page.jsx
export default function HomePage() {
  return (
    <div
      style={{
        padding: '50px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
        نظام إدارة المصنع والمخزن
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        نظام متكامل لإدارة عمليات المصنع والمخزون
      </p>
      <a
        href='/login'
        style={{
          padding: '12px 30px',
          background: 'white',
          color: '#667eea',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          fontSize: '1.1rem',
        }}>
        تسجيل الدخول
      </a>
    </div>
  );
}
