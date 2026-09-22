import styles from "./Petal.module.css";

interface PetalProps {
  angle: number;
  bloomDelay: number;
}

export default function Petal({ angle, bloomDelay }: PetalProps) {
  return (
    <div
      className={styles.petal}
      style={
        {
          "--angle": `${angle}deg`,
          "--bloom-delay": `${bloomDelay}s`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    />
  );
}