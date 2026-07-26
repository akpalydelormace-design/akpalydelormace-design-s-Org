import { Lesson, Quiz } from "../../types";
import { MATHS_TERMINALE_LESSONS, MATHS_TERMINALE_QUIZZES } from "./maths";
import { FRANCAIS_TERMINALE_LESSONS, FRANCAIS_TERMINALE_QUIZZES } from "./francais";
import { ANGLAIS_TERMINALE_LESSONS, ANGLAIS_TERMINALE_QUIZZES } from "./anglais";
import { SVT_TERMINALE_LESSONS, SVT_TERMINALE_QUIZZES } from "./svt";
import { PC_TERMINALE_LESSONS, PC_TERMINALE_QUIZZES } from "./pc";
import { PHILOSOPHIE_TERMINALE_LESSONS, PHILOSOPHIE_TERMINALE_QUIZZES } from "./philo";
import { HG_TERMINALE_LESSONS, HG_TERMINALE_QUIZZES } from "./hg";

export const TERMINALE_LESSONS: Lesson[] = [
  ...MATHS_TERMINALE_LESSONS,
  ...FRANCAIS_TERMINALE_LESSONS,
  ...ANGLAIS_TERMINALE_LESSONS,
  ...SVT_TERMINALE_LESSONS,
  ...PC_TERMINALE_LESSONS,
  ...PHILOSOPHIE_TERMINALE_LESSONS,
  ...HG_TERMINALE_LESSONS,
];

export const TERMINALE_QUIZZES: Quiz[] = [
  ...MATHS_TERMINALE_QUIZZES,
  ...FRANCAIS_TERMINALE_QUIZZES,
  ...ANGLAIS_TERMINALE_QUIZZES,
  ...SVT_TERMINALE_QUIZZES,
  ...PC_TERMINALE_QUIZZES,
  ...PHILOSOPHIE_TERMINALE_QUIZZES,
  ...HG_TERMINALE_QUIZZES,
];

export interface SubjectReport {
  subject: string;
  coursesCount: number;
  exercisesCount: number;
  quizzesCount: number;
  questionsCount: number;
  isFirestoreValid: boolean;
  errors: string[];
}

export function generateSubjectReport(subjectName: string): SubjectReport {
  const subjectLessons = TERMINALE_LESSONS.filter(l => l.subject === subjectName);
  const subjectQuizzes = TERMINALE_QUIZZES.filter(q => q.subject === subjectName);

  const errors: string[] = [];

  // Verification logic
  subjectLessons.forEach(lesson => {
    if (!lesson.title || !lesson.subject || !lesson.grade) {
      errors.push(`Leçon ${lesson.id} a un champ métadonnée manquant.`);
    }
    if (!lesson.sections || lesson.sections.length < 5) {
      errors.push(`Leçon ${lesson.id} (${lesson.title}) a un nombre de sections insuffisant (${lesson.sections?.length || 0}/6 attendues).`);
    } else {
      lesson.sections.forEach((sec, idx) => {
        if (!sec.title || !sec.content || sec.content.trim().length < 50) {
          errors.push(`Leçon ${lesson.id} Section ${idx + 1} est incomplète.`);
        }
      });
    }
  });

  subjectQuizzes.forEach(quiz => {
    if (!quiz.questions || quiz.questions.length < 10) {
      errors.push(`Quiz ${quiz.id} (${quiz.title}) ne contient pas 10 questions (${quiz.questions?.length || 0}/10).`);
    }
  });

  // Calculate exercises count (2 progressive exercises per lesson)
  const exercisesCount = subjectLessons.length * 2;
  const questionsCount = subjectQuizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0);

  return {
    subject: subjectName,
    coursesCount: subjectLessons.length,
    exercisesCount,
    quizzesCount: subjectQuizzes.length,
    questionsCount,
    isFirestoreValid: errors.length === 0,
    errors
  };
}
