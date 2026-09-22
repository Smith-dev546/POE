import Garden from "./components/Garden/Garden";
import Sky from "./components/Sky/Sky";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Sky />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon} aria-hidden="true">
              🌻
            </span>
            Feliz Día de las Flores Amarillas
            <span className={styles.titleIcon} aria-hidden="true">
              🌻
            </span>
          </h1>
          <p className={styles.subtitle}>
            Un pequeño jardín hecho con mucho pero mucho cariño.
          </p>
        </header>

        <Garden count={9} />

        <footer className={styles.footer}>
          <p>
            Hecho con <span aria-hidden="true">amor❤️</span> para ti
          </p>
        </footer>
      </main>
    </>
  );
}