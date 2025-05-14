import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

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
  Genre?: { NomGenre: string };
  Grade?: { NomGrade: string };
  Club?: { NomClub: string };
  Nationalite?: { NomNationalite: string };
}

interface Grade {
  IdGrade: number;
  NomGrade: string;
}

interface Nationalite {
  IdNationalite: number;
  NomNationalite: string;
}

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

function getGenderSymbol(nomGenre?: string) {
  if (!nomGenre) return "";
  return nomGenre.toLowerCase() === "femme" ? "♀️" :
         nomGenre.toLowerCase() === "homme" ? "♂️" : "";
}

function getTrophee(classement: number) {
  switch (classement) {
    case 1: return "🏆";
    case 2: return "🥈";
    case 3: return "🥉";
    default: return "";
  }
}

function tournoiEstPasse(date: string, heure: string): boolean {
  const dateHeureTournoi = new Date(`${date}T${heure}`);
  return dateHeureTournoi < new Date();
}

export default function TournamentPage() {
  const { id } = useParams();
  const [filtre, setFiltre] = useState("");
  const [tournoi, setTournoi] = useState<Tournoi | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [nationalites, setNationalites] = useState<Nationalite[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    naissance: "",
    poids: "",
    genre: "1",
    grade: "",
    club: "",
    nationalite: ""
  });

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
        .select(`*,
          Grade:GradeParticipant(NomGrade),
          Club:ClubParticipant(NomClub),
          Nationalite:NationaliteParticipant(NomNationalite),
          Genre:GenreParticipant(NomGenre)`)
        .eq("TournoiParticipant", id)
        .order("ClassementParticipant", { ascending: true });

      setParticipants(participantsData ?? []);

      const { data: gradesData } = await supabase
        .from("Grade")
        .select("IdGrade, NomGrade")
        .order("NomGrade", { ascending: true });

      setGrades(gradesData ?? []);

      const { data: nationalitesData } = await supabase
        .from("Nationalite")
        .select("IdNationalite, NomNationalite")
        .order("NomNationalite", { ascending: true });

      setNationalites(nationalitesData ?? []);
    };

    loadData();
  }, [id]);

  const inscrireParticipant = async () => {
  if (!tournoi) return;

  // Vérifie si le participant existe déjà dans le même tournoi
  const { data: existingParticipant, error: checkError } = await supabase
    .from("Participant")
    .select("IdParticipant")
    .eq("NomParticipant", form.nom)
    .eq("PrenomParticipant", form.prenom)
    .eq("DateNaissanceParticipant", form.naissance)
    .eq("TournoiParticipant", tournoi.IdTournoi)
    .maybeSingle();

  if (checkError) {
    toast.error("Erreur lors de la vérification du participant");
    return;
  }

  if (existingParticipant) {
    toast.error("Ce participant est déjà inscrit à ce tournoi");
    return;
  }

  // Gestion du club
  let clubId: number | null = null;
  const { data: existingClub } = await supabase
    .from("Club")
    .select("IdClub")
    .eq("NomClub", form.club)
    .single();

  if (existingClub) {
    clubId = existingClub.IdClub;
  } else {
    const { data: newClub, error: insertError } = await supabase
      .from("Club")
      .insert({ NomClub: form.club })
      .select("IdClub")
      .single();

    if (insertError || !newClub) {
      toast.error("Erreur lors de l'enregistrement du club");
      return;
    }
    clubId = newClub.IdClub;
  }

  // Insertion du participant
  const { error } = await supabase.from("Participant").insert({
    NomParticipant: form.nom,
    PrenomParticipant: form.prenom,
    DateNaissanceParticipant: form.naissance,
    PoidsParticipant: parseFloat(form.poids),
    GenreParticipant: form.genre,
    GradeParticipant: form.grade,
    ClubParticipant: clubId,
    NationaliteParticipant: form.nationalite,
    TournoiParticipant: tournoi.IdTournoi,
  });

  if (error) {
    toast.error("Inscription échouée");
  } else {
    toast.success(`${form.prenom} ${form.nom} inscrit.`);
    setIsModalOpen(false);
  }
};

  const filtres = participants.filter((p) =>
    `${p.PrenomParticipant} ${p.NomParticipant}`.toLowerCase().includes(filtre.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-extrabold text-primary">{tournoi?.NomTournoi}</h1>

      {tournoi && (
        <div className="text-base text-muted-foreground space-y-1">
          <p><strong>Date :</strong> {formatDateFr(tournoi.DateTournoi)}</p>
          <p><strong>Heure :</strong> {formatHeureFr(tournoi.HeureTournoi)}</p>
          <p><strong>Lieu :</strong> {tournoi.LieuTournoi}</p>
        </div>
      )}

      {tournoi && !tournoiEstPasse(tournoi.DateTournoi, tournoi.HeureTournoi) && (
        <div className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold text-green-700">Inscriptions ouvertes</h2>
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            S'inscrire à ce tournoi
          </button>
        </div>
      )}

      <Input
        placeholder="Rechercher un participant..."
        value={filtre}
        onChange={(e) => setFiltre(e.target.value)}
        className="max-w-md border"
      />

      <Card className="shadow-lg">
        <CardContent className="p-0">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Nom</TableHead>
                {tournoi && tournoiEstPasse(tournoi.DateTournoi, tournoi.HeureTournoi) && (
                  <>
                    <TableHead>Classement</TableHead>
                    <TableHead>Ippons</TableHead>
                    <TableHead>Keikokus</TableHead>
                  </>
                )}
                <TableHead>Genre</TableHead>
                <TableHead>Naissance</TableHead>
                <TableHead>Poids</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Nationalité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtres.map((p) => (
                <TableRow key={p.IdParticipant}>
                  <TableCell>{p.PrenomParticipant} {p.NomParticipant}</TableCell>
                  {tournoi && tournoiEstPasse(tournoi.DateTournoi, tournoi.HeureTournoi) && (
                    <>
                      <TableCell>{getTrophee(p.ClassementParticipant)} {p.ClassementParticipant}</TableCell>
                      <TableCell>{p.IpponsParticipant}</TableCell>
                      <TableCell>{p.KeikokusParticipant}</TableCell>
                    </>
                  )}
                  <TableCell>{getGenderSymbol(p.Genre?.NomGenre)} {p.Genre?.NomGenre}</TableCell>
                  <TableCell>{p.DateNaissanceParticipant}</TableCell>
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscription au tournoi</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div><Label>Prénom</Label><Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
            <div><Label>Nom</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
            <div><Label>Date de naissance</Label><Input type="date" value={form.naissance} onChange={(e) => setForm({ ...form, naissance: e.target.value })} /></div>
            <div><Label>Poids (kg)</Label><Input type="number" value={form.poids} onChange={(e) => setForm({ ...form, poids: e.target.value })} /></div>
            <div>
              <Label>Genre</Label>
              <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="w-full border rounded px-2 py-1">
                <option value="1">Homme</option>
                <option value="2">Femme</option>
              </select>
            </div>
            <div>
              <Label>Grade</Label>
              <select value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full border rounded px-2 py-1">
                <option value="">-- Sélectionner un grade --</option>
                {grades.map((g) => (
                  <option key={g.IdGrade} value={g.IdGrade}>{g.NomGrade}</option>
                ))}
              </select>
            </div>
            <div><Label>Club</Label><Input value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })} placeholder="Nom du club" /></div>
            <div>
              <Label>Nationalité</Label>
              <select value={form.nationalite} onChange={(e) => setForm({ ...form, nationalite: e.target.value })} className="w-full border rounded px-2 py-1">
                <option value="">-- Sélectionner une nationalité --</option>
                {nationalites.map((n) => (
                  <option key={n.IdNationalite} value={n.IdNationalite}>{n.NomNationalite}</option>
                ))}
              </select>
            </div>
            <button
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={inscrireParticipant}
            >
              Valider l'inscription
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
