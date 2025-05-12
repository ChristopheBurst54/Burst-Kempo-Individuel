import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Types
interface Tournoi {
  IdTournoi: number;
  NomTournoi: string;
  DateTournoi: string;
  HeureTournoi: string;
  LieuTournoi: string;
}

interface Participant {
  IdParticipant: number;
  NomParticipant: string;
  PrenomParticipant: string;
  DateNaissanceParticipant: string;
  PoidsParticipant: number;
  IpponsParticipant: number;
  KeikokusParticipant: number;
  ClassementParticipant: number;
  Genre? : { NomGenre: string };
  Grade?: { NomGrade: string };
  Club?: { NomClub: string };
  Nationalite?: { NomNationalite: string };
}

// Formatage FR
function formatDateFr(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatHeureFr(heure: string) {
  const [h, m] = heure.split(":");
  return `${h}h${m}`;
}

export default function TournamentPage() {
  const { id } = useParams();
  const [filtre, setFiltre] = useState("");
  const [tournoi, setTournoi] = useState<Tournoi | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      const { data: tournoiData } = await supabase
        .from("Tournoi")
        .select("*")
        .eq("IdTournoi", id)
        .single();

      setTournoi(tournoiData);

      const { data: participantsData } = await supabase
        .from("Participant")
        .select(`
          *,
          Grade:GradeParticipant(NomGrade),
          Club:ClubParticipant(NomClub),
          Nationalite:NationaliteParticipant(NomNationalite),
          Genre:GenreParticipant(NomGenre)
        `)
        .eq("TournoiParticipant", id)
        .order("ClassementParticipant", { ascending: true });

        console.log("Participants data:", participantsData);

      setParticipants(participantsData ?? []);
    };

    loadData();
  }, [id]);

  const filtrés = participants.filter((p) =>
    `${p.PrenomParticipant} ${p.NomParticipant}`.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{tournoi?.NomTournoi}</h1>

      {tournoi && (
        <div className="text-sm text-muted-foreground">
          <p><strong>Date :</strong> {formatDateFr(tournoi.DateTournoi)}</p>
          <p><strong>Heure :</strong> {formatHeureFr(tournoi.HeureTournoi)}</p>
          <p><strong>Lieu :</strong> {tournoi.LieuTournoi}</p>
        </div>
      )}

      <Input
        placeholder="Rechercher un participant"
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardContent className="p-0">
          <Table className="min-w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Classement</TableHead>
                <TableHead>Ippons</TableHead>
                <TableHead>Keikokus</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Naissance</TableHead>
                <TableHead>Poids</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Nationalité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrés.map((p) => (
                <TableRow key={p.IdParticipant}>
                  <TableCell>{p.PrenomParticipant} {p.NomParticipant}</TableCell>
                  <TableCell>{p.ClassementParticipant}</TableCell>
                  <TableCell>{p.IpponsParticipant}</TableCell>
                  <TableCell>{p.KeikokusParticipant}</TableCell>
                  <TableCell>{p.Genre?.NomGenre}</TableCell>
                  <TableCell>{formatDateFr(p.DateNaissanceParticipant)}</TableCell>
                  <TableCell>{p.PoidsParticipant} kg</TableCell>
                  <TableCell>{p.Club?.NomClub ?? "-"}</TableCell>
                  <TableCell>{p.Grade?.NomGrade ?? "-"}</TableCell>
                  <TableCell>{p.Nationalite?.NomNationalite ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
