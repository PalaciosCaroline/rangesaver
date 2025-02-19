//ranges/new/page.js;
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import RangeEditor from "@/app/components/rangeEditor";

function NewRangePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth/login"); // 🚨 Redirige vers la connexion si pas connecté
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Nettoie l'écouteur Firebase
  }, [router]);

  if (loading) return <p>Chargement...</p>;

  return user ? <RangeEditor /> : null;
}

export default NewRangePage;
