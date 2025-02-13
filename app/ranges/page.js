//ranges/page.js;
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllRanges } from "@/lib/firebase"; // 🔥 On ne fait plus `saveRangeToFirebase` ici
import { v4 as uuidv4 } from "uuid"; 
import Link from "next/link";
import "./../styles/rangeList.css";


function RangesPage() {
  const [ranges, setRanges] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchRanges = async () => {
      try {
        const data = await getAllRanges();
        if (data) setRanges(data);
      } catch (error) {
        console.error("🚨 Erreur lors du chargement des ranges :", error);
      }
    };

    fetchRanges();
  }, []);

  return (
    <div className="range-list-container">
      <h1>Mes Ranges</h1>
      <button className="new-range-button" onClick={() => router.push("/ranges/new")}>+</button>

      {ranges.length === 0 ? (
        <p>Aucune range enregistrée.</p>
      ) : (
        <ul>
          {ranges.map(({ id, rangeName }) => (
            <li key={id}>
              <Link href={`/ranges/${id}`}>
                {rangeName || "Range sans nom"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RangesPage;