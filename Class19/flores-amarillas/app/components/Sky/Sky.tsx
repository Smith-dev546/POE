import styles from "./Sky.module.css";

const STARS = Array.from({ length: 40 }, (_, i) => {
  const seed = i + 1;
  return {
    id: `star-${seed}`,
    top: (seed * 37) % 90,
    left: (seed * 53) % 100,
    duration: 2 + ((seed * 7) % 30) / 10,
    delay: ((seed * 11) % 20) / 10,
  };
});

export default function Sky() {
  return (
    <div className={styles.sky} aria-hidden="true">
      {STARS.map((s) => (
        <span
          key={s.id}
          className={styles.star}
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              "--duration": `${s.duration}s`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}