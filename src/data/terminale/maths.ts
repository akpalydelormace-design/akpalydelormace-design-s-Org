import { Lesson, Quiz } from "../../types";

export const MATHS_TERMINALE_LESSONS: Lesson[] = [
  {
    id: "term_maths_ch1",
    subject: "Mathématiques",
    grade: "Terminale",
    chapterNo: 1,
    chapterTitle: "Limites, Continuité et Théorème des Valeurs Intermédiaires",
    title: "Limites, Continuité et Théorème des Valeurs Intermédiaires (TVI)",
    pdfAvailable: true,
    readingTime: 25,
    isPublished: true,
    sections: [
      {
        title: "1. Présentation, Compétences visées & Prérequis",
        content: `### 🎯 Compétences Visées
- Démontrer la continuité d'une fonction numérique en un point et sur un intervalle.
- Appliquer le Théorème des Valeurs Intermédiaires (TVI) et son corollaire de bijection pour prouver l'existence et l'unicité d'une solution à l'équation $f(x) = k$.
- Résoudre des problèmes d'optimisation et d'étude de comportement asymptotique liés aux activités économiques et logistiques en Côte d'Ivoire (ex: prévision du trafic au Port Autonome d'Abidjan).

---

### 📋 Objectifs Pédagogiques
1. Maîtriser le calcul des limites (formes indéterminées $\\frac{0}{0}, \\frac{\\infty}{\\infty}, 0 \\times \\infty, +\\infty - \\infty$).
2. Lever les formes indéterminées par factorisation par le terme prépondérant, conjugué ou taux de variation.
3. Déterminer l'image d'un intervalle par une fonction continue et strictement monotone.

---

### 🔑 Prérequis
- Opérations sur les limites en 1ère D/C.
- Notion de dérivée et sens de variation d'une fonction.
- Résolution des équations du 2nd degré dans $\\mathbb{R}$.`
      },
      {
        title: "2. Cours Structuré & Définitions Clés",
        content: `### 📖 I. Continuité d'une Fonction Numérique

#### 1. Définition en un point
Soit $f$ une fonction définie sur un intervalle $I$ contenant $x_0$.
$f$ est **continue en $x_0$** si et seulement si :
$$\\lim_{x \\to x_0} f(x) = f(x_0)$$

#### 2. Continuité sur un intervalle
- $f$ est continue sur un intervalle ouvert $]a, b[$ si elle est continue en tout point de cet intervalle.
- $f$ est continue sur $[a, b]$ si elle est continue sur $]a, b[$, continue à droite en $a$ ($\\lim_{x \\to a^+} f(x) = f(a)$) et continue à gauche en $b$ ($\\lim_{x \\to b^-} f(x) = f(b)$).

*Remarque :* Les fonctions polynômes, rationnelles, sinus et cosinus sont continues sur tout intervalle contenu dans leur ensemble de définition.

---

### 📐 II. Théorème des Valeurs Intermédiaires (TVI)

#### 1. Énoncé Général du TVI
Soit $f$ une fonction **continue** sur un intervalle $[a, b]$.
Pour tout réel $k$ compris entre $f(a)$ et $f(b)$, il existe **au moins un réel** $c \\in [a, b]$ tel que :
$$f(c) = k$$

#### 2. Corollaire du TVI (Théorème de la Bijection)
Si $f$ est **continue** et **strictement monotone** sur $[a, b]$, alors pour tout réel $k$ compris entre $f(a)$ et $f(b)$, l'équation $f(x) = k$ admet une **unique solution** $\\alpha \\in [a, b]$.
En particulier, si $f(a) \\times f(b) < 0$, l'équation $f(x) = 0$ admet une unique solution $\\alpha \\in ]a, b[$.`
      },
      {
        title: "3. Exemple Concret Ivoirien & Tableau Synthétique",
        content: `### 🇨🇮 Exemple d'Application Concrète (Économie Ivoirienne)
Une entreprise d'agro-alimentaire installée à Bouaké modélise le coût moyen de production d'huile de palme (en millions de FCFA) par la fonction :
$$C(x) = x + 4 + \\frac{9}{x}, \\quad x \\in [1, 10]$$
où $x$ représente la quantité de tonnes traitées par jour.
- $C$ est continue et strictement décroissante sur $[1, 3]$, puis strictement croissante sur $[3, 10]$.
- $C(1) = 14$, $C(3) = 10$, $C(10) = 14.9$.
- Par le corollaire du TVI, il existe une unique quantité $x_0 \\in [1, 3]$ pour laquelle le coût de production s'élève exactement à 12 millions de FCFA ($C(x_0) = 12$).

---

### 📊 Tableau des Formes Indéterminées (FI) et Méthodes de Levée

| Forme Indéterminée | Méthode Principale | Exemple Type |
| :--- | :--- | :--- |
| **$+ \\infty - \\infty$** | Factorisation par le terme prépondérant ou expression conjuguée | $\\lim_{x \\to +\\infty} (\\sqrt{x^2+1} - x)$ |
| **$\\frac{0}{0}$** | Factorisation par $(x - x_0)$ ou Taux de variation $f'(x_0)$ | $\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1} = 2$ |
| **$\\frac{\\infty}{\\infty}$** | Factorisation des termes de plus haut degré au numérateur et dénominateur | $\\lim_{x \\to +\\infty} \\frac{2x^2 + 3}{5x^2 - 1} = \\frac{2}{5}$ |
| **$0 \\times \\infty$** | Transformation en $\\frac{0}{1/\\infty}$ ou utilisation des croissances comparées | $\\lim_{x \\to 0^+} x \\ln(x) = 0$ |`
      },
      {
        title: "4. Résumé, Points Clés & Erreurs Fréquentes",
        content: `### 📝 Résumé du Cours
La continuité assure qu'une courbe peut être tracée "sans lever le crayon". Combinée à la stricte monotonie, elle garantit l'existence et l'unicité de solutions à des équations non linéaires via le TVI.

### 🌟 Points Clés à Retenir
1. Toujours vérifier les **2 conditions de la bijection** : 
   - $f$ est continue sur $I$.
   - $f$ est strictement monotone sur $I$.
2. Ne jamais oublier de calculer les limites aux bornes si l'intervalle est ouvert.
3. Si $f(a) \\times f(b) < 0$, alors $0$ est compris entre $f(a)$ et $f(b)$.

---

### ⚠️ Erreurs Fréquentes au Baccalauréat Ivoirien
- **Oublier la continuité** lors de la rédaction du TVI (perte de points systématique au BAC).
- Conclure à l'**unicité** sans avoir prouvé la **stricte monotonie**.
- Confondre la valeur de la racine $\\alpha$ (sur l'axe des abscisses) et son image $f(\\alpha) = 0$ (sur l'axe des ordonnées).

---

### 💡 Conseils Méthodologiques pour le BAC
Sur votre copie, rédigez ainsi :
*"La fonction $f$ est continue et strictement croissante sur $[1, 2]$. De plus, $f(1) = -3 < 0$ et $f(2) = 5 > 0$. Comme $0 \\in [f(1), f(2)]$, d'après le corollaire du TVI, l'équation $f(x) = 0$ admet une unique solution $\\alpha \\in ]1, 2[$."*`
      },
      {
        title: "5. Exercices Progressifs & Corrigés Détaillés",
        content: `### 🏋️ Exercice 1 (Niveau d'application)
Soit $f$ la fonction définie sur $\\mathbb{R}$ par : $f(x) = x^3 + 2x - 5$.
1. Montrer que $f$ est strictement croissante sur $\\mathbb{R}$.
2. Démontrer que l'équation $f(x) = 0$ admet une unique solution $\\alpha$ dans l'intervalle $[1, 2]$.

#### 🔑 Corrigé Détaillé Exercice 1
1. $f$ est une fonction polynôme, donc dérivable sur $\\mathbb{R}$. 
   Pour tout $x \\in \\mathbb{R}$, $f'(x) = 3x^2 + 2$.
   Comme $3x^2 \\ge 0$, on a $f'(x) \\ge 2 > 0$. Donc $f$ est strictement croissante sur $\\mathbb{R}$.
2. $f$ est continue sur $[1, 2]$ (car polynôme).
   $f$ est strictement croissante sur $[1, 2]$.
   $f(1) = 1^3 + 2(1) - 5 = -2$.
   $f(2) = 2^3 + 2(2) - 5 = 7$.
   On a $f(1) < 0 < f(2)$. D'après le corollaire du TVI, l'équation $f(x) = 0$ possède une unique solution $\\alpha \\in ]1, 2[$.

---

### 🏋️ Exercice 2 (Type BAC Ivoirien)
Soit la fonction $g(x) = \\frac{\\sqrt{x+4} - 2}{x}$ pour $x \\neq 0$ et $g(0) = a$.
Déterminer la valeur de $a$ pour que $g$ soit continue en $0$.

#### 🔑 Corrigé Détaillé Exercice 2
Pour que $g$ soit continue en $0$, il faut que $\\lim_{x \\to 0} g(x) = g(0) = a$.
Calculons $\\lim_{x \\to 0} \\frac{\\sqrt{x+4} - 2}{x}$ (Forme indéterminée $\\frac{0}{0}$).
Multiplions par l'expression conjuguée :
$$\\lim_{x \\to 0} \\frac{(\\sqrt{x+4} - 2)(\\sqrt{x+4} + 2)}{x(\\sqrt{x+4} + 2)} = \\lim_{x \\to 0} \\frac{(x+4) - 4}{x(\\sqrt{x+4} + 2)} = \\lim_{x \\to 0} \\frac{x}{x(\\sqrt{x+4} + 2)}$$
En simplifiant par $x$ pour $x \\neq 0$ :
$$\\lim_{x \\to 0} \\frac{1}{\\sqrt{x+4} + 2} = \\frac{1}{\\sqrt{4} + 2} = \\frac{1}{4}$$
Ainsi, la fonction $g$ est continue en $0$ si et seulement si $a = \\frac{1}{4}$.`
      },
      {
        title: "6. Mini Quiz d'Auto-Évaluation (10 Questions)",
        content: `### ❓ Mini-Quiz : Vérifiez vos connaissances sur les Limites et la Continuité
1. **Question 1** : Si $\\lim_{x \\to 2} f(x) = f(2)$, que peut-on dire de $f$ ?
   - *Réponse* : $f$ est continue au point $x_0 = 2$.
2. **Question 2** : Quelle est la condition indispensable pour appliquer le TVI ?
   - *Réponse* : La continuité de la fonction sur l'intervalle considéré.
3. **Question 3** : Quelle condition supplémentaire garantit l'unicité de la solution $\\alpha$ ?
   - *Réponse* : La stricte monotonie de la fonction.
4. **Question 4** : Quelle est la limite de $\\frac{\\sin(x)}{x}$ quand $x \\to 0$ ?
   - *Réponse* : $1$.
5. **Question 5** : Comment lève-t-on la FI $\\frac{0}{0}$ pour des expressions comportant des radicaux ?
   - *Réponse* : En multipliant et divisant par l'expression conjuguée.
6. **Question 6** : Si $f$ est continue sur $[a, b]$ et $f(a) \\times f(b) < 0$, combien de solutions au moins possède $f(x)=0$ ?
   - *Réponse* : Au moins une solution.
7. **Question 7** : Quel est l'ensemble de définition de la fonction $x \\mapsto \\sqrt{x-3}$ ?
   - *Réponse* : $[3, +\\infty[$.
8. **Question 8** : Si $f$ est strictement décroissante et continue sur $[1, 5]$ avec $f(1)=10$ et $f(5)=-2$, que vaut $f([1, 5])$ ?
   - *Réponse* : L'intervalle $[-2, 10]$.
9. **Question 9** : La fonction valeur absolue $x \\mapsto |x|$ est-elle continue en $0$ ?
   - *Réponse* : Oui, car $\\lim_{x \\to 0} |x| = 0 = |0|$.
10. **Question 10** : Peut-on appliquer le TVI à une fonction discontinue ?
    - *Réponse* : Non, le TVI exige la continuité.`
      }
    ]
  },
  {
    id: "term_maths_ch2",
    subject: "Mathématiques",
    grade: "Terminale",
    chapterNo: 2,
    chapterTitle: "Les Fonctions Logarithmes et Exponentielles",
    title: "Fonctions Logarithme Népérien (ln) et Exponentielle (exp)",
    pdfAvailable: true,
    readingTime: 30,
    isPublished: true,
    sections: [
      {
        title: "1. Présentation, Compétences visées & Prérequis",
        content: `### 🎯 Compétences Visées
- Étudier les propriétés algébriques et analytiques des fonctions $x \\mapsto \\ln(x)$ et $x \\mapsto e^x$.
- Résoudre des équations et inéquations comportant des logarithms et exponentielles.
- Modéliser des phénomènes d'accroissement démographique, de croissance économique et de remboursement d'emprunts bancaires en Côte d'Ivoire.

---

### 📋 Objectifs Pédagogiques
1. Utiliser les propriétés opératoires : $\\ln(a \\cdot b) = \\ln(a) + \\ln(b)$ et $e^{a+b} = e^a \\cdot e^b$.
2. Connaître par cœur les limites remarquables et les croissances comparées.
3. Dresser le tableau de variation et tracer les courbes représentatives $\\mathcal{C}_{\\ln}$ et $\\mathcal{C}_{\\exp}$.`
      },
      {
        title: "2. Cours Structuré & Définitions Clés",
        content: `### 📖 I. La Fonction Logarithme Népérien (ln)

#### 1. Définition
La fonction **logarithme népérien**, notée $\\ln$, est la primitive de la fonction $x \\mapsto \\frac{1}{x}$ sur $]0, +\\infty[$ qui s'annule en $1$.
$$\\mathcal{D}_{\\ln} = ]0, +\\infty[, \\quad \\ln(1) = 0, \\quad \\ln(e) = 1 \\quad (e \\approx 2,718)$$

#### 2. Propriétés Algébriques
Pour tous réels $a > 0$ et $b > 0$ et tout $r \\in \\mathbb{Q}$ :
- $\\ln(a \\cdot b) = \\ln(a) + \\ln(b)$
- $\\ln\\left(\\frac{a}{b}\\right) = \\ln(a) - \\ln(b)$
- $\\ln\\left(\\frac{1}{a}\\right) = -\\ln(a)$
- $\\ln(a^r) = r \\ln(a)$

#### 3. Limites et Croissances Comparées
- $\\lim_{x \\to 0^+} \\ln(x) = -\\infty$ et $\\lim_{x \\to +\\infty} \\ln(x) = +\\infty$
- $\\lim_{x \\to +\\infty} \\frac{\\ln(x)}{x} = 0$ et $\\lim_{x \\to 0^+} x \\ln(x) = 0$
- $\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = 1$

---

### 📖 II. La Fonction Exponentielle Naturelle (exp)

#### 1. Définition
La fonction **exponentielle**, notée $\\exp$ ou $x \\mapsto e^x$, est la bijection réciproque de la fonction $\\ln$.
$$\\mathcal{D}_{\\exp} = \\mathbb{R}, \\quad e^0 = 1, \\quad e^{\\ln(x)} = x \\quad (\\forall x > 0), \\quad \\ln(e^x) = x \\quad (\\forall x \\in \\mathbb{R})$$

#### 2. Propriétés et Limites
- $e^{a+b} = e^a \\cdot e^b$, $\\quad e^{a-b} = \\frac{e^a}{e^b}$, $\\quad (e^a)^n = e^{n a}$
- $\\lim_{x \\to -\\infty} e^x = 0$ et $\\lim_{x \\to +\\infty} e^x = +\\infty$
- $\\lim_{x \\to +\\infty} \\frac{e^x}{x} = +\\infty$ et $\\lim_{x \\to -\\infty} x e^x = 0$
- $\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1$`
      },
      {
        title: "3. Exemple Concret Ivoirien & Tableau de Comparaison",
        content: `### 🇨🇮 Exemple d'Application Concrète (Démographie de la Ville d'Abidjan)
La population de la métropole d'Abidjan (en millions d'habitants) est modélisée depuis l'année 2020 par :
$$P(t) = 5,2 \\cdot e^{0,035 t}$$
où $t$ représente le nombre d'années écoulées depuis 2020.
- Pour déterminer en quelle année la population dépassera 10 millions d'habitants, on résout l'équation $P(t) = 10$ :
$$5,2 e^{0,035 t} = 10 \\iff e^{0,035 t} = \\frac{10}{5,2} \\approx 1,923$$
En appliquant la fonction $\\ln$ :
$$0,035 t = \\ln(1,923) \\implies t = \\frac{\\ln(1,923)}{0,035} \\approx \\frac{0,6539}{0,035} \\approx 18,68 \\text{ ans}$$
La population d'Abidjan dépassera 10 millions d'habitants au cours de l'année **2038** ($2020 + 18,68$).

---

### 📊 Tableau Récapitulatif Dualité $\\ln$ vs $\\exp$

| Caractéristique | Logarithme Népérien ($\\ln$) | Exponentielle ($\\exp$) |
| :--- | :--- | :--- |
| **Ensemble de définition** | $]0, +\\infty[$ | $\\mathbb{R}$ |
| **Ensemble d'images** | $\\mathbb{R}$ | $]0, +\\infty[$ |
| **Dérivée** | $(\\ln x)' = \\frac{1}{x} > 0$ | $(e^x)' = e^x > 0$ |
| **Tangente remarquable** | En $x=1$ : $y = x - 1$ | En $x=0$ : $y = x + 1$ |
| **Croissance comparée avec $x$** | $\\ln(x)$ est dominée par $x$ en $+\\infty$ | $e^x$ domine $x$ en $+\\infty$ |`
      },
      {
        title: "4. Résumé, Points Clés & Erreurs Fréquentes",
        content: `### 📝 Résumé du Cours
Les fonctions $\\ln$ et $\\exp$ sont deux bijections réciproques fondamentales. La fonction exponentielle transforme les sommes en produits, tandis que la fonction logarithme transforme les produits en sommes.

### 🌟 Points Clés à Retenir
1. $e^x > 0$ pour tout $x \\in \\mathbb{R}$ (une exponentielle n'est jamais négative ni nulle !).
2. L'argument du logarithme doit être strictement positif : $\\ln(u(x))$ existe ssi $u(x) > 0$.
3. Pour la dérivée des composées :
   $$(\\ln(u(x)))' = \\frac{u'(x)}{u(x)}, \\quad (e^{u(x)})' = u'(x) e^{u(x)}$$

---

### ⚠️ Erreurs Fréquentes au BAC
- Écrire $\\ln(a+b) = \\ln(a) + \\ln(b)$ (FAUX ! $\\ln(a+b)$ ne se simplifie pas).
- Écrire $\\ln(-5)$ ou oublier l'ensemble de validité avant de résoudre des équations logarithmiques.
- Oublier que $e^x = -2$ n'a AUCUNE solution réelle.`
      },
      {
        title: "5. Exercices Progressifs & Corrigés Détaillés",
        content: `### 🏋️ Exercice 1 (Équations et Inéquations)
1. Résoudre dans $\\mathbb{R}$ : $\\ln(2x - 1) = \\ln(x + 3)$.
2. Résoudre dans $\\mathbb{R}$ : $e^{2x} - 3e^x + 2 = 0$.

#### 🔑 Corrigé Détaillé Exercice 1
1. *Domaine de validité* : $2x - 1 > 0 \\iff x > 1/2$ et $x + 3 > 0 \\iff x > -3$.
   L'ensemble de validité est $D_v = ]1/2, +\\infty[$.
   Pour $x \\in D_v$ :
   $$\\ln(2x - 1) = \\ln(x + 3) \\iff 2x - 1 = x + 3 \\iff x = 4$$
   Comme $4 \\in ]1/2, +\\infty[$, $S = \\{4\\}$.

2. Posons $X = e^x > 0$. L'équation devient $X^2 - 3X + 2 = 0$.
   Les racines sont $X_1 = 1$ et $X_2 = 2$.
   - $e^x = 1 \\iff x = \\ln(1) = 0$.
   - $e^x = 2 \\iff x = \\ln(2)$.
   L'ensemble des solutions est $S = \\{0, \\ln(2)\\}$.`
      },
      {
        title: "6. Mini Quiz d'Auto-Évaluation (10 Questions)",
        content: `### ❓ Mini-Quiz sur Logarithme et Exponentielle
1. **Question 1** : Que vaut $\\ln(e^5)$ ?
   - *Réponse* : $5$.
2. **Question 2** : Quel est le domaine de définition de $x \\mapsto \\ln(3-x)$ ?
   - *Réponse* : $]-\\infty, 3[$.
3. **Question 3** : Que vaut $\\lim_{x \\to +\\infty} \\frac{e^x}{x^2}$ ?
   - *Réponse* : $+\\infty$ (par croissances comparées).
4. **Question 4** : La fonction $x \\mapsto e^{-x}$ est-elle croissante ou décroissante sur $\\mathbb{R}$ ?
   - *Réponse* : Décroissante, car sa dérivée est $-e^{-x} < 0$.
5. **Question 5** : Simplifier $E = \\ln(8) - \\ln(2)$.
   - *Réponse* : $\\ln(8/2) = \\ln(4) = 2\\ln(2)$.
6. **Question 6** : Résoudre $e^x = -1$.
   - *Réponse* : Pas de solution ($S = \\emptyset$).
7. **Question 7** : Quelle est la dérivée de $x \\mapsto e^{x^2}$ ?
   - *Réponse* : $2x e^{x^2}$.
8. **Question 8** : Que vaut $\\lim_{x \\to 0^+} x \\ln(x)$ ?
   - *Réponse* : $0$.
9. **Question 9** : Si $\\ln(x) = 3$, que vaut $x$ ?
   - *Réponse* : $x = e^3$.
10. **Question 10** : Quelle est la tangente à la courbe de $e^x$ en $x=0$ ?
    - *Réponse* : La droite d'équation $y = x + 1$.`
      }
    ]
  },
  {
    id: "term_maths_ch3",
    subject: "Mathématiques",
    grade: "Terminale",
    chapterNo: 3,
    chapterTitle: "Calcul Intégral et Équations Différentielles",
    title: "Primitives, Calcul Intégral et Équations Différentielles",
    pdfAvailable: true,
    readingTime: 25,
    isPublished: true,
    sections: [
      {
        title: "1. Présentation, Compétences visées & Prérequis",
        content: `### 🎯 Compétences Visées
- Déterminer les primitives de fonctions usuelles et composées.
- Calculer une intégrale définie $\\int_a^b f(x) dx$ et interpréter géométriquement en termes d'aire de domaine.
- Résoudre les équations différentielles linéaires du 1er ordre $y' = ay + b$ et du 2nd ordre $y'' + \\omega^2 y = 0$.

---

### 📋 Objectifs Pédagogiques
1. Maîtriser l'intégration par parties (IPP) : $\\int u v' = [u v] - \\int u' v$.
2. Calculer des aires de régions planes délimitées par des courbes représentatives.
3. Résoudre des problèmes d'évolution continue (décroissance radioactive, vitesse de refroidissement d'un four à cacao).`
      },
      {
        title: "2. Cours Structuré & Définitions Clés",
        content: `### 📖 I. Primitives et Intégrales

#### 1. Définition d'une Primitive
Soit $f$ une fonction continue sur un intervalle $I$.
Une fonction $F$ est une **primitive de $f$ sur $I$** si $F$ est dérivable sur $I$ et pour tout $x \\in I$ :
$$F'(x) = f(x)$$

#### 2. Intégrale d'une Fonction
Si $F$ est une primitive de $f$ sur $[a, b]$, l'intégrale de $f$ de $a$ à $b$ est :
$$\\int_a^b f(x) dx = [F(x)]_a^b = F(b) - F(a)$$

#### 3. Formule d'Intégration par Parties (IPP)
Si $u$ et $v$ sont deux fonctions dérivables sur $[a, b]$ de dérivées continues $u'$ et $v'$ :
$$\\int_a^b u(x) v'(x) dx = [u(x) v(x)]_a^b - \\int_a^b u'(x) v(x) dx$$

---

### 📖 II. Équations Différentielles

#### 1. Équation $y' = a y$ ($a \\in \\mathbb{R}$)
Les solutions sur $\\mathbb{R}$ sont les fonctions de la forme :
$$y(x) = C e^{a x}, \\quad C \\in \\mathbb{R}$$

#### 2. Équation $y' = a y + b$ ($a \\neq 0$)
Les solutions générales sont :
$$y(x) = C e^{a x} - \\frac{b}{a}, \\quad C \\in \\mathbb{R}$$`
      },
      {
        title: "3. Exemple Concret Ivoirien & Formules Usuelles",
        content: `### 🇨🇮 Exemple d'Application Concrète (Séchage des Fèves de Cacao)
Dans une usine de conditionnement à San-Pédro, la température $T(t)$ (en °C) de séchage des fèves après $t$ heures vérifie l'équation différentielle :
$$T'(t) = -0,2 (T(t) - 25) \\iff T'(t) = -0,2 T(t) + 5$$
- La solution générale est $T(t) = C e^{-0,2 t} - \\frac{5}{-0,2} = C e^{-0,2 t} + 25$.
- Si la température initiale est $T(0) = 85^\\circ\\text{C}$, alors $C + 25 = 85 \\implies C = 60$.
- La loi de température est $T(t) = 60 e^{-0,2 t} + 25$.

---

### 📊 Tableau des Primitives Usuelles

| Fonction $f(x)$ | Primitive $F(x)$ | Condition |
| :--- | :--- | :--- |
| $x^n$ | $\\frac{x^{n+1}}{n+1}$ | $n \\neq -1$ |
| $\\frac{1}{x}$ | $\\ln|x|$ | $x \\neq 0$ |
| $e^{k x}$ | $\\frac{1}{k} e^{k x}$ | $k \\neq 0$ |
| $\\frac{u'(x)}{u(x)}$ | $\\ln|u(x)|$ | $u(x) \\neq 0$ |
| $u'(x) e^{u(x)}$ | $e^{u(x)}$ | Tout $x$ |
| $u'(x) u(x)^n$ | $\\frac{u(x)^{n+1}}{n+1}$ | $n \\neq -1$ |`
      },
      {
        title: "4. Résumé, Points Clés & Erreurs Fréquentes",
        content: `### 📝 Résumé du Cours
L'intégrale est l'opération inverse de la dérivation. Elle permet de mesurer des aires sous la courbe, des valeurs moyennes et de résoudre des équations où la fonction inconnue apparaît sous forme de dérivée.

### 🌟 Points Clés à Retenir
1. Propriété de linéarité : $\\int (\\alpha f + \\beta g) = \\alpha \\int f + \\beta \\int g$.
2. Relation de Chasles : $\\int_a^c f(x) dx = \\int_a^b f(x) dx + \\int_b^c f(x) dx$.
3. Une condition initiale $y(x_0) = y_0$ permet d'obtenir l'**unique** constante $C$ d'une équation différentielle.`
      },
      {
        title: "5. Exercices Progressifs & Corrigés Détaillés",
        content: `### 🏋️ Exercice 1 (Calcul d'intégrale par IPP)
Calculer $I = \\int_1^e x \\ln(x) dx$.

#### 🔑 Corrigé Détaillé
Posons $u(x) = \\ln(x) \\implies u'(x) = \\frac{1}{x}$.
Posons $v'(x) = x \\implies v(x) = \\frac{x^2}{2}$.
Par la formule d'IPP :
$$I = \\left[ \\frac{x^2}{2} \\ln(x) \\right]_1^e - \\int_1^e \\frac{x^2}{2} \\cdot \\frac{1}{x} dx = \\left( \\frac{e^2}{2} \\ln(e) - 0 \\right) - \\int_1^e \\frac{x}{2} dx$$
$$I = \\frac{e^2}{2} - \\left[ \\frac{x^2}{4} \\right]_1^e = \\frac{e^2}{2} - \\left( \\frac{e^2}{4} - \\frac{1}{4} \\right) = \\frac{e^2 + 1}{4}$$`
      },
      {
        title: "6. Mini Quiz d'Auto-Évaluation (10 Questions)",
        content: `### ❓ Mini-Quiz : Primitives et Intégrales
1. **Question 1** : Quelle est la primitive de $\\frac{1}{x}$ sur $]0, +\\infty[$ qui s'annule en 1 ?
   - *Réponse* : $\\ln(x)$.
2. **Question 2** : Que vaut $\\int_0^1 e^{2x} dx$ ?
   - *Réponse* : $\\frac{e^2 - 1}{2}$.
3. **Question 3** : Quelle est la solution générale de $y' = 3y$ ?
   - *Réponse* : $y(x) = C e^{3x}$.
4. **Question 4** : Que vaut $\\int_a^a f(x) dx$ ?
   - *Réponse* : $0$.
5. **Question 5** : Comment s'appelle la technique d'intégration basée sur $(uv)' = u'v + uv'$ ?
   - *Réponse* : L'intégration par parties (IPP).
6. **Question 6** : Si $f(x) \\ge 0$, que représente $\\int_a^b f(x) dx$ ?
   - *Réponse* : L'aire du domaine délimité par la courbe, l'axe des abscisses et les droites $x=a$ et $x=b$.
7. **Question 7** : Quelle est la valeur moyenne d'une fonction $f$ sur $[a, b]$ ?
   - *Réponse* : $\\mu = \\frac{1}{b-a} \\int_a^b f(x) dx$.
8. **Question 8** : Quelle est la primitive de $x \\mapsto 3x^2 - 4x + 1$ ?
   - *Réponse* : $x^3 - 2x^2 + x + C$.
9. **Question 9** : Résoudre $y' = -2y + 6$.
   - *Réponse* : $y(x) = C e^{-2x} + 3$.
10. **Question 10** : Quelle est la dérivée de $F(x) = \\int_a^x f(t) dt$ ?
    - *Réponse* : $F'(x) = f(x)$.`
      }
    ]
  },
  {
    id: "term_maths_ch4",
    subject: "Mathématiques",
    grade: "Terminale",
    chapterNo: 4,
    chapterTitle: "Les Nombres Complexes",
    title: "Nombres Complexes et Géométrie du Plan",
    pdfAvailable: true,
    readingTime: 30,
    isPublished: true,
    sections: [
      {
        title: "1. Présentation, Compétences visées & Prérequis",
        content: `### 🎯 Compétences Visées
- Effectuer les opérations dans l'ensemble $\\mathbb{C}$ (addition, multiplication, conjugaison, quotient).
- Passer de la forme algébrique $z = a + i b$ à la forme trigonométrique $z = r (\\cos\\theta + i \\sin\\theta)$ et exponentielle $z = r e^{i\\theta}$.
- Utiliser les nombres complexes pour résoudre des problèmes géométriques (alignement, orthogonalité, transformations du plan).

---

### 📋 Objectifs Pédagogiques
1. Résoudre des équations du second degré à coefficients réels ou complexes.
2. Utiliser le module $|z|$ pour calculer des distances et l'argument $\\arg(z)$ pour calculer des angles orientés.
3. Reconnaître l'écriture complexe d'une translation, d'une homothétie et d'une rotation.`
      },
      {
        title: "2. Cours Structuré & Définitions Clés",
        content: `### 📖 I. Formes d'un Nombre Complex

#### 1. Ensemble $\\mathbb{C}$ et Forme Algébrique
Il existe un ensemble $\\mathbb{C}$ contenant $\\mathbb{R}$ et un élément $i$ tel que $i^2 = -1$.
Tout complexe $z$ s'écrit de manière unique :
$$z = a + i b \\quad (a = \\text{Re}(z), \\, b = \\text{Im}(z))$$
- Conjugué : $\\bar{z} = a - i b$.
- Module : $|z| = \\sqrt{a^2 + b^2} = \\sqrt{z \\bar{z}}$.

#### 2. Forme Trigonométrique et Exponentielle
Pour $z \\neq 0$, $z = r e^{i \\theta} = r (\\cos \\theta + i \\sin \\theta)$ où $r = |z|$ et $\\theta \\equiv \\arg(z) \\pmod{2\\pi}$.
- Formules d'Euler : $\\cos\\theta = \\frac{e^{i\\theta} + e^{-i\\theta}}{2}$ et $\\sin\\theta = \\frac{e^{i\\theta} - e^{-i\\theta}}{2i}$.
- Formule de Moivre : $(\\cos\\theta + i \\sin\\theta)^n = \\cos(n\\theta) + i \\sin(n\\theta)$.`
      },
      {
        title: "3. Exemple Géométrique & Tableau des Transformations",
        content: `### 🇨🇮 Application Géométrique (Topographie et Aménagement du Territoire)
Au plan d'urbanisme de la commune de Yopougon, trois repères géodésiques sont placés aux points d'affixes :
$$z_A = 1 + i, \\quad z_B = 3 + 3i, \\quad z_C = 2 - i$$
Pour vérifier si la parcelle $ABC$ forme un triangle rectangle en $A$ :
$$\\frac{z_C - z_A}{z_B - z_A} = \\frac{(2-i) - (1+i)}{(3+3i) - (1+i)} = \\frac{1 - 2i}{2 + 2i} = \\frac{(1-2i)(2-2i)}{8} = \\frac{-2 - 6i}{8} = -\\frac{1}{4} - \\frac{3}{4}i$$
On calcule son argument pour mesurer l'angle $(\\vec{AB}, \\vec{AC})$.

---

### 📊 Transformations Géométriques et Écritures Complexes

| Transformation | Écriture Complexe $z' = f(z)$ | Paramètres |
| :--- | :--- | :--- |
| **Translation** | $z' = z + b$ | Vecteur $\\vec{u}$ d'affixe $b$ |
| **Homothétie** | $z' - z_0 = k (z - z_0)$ | Centre $\\Omega(z_0)$, rapport $k \\in \\mathbb{R}^*$ |
| **Rotation** | $z' - z_0 = e^{i \\theta} (z - z_0)$ | Centre $\\Omega(z_0)$, angle $\\theta$ |
| **Similitude Directe** | $z' = a z + b$ ($a \\in \\mathbb{C}^*$) | Rapport $|a|$, angle $\\arg(a)$, centre $\\Omega\\left(\\frac{b}{1-a}\\right)$ |`
      },
      {
        title: "4. Résumé, Points Clés & Erreurs Fréquentes",
        content: `### 📝 Résumé du Cours
Les nombres complexes unifient l'algèbre et la géométrie plane. L'addition correspond à la somme vectorielle, la multiplication correspond à une composition de similitudes (dilatation + rotation).

### 🌟 Points Clés à Retenir
1. Distance $AB = |z_B - z_A|$.
2. Angle orienté $(\\vec{AB}, \\vec{CD}) \\equiv \\arg\\left(\\frac{z_D - z_C}{z_B - z_A}\\right) \\pmod{2\\pi}$.
3. $A, B, C$ sont alignés si et seulement si $\\frac{z_C - z_A}{z_B - z_A} \\in \\mathbb{R}$.`
      },
      {
        title: "5. Exercices Progressifs & Corrigés Détaillés",
        content: `### 🏋️ Exercice 1 (Forme trigonométrique et puissance)
Mettre sous forme trigonométrique le complexe $z = 1 + i\\sqrt{3}$, puis calculer $z^6$.

#### 🔑 Corrigé Détaillé
1. Module : $|z| = \\sqrt{1^2 + (\\sqrt{3})^2} = \\sqrt{4} = 2$.
   $\\cos\\theta = 1/2$ et $\\sin\\theta = \\sqrt{3}/2 \\implies \\theta = \\pi/3$.
   Donc $z = 2 e^{i \\pi/3}$.
2. Par la formule de Moivre :
   $$z^6 = (2 e^{i \\pi/3})^6 = 2^6 e^{i 6 \\frac{\\pi}{3}} = 64 e^{i 2\\pi} = 64(1) = 64$$`
      },
      {
        title: "6. Mini Quiz d'Auto-Évaluation (10 Questions)",
        content: `### ❓ Mini-Quiz sur les Nombres Complexes
1. **Question 1** : Que vaut $i^2$ ?
   - *Réponse* : $-1$.
2. **Question 2** : Quel est le module de $z = 3 - 4i$ ?
   - *Réponse* : $|z| = \\sqrt{3^2 + (-4)^2} = 5$.
3. **Question 3** : Quel est le conjugué de $z = 2 + 5i$ ?
   - *Réponse* : $\\bar{z} = 2 - 5i$.
4. **Question 4** : Écrire $e^{i \\pi/2}$ sous forme algébrique.
   - *Réponse* : $i$.
5. **Question 5** : Que vaut $i^4$ ?
   - *Réponse* : $1$.
6. **Question 6** : Quelle transformation représente $z' = z + 3 - 2i$ ?
   - *Réponse* : Une translation de vecteur $\\vec{u}(3, -2)$.
7. **Question 7** : Quelle transformation représente $z' = i z$ ?
   - *Réponse* : Une rotation de centre $O(0)$ et d'angle $\\pi/2$ ($90^\\circ$).
8. **Question 8** : Résoudre dans $\\mathbb{C}$ : $z^2 = -9$.
   - *Réponse* : $z_1 = 3i$ et $z_2 = -3i$.
9. **Question 9** : Si $z = e^{i \\theta}$, que vaut $|z|$ ?
   - *Réponse* : $1$.
10. **Question 10** : Quelle est la partie réelle de $z = (1+i)^2$ ?
    - *Réponse* : $0$ (car $(1+i)^2 = 1 + 2i - 1 = 2i$).`
      }
    ]
  }
];

export const MATHS_TERMINALE_QUIZZES: Quiz[] = [
  {
    id: "quiz_term_maths_ch1",
    title: "Quiz Bac - Limites, Continuité et TVI",
    subject: "Mathématiques",
    grade: "Terminale",
    chapterNo: 1,
    chapterTitle: "Limites, Continuité et TVI",
    difficulty: "moyen",
    durationMinutes: 15,
    questions: [
      { id: "q1", type: "qcm", questionText: "Si f est continue en x0 = 3, quelle égalité est vérifiée ?", options: ["lim x->3 f(x) = f(3)", "f'(3) = 0", "f(3) = 0", "lim x->0 f(x) = 3"], correctAnswer: "lim x->3 f(x) = f(3)", explanation: "Par définition, la continuité en x0 signifie que la limite en ce point est égale à l'image f(x0)." },
      { id: "q2", type: "qcm", questionText: "Que garantit le Théorème des Valeurs Intermédiaires (TVI) pour f continue sur [a, b] ?", options: ["Au moins une solution à f(c)=k entre f(a) et f(b)", "Une solution unique", "f est dérivable", "f est strictement monotone"], correctAnswer: "Au moins une solution à f(c)=k entre f(a) et f(b)", explanation: "Le TVI classique assure l'existence d'au moins une solution c." },
      { id: "q3", type: "qcm", questionText: "Que faut-il ajouter au TVI pour garantir l'UNICITÉ de la solution ?", options: ["La stricte monotonie de f", "La convexité de f", "La parité de f", "La périodicité de f"], correctAnswer: "La stricte monotonie de f", explanation: "La stricte monotonie rend la fonction bijective sur l'intervalle." },
      { id: "q4", type: "qcm", questionText: "Quelle est la limite de sin(x)/x quand x tend vers 0 ?", options: ["1", "0", "+infini", "N'existe pas"], correctAnswer: "1", explanation: "C'est une limite usuelle fondamentale liée au taux de variation du sinus en 0." },
      { id: "q5", type: "vrai_faux", questionText: "Toute fonction dérivable en x0 est continue en x0.", options: ["Vrai", "Faux"], correctAnswer: "Vrai", explanation: "La dérivabilité implique la continuité (la réciproque est fausse)." },
      { id: "q6", type: "qcm", questionText: "Quelle est la limite en +infini de (2x^2 + 1)/(x^2 - 3) ?", options: ["2", "1", "+infini", "0"], correctAnswer: "2", explanation: "On factorise par x^2 au numérateur et dénominateur : 2x^2/x^2 = 2." },
      { id: "q7", type: "qcm", questionText: "Si f(1) = -4 et f(3) = 5 avec f continue sur [1, 3], que peut-on affirmer ?", options: ["f(x) = 0 admet au moins une solution sur ]1, 3[", "f est croissante", "f(2) = 0", "f est un polynôme"], correctAnswer: "f(x) = 0 admet au moins une solution sur ]1, 3[", explanation: "Comme f(1)*f(3) < 0, 0 est compris entre f(1) et f(3)." },
      { id: "q8", type: "vrai_faux", questionText: "La fonction f(x) = 1/x est continue sur R.", options: ["Vrai", "Faux"], correctAnswer: "Faux", explanation: "Elle n'est pas définie en 0, donc pas continue sur R." },
      { id: "q9", type: "qcm", questionText: "Comment lever la forme indéterminée (+infini - infini) pour sqrt(x^2+1) - x ?", options: ["Multiplier par l'expression conjuguée", "Factoriser par x^3", "Dériver", "Prendre le logarithme"], correctAnswer: "Multiplier par l'expression conjuguée", explanation: "L'expression conjuguée transforme la différence en quotient maîtrisé." },
      { id: "q10", type: "qcm", questionText: "Si f est strictement décroissante et continue sur [2, 6] avec f(2)=8 et f(6)=1, quel est l'intervalle image ?", options: ["[1, 8]", "[2, 6]", "[-8, -1]", "[0, +infini["], correctAnswer: "[1, 8]", explanation: "L'image d'un intervalle par une fonction continue décroissante est [f(b), f(a)]." }
    ]
  },
  {
    id: "quiz_term_maths_ch2",
    title: "Quiz Bac - Logarithmes et Exponentielles",
    subject: "Mathématiques",
    grade: "Terminale",
    chapterNo: 2,
    chapterTitle: "Fonctions Logarithmes et Exponentielles",
    difficulty: "moyen",
    durationMinutes: 15,
    questions: [
      { id: "q1", type: "qcm", questionText: "Que vaut ln(e^3) ?", options: ["3", "e", "1", "ln(3)"], correctAnswer: "3", explanation: "ln et exp sont réciproques, donc ln(e^x) = x." },
      { id: "q2", type: "qcm", questionText: "Quel est l'ensemble de définition de la fonction f(x) = ln(2x - 4) ?", options: ["]2, +infini[", "[2, +infini[", "R", "]0, +infini["], correctAnswer: "]2, +infini[", explanation: "Il faut 2x - 4 > 0 <=> 2x > 4 <=> x > 2." },
      { id: "q3", type: "qcm", questionText: "Que vaut exp(a + b) ?", options: ["exp(a) * exp(b)", "exp(a) + exp(b)", "exp(a*b)", "exp(a) / exp(b)"], correctAnswer: "exp(a) * exp(b)", explanation: "L'exponentielle transforme les sommes en produits." },
      { id: "q4", type: "qcm", questionText: "Quelle est la dérivée de f(x) = e^(3x) ?", options: ["3 e^(3x)", "e^(3x)", "3x e^(3x-1)", "1/3 e^(3x)"], correctAnswer: "3 e^(3x)", explanation: "(e^(u))' = u' * e^u, donc (3x)' * e^(3x) = 3 e^(3x)." },
      { id: "q5", type: "vrai_faux", questionText: "L'équation e^x = -5 possède une solution réelle.", options: ["Vrai", "Faux"], correctAnswer: "Faux", explanation: "e^x est strictement positive sur R pour tout x." },
      { id: "q6", type: "qcm", questionText: "Que vaut lim x->+infini de ln(x)/x ?", options: ["0", "+infini", "1", "-infini"], correctAnswer: "0", explanation: "C'est la croissance comparée usuelle : x domine ln(x) en +infini." },
      { id: "q7", type: "qcm", questionText: "Simplifier A = ln(12) - ln(3).", options: ["ln(4)", "ln(9)", "ln(36)", "4"], correctAnswer: "ln(4)", explanation: "ln(a) - ln(b) = ln(a/b), donc ln(12/3) = ln(4)." },
      { id: "q8", type: "qcm", questionText: "Résoudre l'équation ln(x) = 0.", options: ["x = 1", "x = 0", "x = e", "Pas de solution"], correctAnswer: "x = 1", explanation: "ln(1) = 0 est une valeur remarquable." },
      { id: "q9", type: "vrai_faux", questionText: "La fonction exponentielle est strictement croissante sur R.", options: ["Vrai", "Faux"], correctAnswer: "Vrai", explanation: "Sa dérivée (e^x) est toujours strictement positive." },
      { id: "q10", type: "qcm", questionText: "Quelle est la limite de e^x quand x tend vers -infini ?", options: ["0", "-infini", "+infini", "1"], correctAnswer: "0", explanation: "L'axe des abscisses y=0 est asymptote horizontale en -infini." }
    ]
  }
];
