import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Tournoi {
  IdTournoi: number;
  NomTournoi: string;
  DateTournoi: string;
  HeureTournoi: string;
  LieuTournoi: string;
}

function formatDateFr(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatHeureFr(heure: string): string {
  const [h, m] = heure.split(":");
  return `${h}h${m}`;
}

export default function Dashboard() {
  const [tournois, setTournois] = useState<Tournoi[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournois = async () => {
      const { data, error } = await supabase
        .from("Tournoi") // ← respecter la casse
        .select("*")
        .order("DateTournoi", { ascending: true });

      if (error) {
        console.error("Erreur chargement tournois :", error);
        return;
      }

      setTournois(data as Tournoi[]);
    };

    fetchTournois();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tournois</h1>

      {tournois.length === 0 ? (
        <p className="text-muted-foreground">Aucun tournoi disponible.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tournois.map((t) => (
            <Card key={t.IdTournoi}>
              <CardContent className="p-4 space-y-2">
                <div>
                  <h1 className="text-xl font-bold text-primary">{t.NomTournoi}</h1>
                  <p className="text-lg font-semibold">
                    {formatDateFr(t.DateTournoi)} à {formatHeureFr(t.HeureTournoi)}
                  </p>
                  <p className="text-sm">{t.LieuTournoi}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/tournament/${t.IdTournoi}`)}
                >
                  Voir
                </Button>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
