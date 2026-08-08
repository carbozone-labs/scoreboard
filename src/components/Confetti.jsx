const COLORS = ['var(--gold)', 'var(--cyan)', 'var(--green)', 'var(--violet)', 'var(--red)'];

export default function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 36 });
  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const duration = 1.6 + Math.random() * 1.2;
        const color = COLORS[i % COLORS.length];
        const rotate = Math.random() * 360;
        return (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              background: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}
