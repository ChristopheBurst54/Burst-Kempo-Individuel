import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Participant {
  nom: string;
  classement: number;
  points: number;
  fautes: number;
  genre: "H" | "F";
  age: number;
  taille: number; // en cm
  poids: number; // en kg
  categorie: string;
}

const participants: Participant[] = [
  {
    nom: "Jean Dupont",
    classement: 1,
    points: 150,
    fautes: 2,
    genre: "H",
    age: 28,
    taille: 180,
    poids: 75,
    categorie: "Senior A",
  },
  {
    nom: "Marie Curie",
    classement: 2,
    points: 145,
    fautes: 1,
    genre: "F",
    age: 30,
    taille: 165,
    poids: 60,
    categorie: "Senior A",
  },
  // Ajouter d'autres participants ici
];

const tournoiInfos = {
    date: "2025-06-15",
    heure: "14:00",
    lieu: "Gymnase Municipal, Metz",
  };

export default function TournoiPage() {
  const [filtre, setFiltre] = useState("");

  const filtrés = participants.filter((p) =>
    p.nom.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Visualisation du Tournoi</h1>

      <div className="text-sm text-gray-600">
        <p><strong>Date :</strong> {tournoiInfos.date}</p>
        <p><strong>Heure :</strong> {tournoiInfos.heure}</p>
        <p><strong>Lieu :</strong> {tournoiInfos.lieu}</p>
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
                <TableHead>Points</TableHead>
                <TableHead>Fautes</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Taille (cm)</TableHead>
                <TableHead>Poids (kg)</TableHead>
                <TableHead>Catégorie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrés.map((p) => (
                <TableRow key={p.nom}>
                  <TableCell>{p.nom}</TableCell>
                  <TableCell>{p.classement}</TableCell>
                  <TableCell>{p.points}</TableCell>
                  <TableCell>{p.fautes}</TableCell>
                  <TableCell>{p.genre}</TableCell>
                  <TableCell>{p.age}</TableCell>
                  <TableCell>{p.taille}</TableCell>
                  <TableCell>{p.poids}</TableCell>
                  <TableCell>{p.categorie}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
