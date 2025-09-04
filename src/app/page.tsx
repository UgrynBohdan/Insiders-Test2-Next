"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex flex-1 items-center justify-center">
        <h2 className="text-3xl font-bold">
          Ласкаво просимо на сайт 🎉
        </h2>
      </main>
    </div>
  );
}
