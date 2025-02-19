//ranges/[rangeId]/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import RangeEditor from "@/app/components/rangeEditor";
import { getRangeData } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function RangeDetailPage() {
  const { rangeId } = useParams();
  const router = useRouter();
  const [rangeData, setRangeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login"); // 🚨 Redirige vers la connexion si pas connecté
        return;
      }

      setUser(currentUser);

      const data = await getRangeData(rangeId);
      if (!data || data.userId !== currentUser.uid) {
        console.warn("🚨 Accès refusé : Vous n'êtes pas le propriétaire de cette range !");
        router.push("/ranges"); // 🚨 Redirige si l'utilisateur ne possède pas la range
      } else {
        setRangeData(data);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Nettoie l'écouteur Firebase à la fin
  }, [rangeId, router]);

  if (loading) return <p>Chargement...</p>;

  return rangeData ? <RangeEditor rangeId={rangeId} /> : null;
}

export default RangeDetailPage;
