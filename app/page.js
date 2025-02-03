"use client";
import React from "react";
import {db} from "@/lib/firebase";
import HandMatrix from "./components/handMatrix"; 


export default function Home() {
  return (
    <div>
      <h1>Entraîneur de ranges</h1>
      <HandMatrix rangeId="default-range" />
    </div>
  );
}
