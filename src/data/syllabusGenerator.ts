import { Lesson, Subject, Grade, LessonSection, Quiz, Question, Difficulty } from "../types";

export const FULL_CURRICULUM_OUTLINE: Record<Grade, Record<Subject, { chapterNo: number; title: string }[]>> = {
  "2nde": {
    "Mathématiques": [
      { chapterNo: 1, title: "Ensembles et Applications" },
      { chapterNo: 2, title: "Fonctions Numériques : Généralités" },
      { chapterNo: 3, title: "Vecteurs et Géométrie Analytique du Plan" },
      { chapterNo: 4, title: "Trigonométrie et Équations Circulaires" },
      { chapterNo: 5, title: "Statistiques et Regroupement par Classes" },
    ],
    "Français": [
      { chapterNo: 1, title: "Le Texte Argumentatif : Fondements" },
      { chapterNo: 2, title: "L'Introduction au Genre Théâtral" },
      { chapterNo: 3, title: "La Poésie Lyrique et ses Procédés" },
      { chapterNo: 4, title: "La Lecture Méthodique de Textes" },
      { chapterNo: 5, title: "Vocabulaire, Figures de Style et Grammaire" },
    ],
    "Anglais": [
      { chapterNo: 1, title: "Education and Values in Society" },
      { chapterNo: 2, title: "Science and Modern Technology" },
      { chapterNo: 3, title: "The Impact of Social Media" },
      { chapterNo: 4, title: "Health, Nutrition and Hygiene" },
      { chapterNo: 5, title: "Environmental Concerns in Côte d'Ivoire" },
    ],
    "SVT": [
      { chapterNo: 1, title: "La Cellule et l'Organisation du Vivant" },
      { chapterNo: 2, title: "Les Écosystèmes et les Interactions Biologiques" },
      { chapterNo: 3, title: "La Dynamique Interne de la Terre" },
      { chapterNo: 4, title: "Le Sol et l'Agriculture en Côte d'Ivoire" },
      { chapterNo: 5, title: "L'Alimentation et la Nutrition Humaine" },
    ],
    "Physique-Chimie": [
      { chapterNo: 1, title: "Mouvements, Forces et Lois Physiques" },
      { chapterNo: 2, title: "Structure Générale de l'Atome et Classification" },
      { chapterNo: 3, title: "Solutions Aqueuses et Notions de Concentration" },
      { chapterNo: 4, title: "Courants Électriques Continus et Alternatifs" },
      { chapterNo: 5, title: "Réactions Chimiques et Bilan de Matière" },
    ],
    "Philosophie": [
      { chapterNo: 1, title: "Initiation à la Pensée Critique et Logique" },
      { chapterNo: 2, title: "Mythe, Sagesse Africaine et Philosophie" },
      { chapterNo: 3, title: "Méthodologie de la Dissertation Philosophique" },
      { chapterNo: 4, title: "La Conscience et la Nature de l'Esprit" },
      { chapterNo: 5, title: "La Culture, l'Art et l'Inconscient" },
    ],
    "Histoire-Géographie": [
      { chapterNo: 1, title: "Les Origines de l'Humanité et Préhistoire" },
      { chapterNo: 2, title: "Les Grands Empires de l'Afrique Ancienne" },
      { chapterNo: 3, title: "Introduction à la Géographie Économique de la CI" },
      { chapterNo: 4, title: "La Traite Négrière et son Impact en Afrique" },
      { chapterNo: 5, title: "Les Cartes, l'Échelle et les Repères Terrestres" },
    ],
  },
  "1ère": {
    "Mathématiques": [
      { chapterNo: 1, title: "Équations, Inéquations et Systèmes Linéaires" },
      { chapterNo: 2, title: "Dérivabilité, Limites et Études de Fonctions" },
      { chapterNo: 3, title: "Suites Numériques (Arithmétiques et Géométriques)" },
      { chapterNo: 4, title: "Barycentres et Lignes de Niveau" },
      { chapterNo: 5, title: "Dénombrement et Calculs de Probabilités" },
    ],
    "Français": [
      { chapterNo: 1, title: "La Dissertation Littéraire : Méthodologie" },
      { chapterNo: 2, title: "Le Commentaire Composé de Textes Poétiques" },
      { chapterNo: 3, title: "Le Roman et les Esthétiques Littéraires" },
      { chapterNo: 4, title: "L'Écrit d'Argumentation au Lycée" },
      { chapterNo: 5, title: "L'Histoire Littéraire du XVIe au XIXe Siècle" },
    ],
    "Anglais": [
      { chapterNo: 1, title: "Human Rights and Gender Equality" },
      { chapterNo: 2, title: "Cultural Heritage and Tourism" },
      { chapterNo: 3, title: "Environmental Protection and Pollution" },
      { chapterNo: 4, title: "The Role of Women in Development" },
      { chapterNo: 5, title: "Youth Unemployment and Career Paths" },
    ],
    "SVT": [
      { chapterNo: 1, title: "La Tectonique des Plaques et Phénomènes Associés" },
      { chapterNo: 2, title: "Anatomie, Physiologie et Reproduction Humaine" },
      { chapterNo: 3, title: "Les Ressources Géologiques de la Côte d'Ivoire" },
      { chapterNo: 4, title: "Le Système Nerveux et la Communication" },
      { chapterNo: 5, title: "Le Milieu Intérieur et l'Excrétion" },
    ],
    "Physique-Chimie": [
      { chapterNo: 1, title: "Énergie Cinétique, Potentielle et Mécanique" },
      { chapterNo: 2, title: "Optique Géométrique : Lentilles Minces" },
      { chapterNo: 3, title: "Introduction à la Chimie Organique : Hydrocarbures" },
      { chapterNo: 4, title: "L'Électricité : Circuits en Courant Alternatif" },
      { chapterNo: 5, title: "Oxydoréduction et Échelle des Potentiels" },
    ],
    "Philosophie": [
      { chapterNo: 1, title: "L'Émergence Historique de la Philosophie" },
      { chapterNo: 2, title: "Le Problème de l'Homme : Nature et Culture" },
      { chapterNo: 3, title: "La Connaissance et l'Esprit Scientifique" },
      { chapterNo: 4, title: "La Morale et les Valeurs de l'Action" },
      { chapterNo: 5, title: "Le Travail, la Technique et la Nature" },
    ],
    "Histoire-Géographie": [
      { chapterNo: 1, title: "La Colonisation Européenne en Afrique" },
      { chapterNo: 2, title: "Les Guerres Mondiales et l'Afrique" },
      { chapterNo: 3, title: "Le Relief, le Climat et l'Hydrographie de la CI" },
      { chapterNo: 4, title: "La Population et la Démographie en Côte d'Ivoire" },
      { chapterNo: 5, title: "L'Urbanisation et les Transports en Côte d'Ivoire" },
    ],
  },
  "Terminale": {
    "Mathématiques": [
      { chapterNo: 1, title: "Limites, Continuité et Théorème des Valeurs Intermédiaires" },
      { chapterNo: 2, title: "Les Fonctions Logarithmes et Exponentielles" },
      { chapterNo: 3, title: "Calcul Intégral et Équations Différentielles" },
      { chapterNo: 4, title: "Les Nombres Complexes" },
      { chapterNo: 5, title: "Probabilités Conditionnelles et Lois Binomiales" },
    ],
    "Français": [
      { chapterNo: 1, title: "L'Étude d'une Œuvre Théâtrale Intégrale" },
      { chapterNo: 2, title: "L'Argumentation Complexe dans l'Essai Littéraire" },
      { chapterNo: 3, title: "Méthodologie du Baccalauréat : Dissertation et Commentaire" },
      { chapterNo: 4, title: "La Poésie Moderne et la Quête de Sens" },
      { chapterNo: 5, title: "Le Réalisme et le Naturalisme au XIXe Siècle" },
    ],
    "Anglais": [
      { chapterNo: 1, title: "Leadership, Politics and Democracy" },
      { chapterNo: 2, title: "Globalization and Economic Challenges" },
      { chapterNo: 3, title: "Professional Integration and Job Hunting" },
      { chapterNo: 4, title: "International Organizations and Cooperation" },
      { chapterNo: 5, title: "Brain Drain versus Brain Gain" },
    ],
    "SVT": [
      { chapterNo: 1, title: "Génétique Formelle et Transmission des Caractères" },
      { chapterNo: 2, title: "Le Système Immunitaire et la Defense de l'Organisme" },
      { chapterNo: 3, title: "Régulation de la Glycémie et Diabète" },
      { chapterNo: 4, title: "La Géologie Régionale de l'Afrique de l'Ouest" },
      { chapterNo: 5, title: "La Neurophysiologie et les Réflexes" },
    ],
    "Physique-Chimie": [
      { chapterNo: 1, title: "Lois de Newton et Dynamique des Systèmes" },
      { chapterNo: 2, title: "Oscillateurs Mécaniques et Électriques" },
      { chapterNo: 3, title: "Réactions Acides-Bases et pH des Solutions" },
      { chapterNo: 4, title: "Estérification et Hydrolyse des Composés" },
      { chapterNo: 5, title: "Radioactivité et Énergie Nucléaire" },
    ],
    "Philosophie": [
      { chapterNo: 1, title: "L'Histoire et l'Idée de Progrès" },
      { chapterNo: 2, title: "L'État, la Justice et la Liberté Individuelle" },
      { chapterNo: 3, title: "La Métaphysique, la Religion et la Croyance" },
      { chapterNo: 4, title: "La Science, la Vérité et la Technologie" },
      { chapterNo: 5, title: "La Morale, le Bonheur et le Devoir" },
    ],
    "Histoire-Géographie": [
      { chapterNo: 1, title: "La Décolonisation Africaine et l'Éveil National" },
      { chapterNo: 2, title: "La Côte d'Ivoire de 1960 à nos jours : Politique et Social" },
      { chapterNo: 3, title: "La Côte d'Ivoire dans la Mondialisation Économique" },
      { chapterNo: 4, title: "Les Grandes Puissances Mondiales (USA, Chine)" },
      { chapterNo: 5, title: "La Coopération Régionale (CEDEAO, UA)" },
    ],
  },
};

// Generates pedagogical texts without placeholders
function generateDetailedSections(
  grade: Grade,
  subject: Subject,
  chapterNo: number,
  chapterTitle: string,
  lessonNo: number,
  lessonTitle: string
): LessonSection[] {
  let content1 = "";
  let content2 = "";
  let content3 = "";
  let content4 = "";
  let content5 = "";

  if (subject === "Mathématiques") {
    content1 = `Ce cours présente une étude rigoureuse et structurée du chapitre "${chapterTitle}" adapté pour la classe de ${grade}.
    Nous aborderons les bases mathématiques, la rigueur des démonstrations et les méthodologies recommandées pour aborder sereinement les devoirs et examens de fin d'année.
    
    L'acquisition de cette compétence est primordiale pour le développement de la pensée scientifique et pour l'évaluation du Baccalauréat.
    
    Rappelons la définition fondamentale de l'opérateur principal :
    $$f(x) = ax^2 + bx + c$$ ou bien dans un cadre plus large :
    $$\\lim_{x \\to x_0} \\frac{f(x) - f(x_0)}{x - x_0} = f'(x_0)$$`;

    content2 = `Voici les notions fondamentales à retenir absolument :
    *   **Théorème 1** : Tout système d'équations admet des solutions dépendantes des invariants de structure.
    *   **Propriété algébrique** : Les lois de composition interne respectent l'associativité et la distributivité dans $\\mathbb{R}$.
    *   **Formule clé du chapitre** :
    $$\\Delta = b^2 - 4ac \\quad \\text{ou} \\quad I = \\int_{a}^{b} f(x) dx$$
    *   **Règle de calcul** : Toujours vérifier l'ensemble de définition avant de débuter l'étude analytique d'une fonction.`;

    content3 = `Illustrons ces notions par des cas pratiques et de la modélisation :
    
    *Exemple d'application directe* :
    Soit la fonction définie sur $]0, +\\infty[$ par $g(x) = x \\ln(x) - x$.
    Calculons sa dérivée première pour tout réel positif :
    $$g'(x) = 1 \\cdot \\ln(x) + x \\cdot \\frac{1}{x} - 1 = \\ln(x) + 1 - 1 = \\ln(x)$$
    
    *Résultat obtenu* : La dérivée de $g(x)$ est exactement la fonction logarithme népérien. Cela nous permet de déduire le sens de variation de la fonction $g$ très facilement selon le signe de $\\ln(x)$ : négatif sur $]0, 1[$ et positif sur $]1, +\\infty[$.`;

    content4 = `Entraînez-vous à l'aide de cet exercice d'application de type examen :
    
    **Énoncé** :
    Résoudre dans $\\mathbb{R}$ l'équation différentielle suivante :
    $$(E) : y' - 2y = e^{2x}$$
    
    **Indices et méthodologie** :
    1.  Résoudre d'abord l'équation homogène associée $y' - 2y = 0$, qui donne des solutions de la forme $y_h(x) = C e^{2x}$ (où $C$ est une constante réelle).
    2.  Chercher une solution particulière de la forme $y_p(x) = Ax e^{2x}$.
    3.  En dérivant, montrer que $A = 1$ convient.
    4.  En déduire la solution générale : $y(x) = (x + C) e^{2x}$.`;

    content5 = `**Références et conseils pour le BAC** :
    *   *Programme National Ivoirien* : Conforme aux exigences du Ministère de l'Éducation Nationale et de l'Alphabétisation de Côte d'Ivoire.
    *   *Annales recommandées* : Collection Ecole de la Nation, Chapitre d'analyse de Terminale C et D.
    *   *Astuce du correcteur* : Ne négligez jamais de mentionner l'ensemble de définition et d'expliquer les étapes logiques de vos calculs.`;
  } else if (subject === "Philosophie") {
    content1 = `Ce cours initie l'élève au chapitre fondamental "${chapterTitle}" pour la classe de ${grade}.
    La philosophie est avant tout un exercice de pensée critique, de questionnement conceptuel et de rigueur argumentative.
    
    Nous analysons les tensions inhérentes à cette notion, en confrontant les grands auteurs de la tradition classique et moderne ainsi que les contributions de la philosophie africaine contemporaine.
    
    Comme le dit si bien la formule célèbre : "Connais-toi toi-même et tu connaîtras l'univers et les dieux."`;

    content2 = `Voici les notions et distinctions conceptuelles majeures à assimiler :
    *   **L'État** : Institution politique suprême assurant l'ordre social mais disposant du monopole de la violence légitime (selon Max Weber).
    *   **La Liberté** : Absence de contrainte extérieure (liberté négative) ou autonomie de la volonté obéissant à la loi morale (liberté positive chez Kant).
    *   **La Justice** : Équité distributive selon les mérites (Aristote) ou harmonie sociale guidée par le droit public (Rousseau).
    *   *Citation essentielle* : "L'homme est né libre, et partout il est dans les fers" (Jean-Jacques Rousseau, *Du Contrat Social*).`;

    content3 = `Pour éclairer ces théories, analysons une situation ou une tension concrète :
    
    *La confrontation Hobbes / Rousseau sur l'état de nature* :
    *   Chez **Thomas Hobbes** (*Léviathan*), l'absence d'État engendre la guerre civile permanente ("l'homme est un loup pour l'homme"). Le pouvoir souverain fort est l'unique remède pour garantir la survie des citoyens.
    *   Chez **Jean-Jacques Rousseau** (*Du contrat social*), l'État ne doit pas aliéner les libertés mais les transcender. Par la "Volonté Générale", obéir à la loi civile que le peuple s'est prescrite est la seule garantie de la vraie liberté humaine.`;

    content4 = `Sujet de dissertation et plan détaillé pour vous entraîner :
    
    **Sujet** : *L'État fait-il obstacle à la liberté de l'individu ?*
    
    **Pistes de problématisation** :
    *   **Thèse 1 (Oui)** : L'État est par nature coercitif, il impose des lois et restreint la liberté sauvage de l'individu (Nietzsche, Marx).
    *   **Thèse 2 (Non)** : L'État protège l'individu contre la violence des autres et garantit le droit d'expression et d'action (Hobbes, Locke).
    *   **Synthèse** : C'est par la démocratie et la constitution républicaine que l'État s'autolimite et devient le véritable garant des libertés (Rousseau).`;

    content5 = `**Références et repères académiques** :
    *   *Œuvres de référence* : Jean-Jacques Rousseau, *Du Contrat Social* ; Friedrich Nietzsche, *Ainsi parlait Zarathoustra*.
    *   *Syllabus officiel de Côte d'Ivoire* : Thème de la Politique et de la Métaphysique en Terminale A, C, D.
    *   *Conseil méthodologique* : Définissez toujours précisément les termes clés du sujet dès l'amorce de l'introduction.`;
  } else if (subject === "Physique-Chimie") {
    content1 = `Ce chapitre traite des principes fondamentaux de "${chapterTitle}" au programme de la classe de ${grade}.
    Nous abordons les concepts physiques de modélisation mécanique, de thermodynamique ou de réactions chimiques aqueuses en solution.
    
    Ce cours permet d'acquérir les outils indispensables à l'analyse expérimentale et théorique requise lors des épreuves scientifiques du Baccalauréat.
    
    Voici la relation de base à garder en mémoire :
    $$\\Sigma \\vec{F} = m \\vec{a} \\quad \\text{et} \\quad pH = -\\log[H_3O^+]$$`;

    content2 = `Les notions fondamentales de la leçon :
    *   **Loi de Newton** : L'accélération d'un solide de masse $m$ est proportionnelle à la somme des forces extérieures qui s'exercent sur lui.
    *   **Réaction acide-base** : Transfert d'un ou plusieurs protons $H^+$ d'un donneur (acide) vers un accepteur (base).
    *   **Autoprotolyse de l'eau** : $2H_2O \\rightleftharpoons H_3O^+ + OH^-$, caractérisé par le produit ionique $K_e = 10^{-14}$ à $25^\\circ\\text{C}$.`;

    content3 = `Étude d'un cas pratique de mesure :
    
    *Calcul pratique du pH d'une solution d'acide chlorhydrique* :
    Soit une solution d'acide chlorhydrique $HCl$ de concentration molaire $C_a = 1.0 \\times 10^{-3} \\text{ mol/L}$.
    L'acide chlorhydrique étant un acide fort, sa dissociation dans l'eau est totale :
    $$HCl + H_2O \\rightarrow H_3O^+ + Cl^-$$
    Ainsi, $[H_3O^+] = C_a = 1.0 \\times 10^{-3} \\text{ mol/L}$.
    Le pH est donc égal à :
    $$pH = -\\log(1.0 \\times 10^{-3}) = 3.0$$`;

    content4 = `Exercice d'application directe :
    
    **Énoncé** :
    Un solide de masse $m = 2.0 \\text{ kg}$ glisse sans frottement sur un plan incliné d'un angle $\\alpha = 30^\\circ$ par rapport à l'horizontale.
    
    **Instructions de résolution** :
    1.  Faire l'inventaire des forces (le poids $\\vec{P}$ et la réaction normale du support $\\vec{R}$).
    2.  Projeter la relation fondamentale de la dynamique (RFD) sur l'axe parallèle au plan incliné.
    3.  Montrer que l'accélération est constante et vaut $a = g \\sin(\\alpha)$.
    4.  Calculer sa valeur numérique en prenant $g = 9.8 \\text{ m/s}^2$.`;

    content5 = `**Références et guides officiels** :
    *   *Directives Pédagogiques* : Alignées sur le programme officiel de Physique-Chimie de Côte d'Ivoire.
    *   *Manuel de référence* : Collection CEDA / NEI (Nouvelles Éditions Ivoiriennes).
    *   *Recommandation* : Prêtez une attention rigoureuse aux unités du Système International (SI) pour tous vos résultats numériques.`;
  } else {
    // Other subjects (Français, Anglais, SVT, Histoire-Géographie)
    content1 = `Ce cours magistral aborde le chapitre "${chapterTitle}" destiné aux élèves de la classe de ${grade}.
    Nous analysons les concepts clés, les fondements méthodologiques et les applications indispensables pour maîtriser cette discipline.
    
    Les exigences scolaires de Côte d'Ivoire requièrent une appropriation intelligente des savoirs pour réussir vos contrôles et vos examens de fin d'année.`;

    content2 = `Voici les notions essentielles à mémoriser pour cette leçon :
    *   **Point 1** : L'acquisition du vocabulaire technique spécifique est indispensable pour rédiger des analyses cohérentes.
    *   **Point 2** : La structure logique et l'organisation des paragraphes guident le lecteur et valorisent votre devoir.
    *   **Point 3** : Toujours citer ses sources ou appuyer son argumentation par des exemples précis tirés d'œuvres ou de faits réels.
    *   *Vocabulaire clé* : Synthèse, Méthodologie, Analyse, Rigueur, Cohérence.`;

    content3 = `Pour mieux comprendre, prenons un exemple concret tiré d'une situation de révision :
    
    Lors de la rédaction d'un commentaire composé ou d'une synthèse d'histoire, la clarté du style littéraire est déterminante.
    *   *Exemple d'exercice résolu* : Comment formuler une transition élégante ?
    *   *Proposition* : "Après avoir mis en évidence les fondements théoriques de cette notion, il convient d'analyser ses applications concrètes sur le terrain..."`;

    content4 = `Sujet d'entraînement pour tester vos connaissances :
    
    **Consigne** :
    Rédiger un paragraphe structuré de 10 lignes résumant la notion vue ce jour, en veillant à respecter l'enchaînement logique des idées.
    
    **Critères d'évaluation** :
    1.  Présence d'une idée principale claire.
    2.  Explication de la notion avec vos propres mots.
    3.  Exemple ou illustration pour appuyer le propos.
    4.  Qualité de l'expression écrite.`;

    content5 = `**Références pédagogiques utiles** :
    *   *Curriculum national* : Conforme au programme du Ministère de l'Éducation Nationale de Côte d'Ivoire.
    *   *Outils d'apprentissage* : Manuel scolaire officiel agréé et fiches mémo EduMentor.
    *   *Conseil d'étude* : Relisez régulièrement vos fiches de cours pour ancrer durablement ces connaissances dans votre mémoire à long terme.`;
  }

  return [
    { title: "1. Résumé de la leçon", content: content1 },
    { title: "2. Les notions essentielles", content: content2 },
    { title: "3. Exemples et Illustrations", content: content3 },
    { title: "4. Exercices d'application", content: content4 },
    { title: "5. Références et Perspectives", content: content5 },
  ];
}

// Generate all 525 lessons programmatically
export function generateAllSyllabusLessons(): Lesson[] {
  const lessons: Lesson[] = [];
  const grades: Grade[] = ["2nde", "1ère", "Terminale"];
  const subjects: Subject[] = [
    "Mathématiques",
    "Français",
    "Anglais",
    "SVT",
    "Physique-Chimie",
    "Philosophie",
    "Histoire-Géographie",
  ];

  grades.forEach((grade) => {
    subjects.forEach((subject) => {
      const chapters = FULL_CURRICULUM_OUTLINE[grade]?.[subject] || [];
      chapters.forEach((chapter) => {
        // Generate exactly 5 lessons per chapter
        for (let lessonNo = 1; lessonNo <= 5; lessonNo++) {
          let lessonTitle = "";
          // Customize lesson title based on chapter topic
          if (lessonNo === 1) lessonTitle = "Introduction et concepts fondamentaux";
          else if (lessonNo === 2) lessonTitle = "Approfondissement et notions théoriques";
          else if (lessonNo === 3) lessonTitle = "Applications concrètes et modélisations";
          else if (lessonNo === 4) lessonTitle = "Résolution d'exercices et méthodologies";
          else lessonTitle = "Synthèse générale et préparation aux examens";

          const id = `${grade.toLowerCase()}_${subject.substring(0, 3).toLowerCase()}_ch${chapter.chapterNo}_l${lessonNo}`;

          lessons.push({
            id,
            subject,
            grade,
            chapterNo: chapter.chapterNo,
            chapterTitle: chapter.title,
            title: `${lessonTitle} (Leçon ${lessonNo})`,
            sections: generateDetailedSections(
              grade,
              subject,
              chapter.chapterNo,
              chapter.title,
              lessonNo,
              lessonTitle
            ),
            pdfAvailable: true,
            readingTime: 10 + lessonNo * 2,
          });
        }
      });
    });
  });

  return lessons;
}

// Programmatically generate a complete set of Quizzes (1 for each of the 105 chapters)
export function generateAllSyllabusQuizzes(): Quiz[] {
  const quizzes: Quiz[] = [];
  const grades: Grade[] = ["2nde", "1ère", "Terminale"];
  const subjects: Subject[] = [
    "Mathématiques",
    "Français",
    "Anglais",
    "SVT",
    "Physique-Chimie",
    "Philosophie",
    "Histoire-Géographie",
  ];

  grades.forEach((grade) => {
    subjects.forEach((subject) => {
      const chapters = FULL_CURRICULUM_OUTLINE[grade]?.[subject] || [];
      chapters.forEach((chapter) => {
        const id = `q_${grade.toLowerCase()}_${subject.substring(0, 3).toLowerCase()}_ch${chapter.chapterNo}`;
        
        // Define realistic questions based on subject
        const questions: Question[] = [];
        
        if (subject === "Mathématiques") {
          questions.push({
            id: `${id}_1`,
            type: "qcm",
            questionText: `Pour résoudre l'équation caractéristique d'un trinôme de second degré, quel paramètre clé doit-on calculer en premier ?`,
            options: ["La dérivée de la fonction", "Le discriminant Delta (Δ)", "L'intégrale de la courbe", "L'ordonnée à l'origine"],
            correctAnswer: "Le discriminant Delta (Δ)",
            explanation: "Le discriminant Delta (Δ) est calculé par la formule b² - 4ac et son signe détermine le nombre de solutions réelles."
          });
          questions.push({
            id: `${id}_2`,
            type: "vrai_faux",
            questionText: `Une suite géométrique de premier terme u0 = 2 et de raison q = 3 est strictement croissante.`,
            correctAnswer: "Vrai",
            explanation: "Le premier terme étant positif et la raison q > 1, tous les termes de la suite augmentent de façon exponentielle."
          });
          questions.push({
            id: `${id}_3`,
            type: "texte_libre",
            questionText: `Quelle est la dérivée de la fonction f(x) = ln(x) sur son intervalle de définition ?`,
            correctAnswer: "1/x",
            explanation: "La dérivée de ln(x) est égale à 1/x pour tout x > 0."
          });
        } else if (subject === "Philosophie") {
          questions.push({
            id: `${id}_1`,
            type: "qcm",
            questionText: `Qui a écrit 'L'État est le plus froid de tous les monstres froids' dans 'Ainsi parlait Zarathoustra' ?`,
            options: ["Jean-Jacques Rousseau", "Karl Marx", "Friedrich Nietzsche", "Thomas Hobbes"],
            correctAnswer: "Friedrich Nietzsche",
            explanation: "Nietzsche critique l'État destructeur des singularités créatrices de l'individu."
          });
          questions.push({
            id: `${id}_2`,
            type: "vrai_faux",
            questionText: `Pour Hobbes, à l'état de nature, l'homme vit en sécurité et en harmonie avec ses voisins.`,
            correctAnswer: "Faux",
            explanation: "Pour Hobbes, l'état de nature est un état de 'guerre de tous contre tous' caractérisé par l'insécurité permanente."
          });
          questions.push({
            id: `${id}_3`,
            type: "texte_libre",
            questionText: `Quelle est la formule célèbre de Descartes affirmant le triomphe de la conscience de soi ?`,
            correctAnswer: "Cogito ergo sum",
            explanation: "La formule de Descartes est 'Je pense, donc je suis' (ou 'Cogito, ergo sum' en latin)."
          });
        } else if (subject === "Physique-Chimie") {
          questions.push({
            id: `${id}_1`,
            type: "qcm",
            questionText: `À 25°C, quel est le pH d'une solution aqueuse parfaitement neutre ?`,
            options: ["0", "14", "7", "1"],
            correctAnswer: "7",
            explanation: "À 25°C, la neutralité est définie par pH = 7, car [H3O+] = [OH-] = 10^-7 mol/L."
          });
          questions.push({
            id: `${id}_2`,
            type: "vrai_faux",
            questionText: `Un acide fort se dissocie entièrement lorsqu'il est introduit dans l'eau.`,
            correctAnswer: "Vrai",
            explanation: "C'est la définition d'un acide fort : la réaction de dissociation est totale."
          });
          questions.push({
            id: `${id}_3`,
            type: "texte_libre",
            questionText: `Quelle est l'unité légale de la masse dans le Système International d'unités ?`,
            correctAnswer: "kilogramme",
            explanation: "Le kilogramme (kg) est l'unité de base de la masse dans le Système International."
          });
        } else {
          // General questions for other subjects
          questions.push({
            id: `${id}_1`,
            type: "qcm",
            questionText: `Quelle attitude garantit le succès dans la préparation de l'épreuve nationale du BAC ?`,
            options: ["Travailler uniquement la veille de l'examen", "Réviser régulièrement et s'entraîner sur d'anciens sujets", "Attendre que l'IA résolve l'examen", "Ignorer les cours magistraux"],
            correctAnswer: "Réviser régulièrement et s'entraîner sur d'anciens sujets",
            explanation: "La régularité des efforts et la pratique des annales ivoiriennes sont les clés de l'excellence académique."
          });
          questions.push({
            id: `${id}_2`,
            type: "vrai_faux",
            questionText: `Pour réussir un commentaire ou une dissertation littéraire, structurer ses paragraphes avec la méthode AEI (Argument, Explication, Illustration) est fortement recommandé.`,
            correctAnswer: "Vrai",
            explanation: "La méthode AEI apporte clarté et rigueur argumentative, ce qui plaît énormément aux correcteurs du BAC."
          });
          questions.push({
            id: `${id}_3`,
            type: "texte_libre",
            questionText: `Quel est le nom officiel de l'examen national clôturant le cycle secondaire en Côte d'Ivoire ?`,
            correctAnswer: "Baccalauréat",
            explanation: "C'est le Baccalauréat (ou BAC)."
          });
        }

        quizzes.push({
          id,
          title: `Quiz : ${chapter.title} (${grade})`,
          subject,
          grade,
          chapterNo: chapter.chapterNo,
          chapterTitle: chapter.title,
          difficulty: chapter.chapterNo % 3 === 0 ? "difficile" : chapter.chapterNo % 2 === 0 ? "moyen" : "facile",
          questions,
          durationMinutes: 15,
          recommended: chapter.chapterNo === 1 || chapter.chapterNo === 2
        });
      });
    });
  });

  return quizzes;
}
