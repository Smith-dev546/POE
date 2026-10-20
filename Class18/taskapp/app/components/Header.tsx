import Link from "next/link";

export default function Header(){
    return(
        <header>
            <h1>TaskApp</h1>
            <nav>
                <Link href="/">Inicio</Link>
                <Link href="/">Tareas</Link>
                <Link href="/">Tareas</Link>
            </nav>
        </header>
    );
}