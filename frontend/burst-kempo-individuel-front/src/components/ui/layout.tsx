import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="w-full border-b p-4 bg-gray-900 text-white">
        <div className="mx-auto max-w-5xl flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="logonk.png" alt="Logo" className="h-10 w-auto" />
            <h1 className="text-lg font-semibold">Projet Nippon Kempo Individuel</h1>
          </div>
          <nav className="space-x-4">
            <a href="/dashboard" className="hover:underline">Tableau de bord</a>
          </nav>
        </div>
      </header>

      {/* Contenu */}
      <main className="flex-1 p-4 mx-auto w-full max-w-5xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t p-4 text-sm text-center bg-gray-900 text-white">
        © Christophe BURST 2025 - Tous droits réservés
      </footer>
    </div>
  );
}
