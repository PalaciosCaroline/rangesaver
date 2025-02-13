//ranges/[rangeId]/page.js
"use client";

import React from "react";
import { useParams } from "next/navigation";
import RangeEditor from "@/app/components/rangeEditor";

function RangeDetailPage() {
  const { rangeId } = useParams();
  return <RangeEditor rangeId={rangeId} />;
}

export default RangeDetailPage;