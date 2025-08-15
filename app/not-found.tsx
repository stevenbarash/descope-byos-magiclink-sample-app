import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      backgroundColor: '#11100A',
      color: '#ffffff',
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link 
        href="/"
        style={{
          padding: '10px 20px',
          backgroundColor: '#ffffff',
          color: '#11100A',
          textDecoration: 'none',
          borderRadius: '5px'
        }}
      >
        Return Home
      </Link>
    </div>
  )
} 