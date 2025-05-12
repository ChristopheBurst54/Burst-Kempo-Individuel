import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// ---------------------- TYPES
interface Tournoi {
  IdTournoi: number;
  DateTournoi: string;
  HeureTournoi: string;
  LieuTournoi: string;
}

// ---------------------- DONNÉES SIMULÉES
const tournoisSimulés: Tournoi[] = [
  {
    IdTournoi: 1,
    DateTournoi: "2025-06-15",
    HeureTournoi: "14:00",
    LieuTournoi: "Gymnase Municipal, Metz",
  },
  {
    IdTournoi: 2,
    DateTournoi: "2025-07-10",
    HeureTournoi: "10:00",
    LieuTournoi: "Complexe Sportif, Nancy",
  },
];

export default function Dashboard() {
  const [tournois, setTournois] = useState<Tournoi[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // À remplacer plus tard par un fetch depuis Supabase
    setTournois(tournoisSimulés);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tournois à venir</h2>

        {tournois.length === 0 ? (
          <p className="text-muted-foreground">Aucun tournoi enregistré.</p>
        ) : (
          tournois.map((t) => (
            <Card key={t.IdTournoi}>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-medium">Tournoi #{t.IdTournoi}</p>
                  <p className="text-sm text-muted-foreground">
                    {t.DateTournoi} à {t.HeureTournoi} – {t.LieuTournoi}
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/tournament')}>Voir</Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
