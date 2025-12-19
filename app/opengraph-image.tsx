import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Muhammad Suzaril Shah - Azure Cloud Architect & Microsoft MVP';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          textAlign: 'center',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 2%, transparent 2%), radial-gradient(circle at 75% 75%, white 2%, transparent 2%)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Name */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <span
            style={{
              color: '#60a5fa',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontSize: 28,
              background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Microsoft MVP & Docker Captain
          </span>

          <h1
            style={{
              color: 'white',
              fontWeight: 900,
              fontSize: 72,
              lineHeight: 1.1,
              margin: 0,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Muhammad Suzaril Shah
          </h1>

          <span
            style={{
              color: '#94a3b8',
              fontSize: 32,
              fontWeight: 600,
              marginTop: '10px',
            }}
          >
            Azure Cloud Architect & DevOps Engineer
          </span>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            display: 'flex',
            gap: '16px',
          }}
        >
          <span
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#93c5fd',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 20,
              fontWeight: 600,
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            Kubernetes
          </span>
          <span
            style={{
              background: 'rgba(139, 92, 246, 0.2)',
              color: '#c4b5fd',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 20,
              fontWeight: 600,
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            Platform Engineering
          </span>
          <span
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#6ee7b7',
              padding: '12px 24px',
              borderRadius: 9999,
              fontSize: 20,
              fontWeight: 600,
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            Cloud Architecture
          </span>
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            width: '200px',
            height: 4,
            background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
