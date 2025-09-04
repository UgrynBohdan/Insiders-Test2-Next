"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { user, loggedIn, loading, refreshUser } = useAuth();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshUser(); // 🔥 оновлюємо стан
    router.push("/");
  }

  if (loading) {
    return (
      <header className="bg-blue-600 text-white px-6 py-4">
        <span>Завантаження...</span>
      </header>
    );
  }

  return (
    <header className="flex justify-between items-center bg-blue-600 text-white px-6 py-4">
      <h1
        onClick={() => router.push("/")}
        className="text-xl font-bold cursor-pointer"
      >
        {!!user ?
          <p>🖐 Привіт, {user?.name}</p>
        :
          <p>🖐 Привіт</p>
        }
      </h1>
      {loggedIn ? (
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Вийти
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            Вхід
          </button>
          <button
            onClick={() => router.push("/auth/register")}
            className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
          >
            Реєстрація
          </button>
        </div>
      )}
    </header>
  );
}
