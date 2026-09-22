import Petal from "../Petal/Petal";
import styles from "./Flower.module.css";
import type { FlowerSpec } from "@/lib/flowerConfig";

const PETAL_COUNT = 8;

export default function Flower({
  size,
  delay,
  sway,
  rotation,
  scale,
}: Omit<FlowerSpec, "id">) {
  const petals = Array.from({ length: PETAL_COUNT }, (_, i) => i);

  return (
    <div
      className={`${styles.flower} ${styles[size]}`}
      style={
        {
          "--sway-duration": `${sway}s`,
          "--sway-delay": `${delay}s`,
        } as React.CSSProperties
      }
      role="img"
      aria-label="Flor amarilla"
    >
      <div
        className={styles.head}
        style={
          {
            "--rotation": `${rotation}deg`,
            "--scale": scale,
            "--appear-delay": `${delay}s`,
          } as React.CSSProperties
        }
      >
        {petals.map((i) => (
          <Petal
            key={i}
            angle={(360 / PETAL_COUNT) * i}
            bloomDelay={delay + i * 0.05}
          />
        ))}
        <div className={styles.center} />
      </div>
    </div>
  );
}