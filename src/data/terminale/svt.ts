import { Lesson, Quiz } from "../../types";

export const SVT_TERMINALE_LESSONS: Lesson[] = [
  {
    id: "term_svt_ch1",
    subject: "SVT",
    grade: "Terminale",
    chapterNo: 1,
    chapterTitle: "Génétique Formelle et Transmission des Caractères",
    title: "Génétique Formelle, Lois de Mendel et Hérédité Humaine (Monohybridisme & Dihybridisme)",
    pdfAvailable: true,
    readingTime: 30,
    isPublished: true,
    sections: [
      {
        title: "1. Présentation, Compétences visées & Prérequis",
        content: `### 🎯 Compétences Visées
- Analyser les croisements mendéliens (monohybridisme et dihybridisme) et interpréter les proportions phénotypiques (3/1, 1/1, 9/3/3/1, 1/1/1/1).
- Établir l'échiquier de croisement et déterminer le génotype des parents et des descendants.
- Analyser un arbre généalogique humain (pédigrée) pour déterminer si une maladie génétique (ex: drépanocytose, hémophilie) est dominante, récessive, autosomique ou liée aux chromosomes sexuels (X/Y).

---

### 📋 Objectifs Pédagogiques
1. Différencier allèle dominant, récessive, codominant et létal.
2. Comprendre le rôle du brassage intrachromosomique (crossing-over / enjambement à la méiose) et du brassage interchromosomique.
3. Calculer le taux de recombinaison pour évaluer la distance génétique entre deux gènes liés (en centimorgan cM).`
      },
      {
        title: "2. Cours Structuré & Définitions Clés",
        content: `### 📖 I. Les Lois Fondamentales de Mendel (Monohybridisme)

#### 1. Première Loi de Mendel (Uniformité des hybrides de F1)
Si l'on croise deux lignes pures ne différant que par un seul caractère, tous les individus de la première génération $F_1$ sont identiques (même phénotype $[A]$). L'allèle exprimé est **dominant** ($A$), l'autre est **récessif** ($a$).

#### 2. Deuxième Loi de Mendel (Ségrégation indépendante des allèles en F2)
Le croisement de deux hybrides $F_1 \\times F_1$ donne en $F_2$ les proportions phénotypiques :
- $75\\%$ (ou $3/4$) de phénotype dominant $[A]$
- $25\\%$ (ou $1/4$) de phénotype récessif $[a]$
- Génotypes en $F_2$ : $1/4 \\, AA$ (homozygote), $1/2 \\, Aa$ (hétérozygote), $1/4 \\, aa$ (homozygote).

#### 3. Test-Cross (Croisement de contrôle)
Consiste à croiser un individu au phénotype dominant avec un testeur homozygote récessif ($aa$).
- Si la descendance comprend $100\\%$ de $[A]$, l'individu était homozygote ($AA$).
- Si la descendance comprend $50\\%$ de $[A]$ et $50\\%$ de $[a]$, l'individu était hétérozygote ($Aa$).`
      },
      {
        title: "3. Exemple Concret Ivoirien (Drépanocytose) & Échiquier",
        content: `### 🇨🇮 Application Médicale en Côte d'Ivoire : La Drépanocytose
La **drépanocytose** (ou anémie falciforme) est une maladie héréditaire très fréquente en Afrique de l'Ouest. Elle est due à la mutation du gène codant la chaîne $\\beta$ de l'hémoglobine ($HbA \\to HbS$).
- L'allèle $HbA$ (hémoglobine normale) et l'allèle $HbS$ (hémoglobine drépanocytaire) sont codominants au niveau moléculaire.
- **Sujet sain homozygote** : $HbA // HbA$ (Phénotype $[A]$).
- **Sujet porteur sain (trait drépanocytaire)** : $HbA // HbS$ (Phénotype $[AS]$ - résistance naturelle au paludisme à *Plasmodium falciparum*).
- **Sujet drépanocytaire majeur** : $HbS // HbS$ (Phénotype $[S]$ - crises vaso-occlusives graves).

---

### 📊 Tableau de Croisement pour Parents Porteurs Sains (AS x AS)

| Gamètes Père / Mère | Gamète $HbA$ ($1/2$) | Gamète $HbS$ ($1/2$) |
| :--- | :--- | :--- |
| **Gamète $HbA$ ($1/2$)** | $HbA // HbA$ ($1/4$ - Sain $[A]$) | $HbA // HbS$ ($1/4$ - Porteur $[AS]$) |
| **Gamète $HbS$ ($1/2$)** | $HbA // HbS$ ($1/4$ - Porteur $[AS]$) | $HbS // HbS$ ($1/4$ - Malade $[S]$) |

*Conclusion clinique :* Deux parents hétérozygotes (AS) ont **1 chance sur 4 (25%)** à chaque grossesse d'avoir un enfant atteint de drépanocytose majeure (SS).`
      },
      {
        title: "4. Résumé, Points Clés & Erreurs Fréquentes",
        content: `### 📝 Résumé du Cours
La génétique formelle permet de prédire les risques de transmission des anomalies héréditaires. La méiose est la source biologique de la diversité génétique grâce aux brassages inter et intrachromosomiques.

### 🌟 Points Clés à Retenir
1. Un gène est dit **autosomique** s'il est porté par un autosome (chromosomes non sexuels 1 à 22).
2. Un gène est dit **gonosomique** s'il est porté par un chromosome sexuel ($X$ ou $Y$). L'hémophilie et le daltonisme sont des tares récessives portées par le chromosome $X$.
3. Chez l'homme ($XY$), tout allèle récessif porté par le chromosome $X$ s'exprime obligatoirement.

---

### ⚠️ Erreurs Fréquentes au BAC SVT
- Inverser les symboles du génotype : les allèles d'un même gène doivent être écrits sur la même paire de barres parallèles (ex: $\\frac{A}{a}$).
- Confondre le **phénotype** (noté entre crochets $[A]$) et le **génotype** (noté entre parenthèses ou sur barres $\\frac{A}{A}$).`
      },
      {
        title: "5. Exercices Progressifs & Corrigés Détaillés",
        content: `### 🏋️ Exercice d'Analyse d'Arbre Généalogique
Dans une famille d'Abidjan, un garçon est atteint d'hémophilie A, alors que ses deux parents ont une coagulation sanguine parfaitement normale.
1. La tare est-elle dominante ou récessive ?
2. Sachant que seuls les garçons sont touchés dans la famille élargie, sur quel chromosome est situé le gène ?
3. Déterminer le génotype de la mère.

#### 🔑 Corrigé Détaillé
1. Les parents sont sains et ont un enfant malade. L'allèle de la maladie était présent chez les parents mais masqué. Il est donc **récessif** ($h$). L'allèle normal est dominant ($H$).
2. La maladie touche quasi exclusivement les hommes et se transmet de mère portrice saine à ses fils. Le gène est porté par la partie spécifique du **chromosome sexuel $X$**.
3. Le garçon malade a pour génotype $X^h Y$. Son chromosome $Y$ provient de son père (qui est sain $X^H Y$). Son chromosome $X^h$ provient obligatoirement de sa mère. La mère étant saine, son génotype est hétérozygote conducteur : $X^H X^h$.`
      },
      {
        title: "6. Mini Quiz d'Auto-Évaluation (10 Questions)",
        content: `### ❓ Mini-Quiz : Génétique Formelle
1. **Question 1** : Qu'est-ce qu'un individu homozygote ?
   - *Réponse* : Un individu possédant deux allèles identiques pour un gène donné.
2. **Question 2** : Quelles sont les proportions phénotypiques d'un croisement $F_1 \\times F_1$ en monohybridisme avec dominance absolue ?
   - *Réponse* : 3/4 [Dominant] et 1/4 [Récessif] (soit 75% / 25%).
3. **Question 3** : Sur quel chromosome est situé le gène responsable de la drépanocytose ?
   - *Réponse* : Sur un autosome (chromosome 11).
4. **Question 4** : Quel est le pourcentage théorique d'enfants malades (SS) pour un couple de porteurs sains (AS x AS) ?
   - *Réponse* : 25% (1/4).
5. **Question 5** : Comment s'appelle l'échange de fragments de chromatides entre chromosomes homologues à la prophase I de méiose ?
   - *Réponse* : Le crossing-over (ou brassage intrachromosomique / enjambement).
6. **Question 6** : Qu'est-ce qu'un Test-cross ?
   - *Réponse* : Un croisement entre un individu de phénotype dominant et un testeur récessif homozygote.
7. **Question 7** : Quel est le génotype d'un homme hémophile ?
   - *Réponse* : $X^h Y$.
8. **Question 8** : Comment s'écrit conventionnellement un phénotype ?
   - *Réponse* : Entre crochets, ex : $[A]$.
9. **Question 9** : Si deux gènes sont situés sur la même paire de chromosomes, dit-on qu'ils sont indépendants ou liés ?
   - *Réponse* : Ils sont dits gènes liés (linkage).
10. **Question 10** : Combien de chromosomes possède une cellule somatique humaine normale ?
    - *Réponse* : 46 chromosomes (23 paires).`
      }
    ]
  },
  {
    id: "term_svt_ch2",
    subject: "SVT",
    grade: "Terminale",
    chapterNo: 2,
    chapterTitle: "Le Système Immunitaire et la Défense de l'Organisme",
    title: "Immunologie, Réponse Immunitaire Spécifique et Infection au VIH/SIDA",
    pdfAvailable: true,
    readingTime: 30,
    isPublished: true,
    sections: [
      {
        title: "1. Présentation, Compétences visées & Prérequis",
        content: `### 🎯 Compétences Visées
- Expliquer les mécanismes de l'immunité innée (phagocytose, réaction inflammatoire) et de l'immunité adaptative (spécifique à médiation humorale et cellulaire).
- Analyser la cinétique de l'infection par le VIH (Virus de l'Immunodéficience Humaine) et le mode de destruction progressive des lymphocytes T4 ($LT_4$).
- Argumenter scientifiquement sur l'efficacité des vaccins, des sérums et des trithérapies antirétrovirales (ARV).

---

### 📋 Objectifs Pédagogiques
1. Différencier Lymphocytes $B$ (producteurs d'anticorps plasmocytes) et Lymphocytes $T_8$ cytotoxiques ($LTC$).
2. Comprendre le rôle pivot des Lymphocytes $T_4$ ($LT_4$) et de l'interleukine 2 ($IL-2$).
3. Expliquer le principe du test sérologique ELISA et du Western-Blot.`
      },
      {
        title: "2. Cours Structuré & Définitions Clés",
        content: `### 📖 I. L'Immunité Adaptative (Spécifique)

#### 1. La Réponse Immunitaire à Médiation Humorale (RIMH)
- **Acteurs principaux** : Lymphocytes $B$ ($LB$), devenant Plasmocytes après sélection clonale et différenciation.
- **Effecteurs** : Les **anticorps** (ou immunoglobulines $Ig$) sécrétés dans le plasma.
- **Mode d'action** : Neutralisation de l'antigène circulant par formation d'un **complexe d'immuno-précipitation** (ou complexe antigène-anticorps), suivi de l'élimination par phagocytose.

#### 2. La Réponse Immunitaire à Médiation Cellulaire (RIMC)
- **Acteurs principaux** : Lymphocytes $T_8$ ($LT_8$).
- **Effecteurs** : Lymphocytes $T$ Cytotoxiques ($LTC$).
- **Mode d'action** : Destruction ciblée des cellules infectées par des virus ou des cellules cancéreuses par injection de perforine et granzymes (**baiser de la mort** / apoptose).

#### 3. Le Rôle Pivot des $LT_4$ (Chef d'orchestre)
Les $LT_4$ reconnaissent l'antigène présenté par les Cellules Présentatrices d'Antigène (CPA) et sécrètent de l'**Interleukine 2** ($IL-2$), une médiateur chimique indispensable à la stimulation et prolifération des $LB$ et $LT_8$.`
      },
      {
        title: "3. Infection au VIH & Cinétique Clinique",
        content: `### 🇨🇮 Cinétique de l'Infection VIH et Évolution vers le SIDA
Le VIH est un rétrovirus qui cible électivement les cellules portant le récepteur $CD4$, principalement les **Lymphocytes $LT_4$**.

> **1. PHASE DE PRIMO-INFECTION (Semaines 1 à 8)**
> - Réplication virale intense (charge virale élevée)
> - Chute transitoire des LT4
> - Apparition des anticorps anti-VIH (Séropositivité)
>
> **2. PHASE D'ASYMPTOMATIQUE (2 à 10 ans)**
> - Lutte efficace du système immunitaire (LTC et anticorps)
> - Diminution lente et progressive du taux de LT4 (de 1000 à 200 mm³)
> - Absence de symptômes cliniques majeurs
>
> **3. PHASE DE SIDA DÉCLARÉ (LT4 < 200 / mm³)**
> - Effondrement des défenses immunitaires (Carence en IL-2)
> - Développement d'infections opportunistes (Tuberculose, Candidose)
> - Issue fatale sans traitement Antirétroviral (ARV)`
      },
      {
        title: "4. Résumé, Points Clés & Erreurs Fréquentes",
        content: `### 📝 Résumé du Cours
L'immunité adaptative repose sur la coopération cellulaire entre CPA, $LT_4$, $LB$ et $LT_8$. La destruction des $LT_4$ par le VIH paralyse l'ensemble de la réponse immunitaire.

### 🌟 Points Clés à Retenir
1. La **vaccination** apporte une immunité **active**, spécifique et **durable** grâce à la mémoire immunitaire.
2. La **sérothérapie** apporte une protection **passive**, immédiate mais **temporaire** (injection directe d'anticorps).
3. Être séropositif signifie posséder dans son sang des anticorps spécifiques dirigés contre le VIH.`
      },
      {
        title: "5. Exercices Progressifs & Corrigés Détaillés",
        content: `### 🏋️ Exercice d'Analyse Expérimentale
On injecte à une souris de la toxine tétanique. Elle meurt. Si on lui injecte préalablement du sérum d'une souris guérie du tétanos, elle survit. Si on lui injecte du sérum d'une souris guérie de la diphtérie, elle meurt du tétanos.
1. Déduire la nature du milieu protecteur contenu dans le sérum.
2. Expliquer pourquoi le sérum anti-diphtérique ne protège pas contre le tétanos.

#### 🔑 Corrigé Détaillé
1. Le sérum de la souris guérie du tétanos contient des **anticorps spécifiques** sériques dirigés contre la toxine tétanique. C'est la preuve de l'existence d'une **réponse immunitaire à médiation humorale**.
2. Les anticorps sont **strictement spécifiques** de l'antigène qui a suscité leur formation. Les anticorps anti-diphtériques ont une conformation spatiale incapable de se fixer sur la toxine tétanique (absence de complémentarité spatiale).`
      },
      {
        title: "6. Mini Quiz d'Auto-Évaluation (10 Questions)",
        content: `### ❓ Mini-Quiz : Immunologie et VIH
1. **Question 1** : Quelle cellule immunitaire est spécifiquement ciblée par le VIH ?
   - *Réponse* : Le lymphocyte $LT_4$ (porteur du marqueur CD4).
2. **Question 2** : Quel type de lymphocytes fabrique et sécrète les anticorps ?
   - *Réponse* : Les plasmocytes (issus de la différenciation des lymphocytes B).
3. **Question 3** : Quelle molécule sécrétée par les $LT_4$ stimule la prolifération des autres lymphocytes ?
   - *Réponse* : L'interleukine 2 ($IL-2$).
4. **Question 4** : Que signifie être "séropositif" pour le VIH ?
   - *Réponse* : Présenter dans son sérum sanguin des anticorps dirigés contre les protéines du VIH.
5. **Question 5** : Quelle est la différence majeure entre un vaccin et un sérum ?
   - *Réponse* : Le vaccin stimule une immunité active et durable ; le sérum apporte des anticorps immédiats mais temporaires.
6. **Question 6** : Quel organe lymphoïde central est le lieu de maturation des lymphocytes T ?
   - *Réponse* : Le thymus (T comme Thymus).
7. **Question 7** : Où mûrissent les lymphocytes B chez l'Homme ?
   - *Réponse* : Dans la moelle osseuse (B comme Bone marrow).
8. **Question 8** : Comment les $LTC$ détruisent-ils les cellules infectées ?
   - *Réponse* : Par libération de perforine générant une lyse cellulaire (apoptose).
9. **Question 9** : Quel est le seuil critique de $LT_4$ en dessous duquel apparaissent les maladies opportunistes ?
   - *Réponse* : $200$ $LT_4$ par $\\text{mm}^3$ de sang.
10. **Question 10** : Quelle est l'enzyme du VIH qui permet de transformer son ARN viral en ADN ?
    - *Réponse* : La transcriptase inverse (ou réverse transcriptase).`
      }
    ]
  }
];

export const SVT_TERMINALE_QUIZZES: Quiz[] = [
  {
    id: "quiz_term_svt_ch1",
    title: "Quiz Bac - Génétique Formelle et Hérédité",
    subject: "SVT",
    grade: "Terminale",
    chapterNo: 1,
    chapterTitle: "Génétique Formelle et Transmission des Caractères",
    difficulty: "moyen",
    durationMinutes: 15,
    questions: [
      { id: "q1", type: "qcm", questionText: "Quelles sont les proportions phénotypiques de F2 dans un croisement F1 x F1 en monohybridisme autosomique avec dominance ?", options: ["75% [Dominant] et 25% [Récessif]", "50% [Dominant] et 50% [Récessif]", "100% [Dominant]", "9/16, 3/16, 3/16, 1/16"], correctAnswer: "75% [Dominant] et 25% [Récessif]", explanation: "La 2e loi de Mendel prédit les proportions 3/4 et 1/4." },
      { id: "q2", type: "qcm", questionText: "Quel est le risque de drépanocytose SS pour un couple de porteurs sains (AS x AS) ?", options: ["25% (1/4)", "50% (1/2)", "0%", "100%"], correctAnswer: "25% (1/4)", explanation: "À chaque grossesse, il y a 1 chance sur 4 de transmettre deux allèles S." },
      { id: "q3", type: "qcm", questionText: "Si une tare héréditaire récessive est portée par le chromosome sexuel X, qui la transmet préférentiellement aux fils ?", options: ["La mère conductrice saine (XH Xh)", "Le père sain", "Le grand-père paternel", "Les sœurs"], correctAnswer: "La mère conductrice saine (XH Xh)", explanation: "Les fils reçoivent leur unique chromosome X de leur mère." },
      { id: "q4", type: "qcm", questionText: "Comment appelle-t-on l'ensemble des allèles portés par un individu pour un ou plusieurs gènes ?", options: ["Le génotype", "Le phénotype", "Le caryotype", "Le génome"], correctAnswer: "Le génotype", explanation: "Le génotype est la constitution allélique exacte de l'individu." },
      { id: "q5", type: "vrai_faux", questionText: "Le test-cross permet de déterminer le génotype d'un individu exprimant un phénotype dominant.", options: ["Vrai", "Faux"], correctAnswer: "Vrai", explanation: "On le croise avec un testeur récessif homozygote." },
      { id: "q6", type: "qcm", questionText: "Combien de chromosomes sexuels (gonosomes) possède une cellule somatique humaine normale ?", options: ["2 (XX chez la femme, XY chez l'homme)", "23", "46", "4"], correctAnswer: "2 (XX chez la femme, XY chez l'homme)", explanation: "1 paire de chromosomes sexuels sur les 23 paires au total." },
      { id: "q7", type: "qcm", questionText: "À quelle étape de la méiose se déroule le crossing-over ?", options: ["Prophase I", "Anaphase II", "Métaphase I", "Télophase II"], correctAnswer: "Prophase I", explanation: "C'est l'appariement des chromosomes homologues en tétrades en Prophase I." },
      { id: "q8", type: "vrai_faux", questionText: "La drépanocytose est une maladie génétique liée au chromosome X.", options: ["Vrai", "Faux"], correctAnswer: "Faux", explanation: "Elle est autosomique récessive (gène porté par le chromosome 11)." },
      { id: "q9", type: "qcm", questionText: "Comment note-t-on le phénotype d'un individu ?", options: ["Entre crochets : [A]", "Entre parenthèses : (A)", "Sur deux barres : A//a", "En majuscule simple"], correctAnswer: "Entre crochets : [A]", explanation: "La convention scientifique impose les crochets pour le phénotype." },
      { id: "q10", type: "qcm", questionText: "Quelles sont les proportions obtenues lors du test-cross d'un hétérozygote pour deux gènes indépendants ?", options: ["25%, 25%, 25%, 25% (1/1/1/1)", "9/16, 3/16, 3/16, 1/16", "50%, 50%", "75%, 25%"], correctAnswer: "25%, 25%, 25%, 25% (1/1/1/1)", explanation: "Les 4 types de gamètes produits à égalité donnent 4 phénotypes équiprobables." }
    ]
  }
];
