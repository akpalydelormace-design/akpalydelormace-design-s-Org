import { Lesson, Quiz } from "../../types";

export const PC_TERMINALE_LESSONS: Lesson[] = [
  {
    id: "term_pc_ch1",
    subject: "Physique-Chimie",
    grade: "Terminale",
    chapterNo: 1,
    chapterTitle: "Lois de Newton et Dynamique des Systèmes",
    title: "Cinématique et Dynamique du Point Matériel : Mouvement d'un Projectile et Lois de Newton",
    pdfAvailable: true,
    readingTime: 30,
    isPublished: true,
    sections: [
      {
        title: "1. Présentation, Compétences visées & Prérequis",
        content: `### 🎯 Compétences Visées
- Appliquer la 2ème loi de Newton (Théorème du centre d'inertie) dans un référentiel galiléen.
- Établir les équations horaires du mouvement, l'équation de la trajectoire parabolique d'un projectile lancé avec une vitesse initiale $v_0$ faisant un angle $\\alpha$ avec l'horizontale.
- Déterminer la portée maximale $x_P$ et la flèche $y_F$ d'un projectile.

---

### 📋 Objectifs Pédagogiques
1. Projeter la relation vectorielle $\\sum \\vec{F}_{ext} = m \\vec{a}$ sur un repère d'Espace $(O, \\vec{i}, \\vec{j})$.
2. Démontrer que le mouvement d'un projectile dans un champ de pesanteur uniforme est une parabole contenue dans le plan d'injection.
3. Déterminer les composantes du vecteur vitesse $\\vec{v}(t)$ et du vecteur position $\\vec{OM}(t)$ par intégration successive.`
      },
      {
        title: "2. Cours Structuré & Définitions Clés",
        content: `### 📖 I. La Deuxième Loi de Newton (Principe Fondamental de la Dynamique)

Dans un référentiel galiléen, la somme vectorielle des forces extérieures appliquées à un système de masse $m$ est égale au produit de sa masse par le vecteur accélération de son centre d'inertie :
$$\\sum \\vec{F}_{ext} = m \\vec{a}_G$$

---

### 📖 II. Mouvement d'un Projectile dans le Champ de Pesanteur Uniforme $\\vec{g}$

#### 1. Bilan des forces et vecteur accélération
Un projectile de masse $m$ lancé à $t=0$ depuis l'origine $O$ avec une vitesse $\\vec{v}_0$ n'est soumis qu'à son propre poids $\\vec{P} = m \\vec{g}$ (en négligeant les frottements de l'air).
$$m \\vec{a} = m \\vec{g} \\implies \\vec{a} = \\vec{g}$$

#### 2. Projection dans le repère $(O, x, y)$
Si $\\vec{v}_0 = (v_0 \\cos\\alpha) \\vec{i} + (v_0 \\sin\\alpha) \\vec{j}$ et $\\vec{g} = 0 \\vec{i} - g \\vec{j}$ :
- **Accélération** : $a_x = 0, \\quad a_y = -g$
- **Vitesse $\\vec{v}(t)$** : $v_x(t) = v_0 \\cos\\alpha, \\quad v_y(t) = -g t + v_0 \\sin\\alpha$
- **Position $\\vec{OM}(t)$** : $x(t) = (v_0 \\cos\\alpha) t, \\quad y(t) = -\\frac{1}{2} g t^2 + (v_0 \\sin\\alpha) t$

#### 3. Équation de la Trajectoire
En exprimant $t = \\frac{x}{v_0 \\cos\\alpha}$ et en injectant dans $y(t)$ :
$$y(x) = -\\frac{g}{2 v_0^2 \\cos^2\\alpha} x^2 + (\\tan\\alpha) x$$
Il s'agit d'une **parabole** orientée vers le bas.`
      },
      {
        title: "3. Exemple Concret Ivoirien & Formules Majeures",
        content: `### 🇨🇮 Exemple d'Application Concrète (Tir au But au Stade Félix Houphouët-Boigny)
Un joueur de football frappe le ballon depuis le sol ($y_0=0$) avec une vitesse initiale $v_0 = 20 \\text{ m/s}$ sous un angle $\\alpha = 30^\\circ$ ($g = 9,8 \\text{ m/s}^2$).

---

### 📊 Tableau Récapitulatif des Caractéristiques du Mouvement

| Grandeur Physique | Formule Générale | Calcul pour le Football ($v_0=20, \\alpha=30^\\circ$) |
| :--- | :--- | :--- |
| **Flèche $y_F$ (Hauteur maximale)** | $y_F = \\frac{v_0^2 \\sin^2\\alpha}{2g}$ | $y_F = \\frac{20^2 \\cdot (0,5)^2}{2 \\cdot 9,8} = \\frac{100}{19,6} \\approx 5,10 \\text{ m}$ |
| **Portée $x_P$ (Distance au sol)** | $x_P = \\frac{v_0^2 \\sin(2\\alpha)}{g}$ | $x_P = \\frac{400 \\cdot \\sin(60^\\circ)}{9,8} = \\frac{400 \\cdot 0,866}{9,8} \\approx 35,34 \\text{ m}$ |
| **Portée Maximale** | Pour $\\alpha = 45^\\circ$ : $x_{P,max} = \\frac{v_0^2}{g}$ | $x_{P,max} = \\frac{400}{9,8} \\approx 40,82 \\text{ m}$ |`
      },
      {
        title: "4. Résumé, Points Clés & Erreurs Fréquentes",
        content: `### 📝 Résumé du Cours
Le mouvement d'un projectile sous l'action de la pesanteur est la combinaison d'un Mouvement Rectiligne Uniforme (MRU) sur l'axe horizontal $Ox$ et d'un Mouvement Uniformément Varié (MRUV) sur l'axe vertical $Oy$.

### 🌟 Points Clés à Retenir
1. L'accélération ne dépend pas de la masse de l'objet ($\\vec{a} = \\vec{g}$).
2. Au sommet de la trajectoire (la flèche), la vitesse verticale s'annule : $v_y = 0$.
3. La portée est maximale quand l'angle de tir vaut $\\alpha = 45^\\circ$.`
      },
      {
        title: "5. Exercices Progressifs & Corrigés Détaillés",
        content: `### 🏋️ Exercice d'Application (BAC)
Un projectile est lancé depuis le sol à $t=0$ avec $v_0 = 15 \\text{ m/s}$ et $\\alpha = 45^\\circ$ ($g = 10 \\text{ m/s}^2$).
1. Écrire l'équation de la trajectoire $y(x)$.
2. Calculer la distance de portée $x_P$.

#### 🔑 Corrigé Détaill'
1. $\\cos(45^\\circ) = \\sin(45^\\circ) = \\frac{\\sqrt{2}}{2}$.
   $v_0^2 \\cos^2(45^\\circ) = 225 \\cdot 0,5 = 112,5$.
   $y(x) = -\\frac{10}{2 \\cdot 112,5} x^2 + (1) x = -\\frac{1}{22,5} x^2 + x = -0,0444 x^2 + x$.
2. Portée : $y(x_P) = 0 \\iff x_P (-0,0444 x_P + 1) = 0 \\implies x_P = \\frac{1}{0,0444} = 22,5 \\text{ mètres}$.`
      },
      {
        title: "6. Mini Quiz d'Auto-Évaluation (10 Questions)",
        content: `### ❓ Mini-Quiz : Dynamique du Projectile
1. **Question 1** : Quelle est l'expression du poids d'un corps de masse $m$ ?
   - *Réponse* : $\\vec{P} = m \\vec{g}$.
2. **Question 2** : Que vaut le vecteur accélération d'un projectile en chute libre ?
   - *Réponse* : $\\vec{a} = \\vec{g}$ (orienté vers le bas).
3. **Question 3** : Quelle est la nature du mouvement du projectile projeté sur l'axe horizontal $Ox$ ?
   - *Réponse* : Un mouvement rectiligne uniforme (vitesse constante $v_x = v_0 \\cos\\alpha$).
4. **Question 4** : Que vaut la composante verticale de la vitesse $v_y$ au point le plus haut de la trajectoire (flèche) ?
   - *Réponse* : $v_y = 0$.
5. **Question 5** : Quel angle $\\alpha$ donne la portée maximale sur sol horizontal ?
   - *Réponse* : $\\alpha = 45^\\circ$ (car $\\sin(2\\alpha) = \\sin(90^\\circ) = 1$).
6. **Question 6** : L'accélération d'un projectile dépend-elle de sa masse ?
   - *Réponse* : Non, car $\\vec{a} = \\vec{g}$ est indépendante de $m$.
7. **Question 7** : Quelle est l'unité de l'accélération dans le Système International ?
   - *Réponse* : Le mètre par seconde carrée ($\\text{m/s}^2$ ou $\\text{m}\\cdot\\text{s}^{-2}$).
8. **Question 8** : Comment s'appelle le repère orthonormé dans lequel les lois de Newton sont vérifiées ?
   - *Réponse* : Un référentiel galiléen.
9. **Question 9** : Quelle est la forme géométrique de la trajectoire d'un projectile ?
   - *Réponse* : Une parabole.
10. **Question 10** : Que vaut $\\sum \\vec{F}_{ext}$ pour un solide en équilibre statique ?
    - *Réponse* : $\\vec{0}$ (Vecteur nul).`
      }
    ]
  },
  {
    id: "term_pc_ch2",
    subject: "Physique-Chimie",
    grade: "Terminale",
    chapterNo: 2,
    chapterTitle: "Réactions Acides-Bases et Mesure du pH",
    title: "Chimie des Solutions Aqueuses : Acides Forts, Acides Faibles, pH et Dosages Acido-Basiques",
    pdfAvailable: true,
    readingTime: 30,
    isPublished: true,
    sections: [
      {
        title: "1. Présentation, Compétences visées & Prérequis",
        content: `### 🎯 Compétences Visées
- Calculer le $pH$ de solutions d'acides forts, bases fortes, acides faibles et bases faibles.
- Déterminer la constante d'acidité $Ka$ et le $pKa$ d'un couple acide/base $AH/A^-$.
- Expliquer le déroulement d'un dosage $pH$-métrique, repérer le point d'équivalence $E(V_E, pH_E)$ et choisir l'indicateur coloré adéquat.`
      },
      {
        title: "2. Cours Structuré & Définitions Clés",
        content: `### 📖 I. Concepts fondamentaux du pH

#### 1. Définition du pH
Pour une solution aqueuse diluée ($[H_3O^+] < 10^{-1} \\text{ mol/L}$) :
$$pH = -\\log[H_3O^+] \\iff [H_3O^+] = 10^{-pH}$$

#### 2. Produit Ionique de l'Eau ($Ke$)
A $25^\\circ\\text{C}$, $Ke = [H_3O^+] \\cdot [HO^-] = 10^{-14} \\implies pKe = 14$.

---

### 📖 II. Acides Forts vs Acides Faibles

#### 1. Acide Fort (Ex: $HCl$)
Dissociation totale dans l'eau : $pH = -\\log C_a$.

#### 2. Acide Faible (Ex: $CH_3COOH$)
Dissociation partielle caractérisée par le $pKa$ :
$$AH + H_2O \\rightleftharpoons A^- + H_3O^+, \\quad Ka = \\frac{[A^-][H_3O^+]}{[AH]}$$
Relation d'Henderson-Hasselbalch :
$$pH = pKa + \\log\\left(\\frac{[A^-]}{[AH]}\\right)$$`
      },
      {
        title: "3. Exemple Concret Ivoirien (Qualité de l'Eau) & Courbe de Dosage",
        content: `### 🇨🇮 Application Chimique en Côte d'Ivoire (Contrôle Qualité de l'Eau de la SODECI)
La Société des Eaux de Côte d'Ivoire (SODECI) contrôle le $pH$ de l'eau potable qui doit se situer entre $6,5$ et $8,5$.
En laboratoire, le dosage de l'acide acétique dans le vinaigre local par la soude $NaOH$ ($C_b = 0,1 \\text{ mol/L}$) donne une courbe de $pH$ présentant un saut caractéristique à l'équivalence.

---

### 📊 Formules de pH des Solutions Aqueuses A 25°C

| Type de Solution | Équation du pH | Exemple |
| :--- | :--- | :--- |
| **Acide Fort** | $pH = -\\log C_a$ | Solution de $HCl$ $0,01 \\text{ M} \\implies pH = 2$ |
| **Base Forte** | $pH = 14 + \\log C_b$ | Solution de $NaOH$ $0,01 \\text{ M} \\implies pH = 12$ |
| **Acide Faible** | $pH = \\frac{1}{2} (pKa - \\log C_a)$ | Acide éthanoïque $pKa=4,8, C_a=0,1 \\text{ M} \\implies pH = 2,9$ |
| **Solution Tampon** | $pH = pKa$ (quand $[A^-] = [AH]$) | Mélange à la demi-équivalence du dosage |`
      },
      {
        title: "4. Résumé, Points Clés & Erreurs Fréquentes",
        content: `### 📝 Résumé du Cours
L'équivalence acido-basique est atteinte lorsque les réactifs sont introduits dans les proportions stœchiométriques : $n_{acide} = n_{base} \\iff C_a V_a = C_b V_{bE}$.

### 🌟 Points Clés à Retenir
1. À la **demi-équivalence** d'un dosage d'acide faible par une base forte, $pH = pKa$.
2. Une **solution tampon** résiste aux variations de $pH$ lors de l'ajout de petites quantités d'acide ou de base ou lors d'une dilution.`
      },
      {
        title: "5. Exercices Progressifs & Corrigés Détaillés",
        content: `### 🏋️ Exercice de Dosage (Type BAC)
On dose $V_a = 20 \\text{ mL}$ d'une solution d'acide chlorhydrique $HCl$ par une solution de soude $NaOH$ de concentration $C_b = 0,05 \\text{ mol/L}$. Le volume équivalent mesuré est $V_{bE} = 16 \\text{ mL}$.
Calculer la concentration $C_a$ de l'acide.

#### 🔑 Corrigé Détaillé
A l'équivalence : $C_a V_a = C_b V_{bE}$.
$$C_a = \\frac{C_b \\cdot V_{bE}}{V_a} = \\frac{0,05 \\cdot 16}{20} = \\frac{0,8}{20} = 0,04 \\text{ mol/L}$$`
      },
      {
        title: "6. Mini Quiz d'Auto-Évaluation (10 Questions)",
        content: `### ❓ Mini-Quiz : Acides et Bases
1. **Question 1** : Que vaut le produit ionique de l'eau $Ke$ à 25°C ?
   - *Réponse* : $10^{-14}$.
2. **Question 2** : Quelle est la formule du $pH$ pour un acide fort de concentration $C_a$ ?
   - *Réponse* : $pH = -\\log C_a$.
3. **Question 3** : Quelle relation lie $pKa$ et $Ka$ ?
   - *Réponse* : $pKa = -\\log Ka$.
4. **Question 4** : Que vaut le $pH$ de l'eau pure à 25°C ?
   - *Réponse* : $pH = 7$ (solution neutre).
5. **Question 5** : Que se passe-t-il au point de demi-équivalence lors du dosage d'un acide faible ?
   - *Réponse* : Le $pH$ de la solution est égal au $pKa$ du couple ($pH = pKa$).
6. **Question 6** : Quelle est l'équation de définition d'une base selon Brønsted ?
   - *Réponse* : Une espèce chimique capable d'accapter au moins un proton $H^+$.
7. **Question 7** : Quelle est la couleur de la phénolphtaléine en milieu basique ($pH > 10$) ?
   - *Réponse* : Rose fuchsia (ou violette).
8. **Question 8** : Comment varie le $pH$ d'une solution acide quand on la dilue avec de l'eau distillée ?
   - *Réponse* : Il augmente et se rapproche de 7.
9. **Question 9** : Quelle est la formule de la base conjuguée de l'acide éthanoïque $CH_3COOH$ ?
   - *Réponse* : L'ion éthanoate $CH_3COO^-$.
10. **Question 10** : Quelle est la condition d'équivalence pour un dosage monoacide - monobase ?
    - *Réponse* : $n_{acide} = n_{base} \\iff C_a V_a = C_b V_{bE}$.`
      }
    ]
  }
];

export const PC_TERMINALE_QUIZZES: Quiz[] = [
  {
    id: "quiz_term_pc_ch1",
    title: "Quiz Bac - Lois de Newton et Projectiles",
    subject: "Physique-Chimie",
    grade: "Terminale",
    chapterNo: 1,
    chapterTitle: "Lois de Newton et Dynamique des Systèmes",
    difficulty: "moyen",
    durationMinutes: 15,
    questions: [
      { id: "q1", type: "qcm", questionText: "Quelle est l'expression vectorielle de la 2ème loi de Newton ?", options: ["Sum F_ext = m * a", "F = m * v", "E_k = 1/2 m v^2", "P = m / g"], correctAnswer: "Sum F_ext = m * a", explanation: "Le théorème du centre d'inertie relie les forces à l'accélération." },
      { id: "q2", type: "qcm", questionText: "Dans le mouvement d'un projectile, quelle est l'accélération horizontale ax ?", options: ["0", "-g", "g * cos(alpha)", "v0"], correctAnswer: "0", explanation: "Aucune force n'agit horizontalement (frottements négligés), donc ax = 0." },
      { id: "q3", type: "qcm", questionText: "Quel angle d'injection alpha donne la portée maximale du projectile ?", options: ["45°", "30°", "60°", "90°"], correctAnswer: "45°", explanation: "La formule contient sin(2*alpha), maximal pour 2*alpha = 90° soit alpha = 45°." },
      { id: "q4", type: "qcm", questionText: "Quelle est la forme de la trajectoire d'un projectile lancé dans le champ g uniforme ?", options: ["Parabolique", "Circulaire", "Hyperbolique", "Elliptique"], correctAnswer: "Parabolique", explanation: "L'équation y(x) est un polynôme du 2nd degré en x." },
      { id: "q5", type: "vrai_faux", questionText: "Au sommet de la trajectoire, la vitesse totale du projectile est nulle.", options: ["Vrai", "Faux"], correctAnswer: "Faux", explanation: "Seule la composante vy est nulle ; la composante vx = v0*cos(alpha) persiste." },
      { id: "q6", type: "qcm", questionText: "Que vaut la constante Ka d'un acide fort ?", options: ["Très grande (Ka >> 1)", "Ka < 10^-14", "Ka = 1", "Ka = 0"], correctAnswer: "Très grande (Ka >> 1)", explanation: "Un acide fort se dissocie totalement dans l'eau." },
      { id: "q7", type: "qcm", questionText: "Que vaut le pH d'une solution d'acide fort HCl de concentration Ca = 0,001 mol/L ?", options: ["3", "1", "11", "7"], correctAnswer: "3", explanation: "pH = -log(0,001) = -log(10^-3) = 3." },
      { id: "q8", type: "qcm", questionText: "À la demi-équivalence d'un dosage d'acide faible par une base forte, quelle égalité a-t-on ?", options: ["pH = pKa", "pH = 7", "pH = 14", "Ca = Cb"], correctAnswer: "pH = pKa", explanation: "Les concentrations de l'acide et de sa base conjuguée sont égales." },
      { id: "q9", type: "vrai_faux", questionText: "L'addition d'eau distillée dans une solution tampon modifie fortement son pH.", options: ["Vrai", "Faux"], correctAnswer: "Faux", explanation: "Une solution tampon résiste aux variations de pH lors de la dilution." },
      { id: "q10", type: "qcm", questionText: "Quelle est la formule de la concentration molaire C à partir de la masse m et de la masse molaire M ?", options: ["C = m / (M * V)", "C = m * M * V", "C = M / (m * V)", "C = V / (m * M)"], correctAnswer: "C = m / (M * V)", explanation: "Car n = m / M et C = n / V." }
    ]
  }
];
