import "./globals.css";
import Nav from "@/components/Nav";
import Pie from "@/components/Pie";
import FondoAnimado from "@/components/FondoAnimado";
import { ProveedorIdioma } from "@/lib/i18n/contexto";
import { ProveedorSesion } from "@/lib/sesion";
import { ProveedorProgreso } from "@/lib/progreso";
import CelebracionRacha from "@/components/progreso/CelebracionRacha";

export const metadata = {
  title: "Diagnos — Fix your reasoning, not just your answer",
  description:
    "An AI tutor that analyses your work step by step, finds the exact point where your reasoning broke, and guides you with Socratic questions until you discover your own mistake.",
};

export default function RootLayout({ children }) {
  return (
    // El atributo lang lo actualiza <ProveedorIdioma> al cambiar de idioma.
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Figtree:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ProveedorIdioma>
          <ProveedorSesion>
            <ProveedorProgreso>
              <FondoAnimado />
              <Nav />
              <main className="min-h-screen">{children}</main>
              <Pie />
              <CelebracionRacha />
            </ProveedorProgreso>
          </ProveedorSesion>
        </ProveedorIdioma>
      </body>
    </html>
  );
}
