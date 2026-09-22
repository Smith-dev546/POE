import Flower from "../Flower/Flower";
import styles from "./Garden.module.css";
import { createGarden } from "@/lib/flowerConfig";

interface GardenProps {
  count?: number;
}

export default function Garden({ count = 9 }: GardenProps) {
  const flowers = createGarden(count);

  return (
    <section className={styles.garden} aria-label="Jardín de flores">
      {flowers.map(({ id, ...spec }) => (
        <Flower key={id} {...spec} />
      ))}
    </section>
  );
}