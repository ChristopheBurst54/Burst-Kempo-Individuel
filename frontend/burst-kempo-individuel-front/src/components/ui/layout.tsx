import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="w-full border-b p-4 bg-gray-500">
        <div className="mx-auto max-w-5xl flex justify-between items-center">
          <img src="logonk.png" alt="Logo" className="h-10 w-auto" />
          <h1 className="text-lg font-semibold">Projet Nippon Kempo Individuel</h1>
          <nav className="space-x-4">
            <a href="/" className="hover:underline">Accueil</a>
            <a href="/dashboard" className="hover:underline">Tableau de bord</a>
            <a href="/tournament" className="hover:underline">Tournoi</a>
          </nav>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 p-4 mx-auto w-full max-w-5xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t p-4 text-sm text-center  bg-gray-500">
        © Christophe BURST 2025 - Tous droits réservés
      </footer>
    </div>
  );
}
