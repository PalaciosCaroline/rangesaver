"use client";
import React from "react";
import HandMatrix from "../components/handMatrix"; 

export default function HandMatrixPage() {
  return (
    <div>
      <h1 className="h1handMatrix">Créer un Range</h1>
      <HandMatrix rangeId="default-range" />
    </div>
  );
}
