import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Tournoi {
  IdTournoi: number;
  NomTournoi: string;
  DateTournoi: string; // format ISO "YYYY-MM-DD"
  HeureTournoi: string; // format "HH:mm"
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

function combineDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`);
}

export default function Dashboard() {
  const [tournoisAVenir, setTournoisAVenir] = useState<Tournoi[]>([]);
  const [tournoisPasses, setTournoisPasses] = useState<Tournoi[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTournois = async () => {
      const { data, error } = await supabase
        .from("Tournoi")
        .select("*")
        .order("DateTournoi", { ascending: true });

      if (error) {
        console.error("Erreur chargement tournois :", error);
        return;
      }

      const now = new Date();

      const aVenir: Tournoi[] = [];
      const passes: Tournoi[] = [];

      (data as Tournoi[]).forEach((t) => {
        const dateHeureTournoi = combineDateTime(t.DateTournoi, t.HeureTournoi);
        if (dateHeureTournoi >= now) {
          aVenir.push(t);
        } else {
          passes.push(t);
        }
      });

      setTournoisAVenir(aVenir);
      setTournoisPasses(passes);
    };

    fetchTournois();
  }, []);

  const renderTournois = (liste: Tournoi[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {liste.map((t) => (
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
  );

  return (
    <div className="p-6 space-y-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">Tournois à venir</h1>
        {tournoisAVenir.length === 0 ? (
          <p className="text-muted-foreground">Aucun tournoi à venir.</p>
        ) : (
          renderTournois(tournoisAVenir)
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">Tournois passés</h1>
        {tournoisPasses.length === 0 ? (
          <p className="text-muted-foreground">Aucun tournoi passé.</p>
        ) : (
          renderTournois(tournoisPasses)
        )}
      </div>
    </div>
  );
}
