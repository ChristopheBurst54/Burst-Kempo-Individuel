import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// ---------------------- TYPES
interface Tournoi {
  IdTournoi: number;
  DateTournoi: string;
  HeureTournoi: string;
  LieuTournoi: string;
}

interface Participant {
  IdParticipant: number;
  PrénomParticipant: string;
  NomParticipant: string;
  DateNaissanceParticipant: string;
  PoidsParticipant: number;
  GenreParticipant: string; // "M" | "F"
  IpponsParticipant: number;
  KeikokusParticipant: number;
  ClassementParticipant: number;
  Grade: string;
  Club: string;
  Nationalite: string;
}

// ---------------------- DONNÉES SIMULÉES

const tournoi: Tournoi = {
  IdTournoi: 1,
  DateTournoi: "2025-06-15",
  HeureTournoi: "14:00",
  LieuTournoi: "Gymnase Municipal, Metz",
};

const participants: Participant[] = [
  {
    IdParticipant: 1,
    PrénomParticipant: "Jean",
    NomParticipant: "Dupont",
    DateNaissanceParticipant: "1996-03-14",
    PoidsParticipant: 75,
    GenreParticipant: "M",
    IpponsParticipant: 3,
    KeikokusParticipant: 1,
    ClassementParticipant: 1,
    Grade: "1er Dan",
    Club: "Dojo Metz",
    Nationalite: "Française",
  },
  {
    IdParticipant: 2,
    PrénomParticipant: "Marie",
    NomParticipant: "Curie",
    DateNaissanceParticipant: "1995-11-07",
    PoidsParticipant: 60,
    GenreParticipant: "F",
    IpponsParticipant: 2,
    KeikokusParticipant: 0,
    ClassementParticipant: 2,
    Grade: "Ceinture marron",
    Club: "Club Nancy",
    Nationalite: "Française",
  },
  // Ajoute d'autres participants ici
];

// ---------------------- COMPOSANT PRINCIPAL

export default function TournamentPage() {
  const [filtre, setFiltre] = useState("");
  const navigate = useNavigate();

  const filtrés = participants.filter((p) =>
    `${p.PrénomParticipant} ${p.NomParticipant}`.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Tournoi #{tournoi.IdTournoi}</h1>

      <div className="text-sm text-gray-600">
        <p><strong>Date :</strong> {tournoi.DateTournoi}</p>
        <p><strong>Heure :</strong> {tournoi.HeureTournoi}</p>
        <p><strong>Lieu :</strong> {tournoi.LieuTournoi}</p>
      </div>

      <Input
        placeholder="Rechercher un participant"
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Classement</TableHead>
                <TableHead>Ippons</TableHead>
                <TableHead>Keikokus</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Naissance</TableHead>
                <TableHead>Poids (kg)</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Nationalité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrés.map((p) => (
                <TableRow key={p.IdParticipant}>
                  <TableCell>{p.PrénomParticipant} {p.NomParticipant}</TableCell>
                  <TableCell>{p.ClassementParticipant}</TableCell>
                  <TableCell>{p.IpponsParticipant}</TableCell>
                  <TableCell>{p.KeikokusParticipant}</TableCell>
                  <TableCell>{p.GenreParticipant}</TableCell>
                  <TableCell>{p.DateNaissanceParticipant}</TableCell>
                  <TableCell>{p.PoidsParticipant}</TableCell>
                  <TableCell>{p.Club}</TableCell>
                  <TableCell>{p.Grade}</TableCell>
                  <TableCell>{p.Nationalite}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Button onClick={() => navigate('/dashboard')}>Retour à l'accueil</Button>
    </div>
  );
}
