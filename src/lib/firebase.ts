import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  enableNetwork,
  disableNetwork,
  doc, 
  getDoc 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Modern Firestore initialization with persistent multi-tab local cache
export const db = typeof window !== 'undefined'
  ? initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    }, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);

export { enableNetwork, disableNetwork };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  readableMessage: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

/**
 * Translates technical Firestore error codes into readable, friendly messages.
 */
export function formatFirestoreErrorMessage(error: any): string {
  if (!error) return "Une erreur Firestore inconnue est survenue.";
  
  const rawMsg = error.message || String(error);
  const code = error.code || "";

  if (code === "permission-denied" || rawMsg.includes("permission-denied")) {
    return "Permissions Firestore insuffisantes : Vous n'avez pas les droits d'accès requis.";
  }
  if (code === "not-found" || rawMsg.includes("not-found")) {
    return "Document introuvable dans la base de données Firestore.";
  }
  if (code === "already-exists" || rawMsg.includes("already-exists")) {
    return "Ce document existe déjà dans Firestore.";
  }
  if (code === "unavailable" || rawMsg.includes("unavailable") || rawMsg.includes("offline")) {
    return "Connexion Firestore indisponible. Vos modifications sont enregistrées en cache local et synchronisées automatiquement au retour du réseau.";
  }
  if (code === "unauthenticated" || rawMsg.includes("unauthenticated")) {
    return "Session non authentifiée. Reconnexion requise.";
  }
  if (code === "resource-exhausted" || rawMsg.includes("resource-exhausted")) {
    return "Quota de requêtes Firestore temporairement atteint.";
  }
  if (code === "failed-precondition" || rawMsg.includes("failed-precondition")) {
    return "Opération Firestore impossible dans l'état actuel.";
  }

  return rawMsg;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const readableMessage = formatFirestoreErrorMessage(error);
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    readableMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };

  console.warn(`[Firestore ${operationType.toUpperCase()} Status] ${path || 'collection'}: ${readableMessage}`, errInfo);
  return new Error(readableMessage);
}

export async function testFirestoreConnection() {
  try {
    await getDoc(doc(db, 'test', 'connection'));
  } catch (error) {
    console.info("Firestore opérant en mode cache local hors-ligne.");
  }
}

