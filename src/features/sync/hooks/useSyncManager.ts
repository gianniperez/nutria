"use client";

import { useEffect, useState } from "react";
import { syncApi } from "../api/syncApi";

export function useSyncManager(userId?: string | null) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

  useEffect(() => {
    if (!userId || userId === "current_user") return;

    let isMounted = true;

    async function initializeSync() {
      setIsSyncing(true);
      try {
        // Sincronización bidireccional inteligente (Last-Write-Wins)
        await syncApi.syncBidirectional(userId as string);

        if (isMounted) {
          setLastSyncTime(Date.now());
        }
      } catch (err) {
        console.warn("Error en proceso de sincronización:", err);
      } finally {
        if (isMounted) {
          setIsSyncing(false);
        }
      }
    }

    initializeSync();

    // Suscribirse a cambios remotos en tiempo real
    const unsubscribe = syncApi.subscribeToRemoteChanges(userId);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [userId]);

  return {
    isSyncing,
    lastSyncTime,
  };
}
