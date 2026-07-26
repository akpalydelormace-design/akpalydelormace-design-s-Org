import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";
import { getSyncStatus, subscribeToFirestore } from "../lib/storage";

export default function SyncStatusIndicator() {
  const [syncState, setSyncState] = useState(getSyncStatus());
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const refresh = () => setSyncState(getSyncStatus());
    refresh();
    const unsubscribe = subscribeToFirestore(refresh);
    return () => unsubscribe();
  }, []);

  const { isOnline, hasPendingWrites, lastSyncTime } = syncState;

  let badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  let dotColor = "bg-emerald-500 animate-pulse";
  let label = "En ligne";
  let icon = <Wifi className="h-3.5 w-3.5 text-emerald-600" />;

  if (!isOnline) {
    badgeColor = "bg-amber-50 text-amber-800 border-amber-200";
    dotColor = "bg-amber-500";
    label = "Hors ligne (Cache local)";
    icon = <WifiOff className="h-3.5 w-3.5 text-amber-600" />;
  } else if (hasPendingWrites) {
    badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
    dotColor = "bg-blue-500";
    label = "Sync Firestore...";
    icon = <RefreshCw className="h-3.5 w-3.5 text-blue-600 animate-spin" />;
  }

  const formattedTime = lastSyncTime
    ? lastSyncTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "Récemment";

  return (
    <div className="relative inline-block select-none">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${badgeColor}`}
        title="État de la synchronisation Firestore"
      >
        <span className={`h-2 w-2 rounded-full ${dotColor}`} />
        {icon}
        <span className="hidden sm:inline font-mono">{label}</span>
      </button>

      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-slate-900 text-slate-100 rounded-2xl shadow-xl border border-slate-800 text-[11px] z-50 space-y-1.5 pointer-events-none">
          <div className="flex items-center justify-between font-bold border-b border-slate-800 pb-1">
            <span className="text-white flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Base de données Firestore
            </span>
            <span className={isOnline ? "text-emerald-400 font-mono" : "text-amber-400 font-mono"}>
              {isOnline ? "Connecté" : "Hors-Ligne"}
            </span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {isOnline
              ? "Reconnexion automatique activée. Les données se synchronisent en temps réel."
              : "Vos modifications sont sauvegardées localement et seront envoyées au serveur dès le rétablissement d'Internet."}
          </p>
          <p className="text-[10px] text-slate-400 pt-0.5">Dernière synchro : <span className="font-mono text-slate-200">{formattedTime}</span></p>
        </div>
      )}
    </div>
  );
}
