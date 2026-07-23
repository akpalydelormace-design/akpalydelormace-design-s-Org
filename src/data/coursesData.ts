import { Lesson, Subject, Grade } from "../types";

export const CURRICULUM_OUTLINE: Record<Grade, Record<Subject, { chapterNo: number; title: string }[]>> = {
  "2nde": {
    "Mathématiques": [
      { chapterNo: 1, title: "Ensembles et Applications" },
      { chapterNo: 2, title: "Fonctions Numériques : Généralités" },
      { chapterNo: 3, title: "Vecteurs et Géométrie Analytique du Plan" },
    ],
    "Français": [
      { chapterNo: 1, title: "Le Texte Argumentatif : Fondements" },
      { chapterNo: 2, title: "L'Introduction au Genre Théâtral" },
      { chapterNo: 3, title: "La Poésie Lyrique et ses Procédés" },
    ],
    "Anglais": [
      { chapterNo: 1, title: "Education and Values in Society" },
      { chapterNo: 2, title: "Science and Modern Technology" },
      { chapterNo: 3, title: "The Impact of Social Media" },
    ],
    "SVT": [
      { chapterNo: 1, title: "La Cellule et l'Organisation du Vivant" },
      { chapterNo: 2, title: "Les Écosystèmes et les Interactions Biologiques" },
      { chapterNo: 3, title: "La Dynamique Interne de la Terre" },
    ],
    "Physique-Chimie": [
      { chapterNo: 1, title: "Mouvements, Forces et Lois Physiques" },
      { chapterNo: 2, title: "Structure Générale de l'Atome et Classification" },
      { chapterNo: 3, title: "Solutions Aqueuses et Notions de Concentration" },
    ],
    "Philosophie": [
      { chapterNo: 1, title: "Initiation à la Pensée Critique et Logique" },
      { chapterNo: 2, title: "Mythe, Sagesse Africaine et Philosophie" },
      { chapterNo: 3, title: "Méthodologie de la Dissertation Philosophique" },
    ],
    "Histoire-Géographie": [
      { chapterNo: 1, title: "Les Origines de l'Humanité et Préhistoire" },
      { chapterNo: 2, title: "Les Grands Empires de l'Afrique Ancienne" },
      { chapterNo: 3, title: "Introduction à la Géographie Économique de la CI" },
    ],
  },
  "1ère": {
    "Mathématiques": [
      { chapterNo: 1, title: "Équations, Inéquations et Systèmes Linéaires" },
      { chapterNo: 2, title: "Dérivabilité, Limites et Études de Fonctions" },
      { chapterNo: 3, title: "Suites Numériques (Arithmétiques et Géométriques)" },
    ],
    "Français": [
      { chapterNo: 1, title: "La Dissertation Littéraire : Méthodologie" },
      { chapterNo: 2, title: "Le Commentaire Composé de Textes Poétiques" },
      { chapterNo: 3, title: "Le Roman et les Esthétiques Littéraires" },
    ],
    "Anglais": [
      { chapterNo: 1, title: "Human Rights and Gender Equality" },
      { chapterNo: 2, title: "Cultural Heritage and Tourism" },
      { chapterNo: 3, title: "Environmental Protection and Pollution" },
    ],
    "SVT": [
      { chapterNo: 1, title: "La Tectonique des Plaques et Phénomènes Associés" },
      { chapterNo: 2, title: "Anatomie, Physiologie et Reproduction Humaine" },
      { chapterNo: 3, title: "Les Ressources Géologiques de la Côte d'Ivoire" },
    ],
    "Physique-Chimie": [
      { chapterNo: 1, title: "Énergie Cinétique, Potentielle et Mécanique" },
      { chapterNo: 2, title: "Optique Géométrique : Lentilles Minces" },
      { chapterNo: 3, title: "Introduction à la Chimie Organique : Hydrocarbures" },
    ],
    "Philosophie": [
      { chapterNo: 1, title: "L'Émergence Historique de la Philosophie" },
      { chapterNo: 2, title: "Le Problème de l'Homme : Nature et Culture" },
      { chapterNo: 3, title: "La Connaissance et l'Esprit Scientifique" },
    ],
    "Histoire-Géographie": [
      { chapterNo: 1, title: "La Colonisation Européenne en Afrique" },
      { chapterNo: 2, title: "Les Guerres Mondiales et l'Afrique" },
      { chapterNo: 3, title: "Le Relief, le Climat et l'Hydrographie de la CI" },
    ],
  },
  "Terminale": {
    "Mathématiques": [
      { chapterNo: 1, title: "Limites, Continuité et Théorème des Valeurs Intermédiaires" },
      { chapterNo: 2, title: "Les Fonctions Logarithmes et Exponentielles" },
      { chapterNo: 3, title: "Calcul Intégral et Équations Différentielles" },
      { chapterNo: 4, title: "Les Nombres Complexes" },
    ],
    "Français": [
      { chapterNo: 1, title: "L'Étude d'une Œuvre Théâtrale Intégrale" },
      { chapterNo: 2, title: "L'Argumentation Complexe dans l'Essai Littéraire" },
      { chapterNo: 3, title: "Méthodologie du Baccalauréat : Dissertation et Commentaire" },
    ],
    "Anglais": [
      { chapterNo: 1, title: "Leadership, Politics and Democracy" },
      { chapterNo: 2, title: "Globalization and Economic Challenges" },
      { chapterNo: 3, title: "Professional Integration and Job Hunting" },
    ],
    "SVT": [
      { chapterNo: 1, title: "Génétique Formelle et Transmission des Caractères" },
      { chapterNo: 2, title: "Le Système Immunitaire et la Défense de l'Organisme" },
      { chapterNo: 3, title: "Régulation de la Glycémie et Diabète" },
    ],
    "Physique-Chimie": [
      { chapterNo: 1, title: "Lois de Newton et Dynamique des Systèmes" },
      { chapterNo: 2, title: "Oscillateurs Mécaniques et Électriques" },
      { chapterNo: 3, title: "Réactions Acides-Bases et pH des Solutions" },
      { chapterNo: 4, title: "Estérification et Hydrolyse des Composés" },
    ],
    "Philosophie": [
      { chapterNo: 1, title: "L'Histoire et l'Idée de Progrès" },
      { chapterNo: 2, title: "L'État, la Justice et la Liberté Individuelle" },
      { chapterNo: 3, title: "La Métaphysique, la Religion et la Croyance" },
      { chapterNo: 4, title: "La Science, la Vérité et la Technologie" },
    ],
    "Histoire-Géographie": [
      { chapterNo: 1, title: "La Décolonisation Africaine et l'Éveil National" },
      { chapterNo: 2, title: "La Côte d'Ivoire de 1960 à nos jours : Politique et Social" },
      { chapterNo: 3, title: "La Côte d'Ivoire dans la Mondialisation Économique" },
    ],
  },
};

export const SAMPLE_LESSONS: Lesson[] = [];
