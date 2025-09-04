"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { refreshUser } = useAuth()

    async function handleRegister(e: React.FormEvent) {
        try {
            e.preventDefault()
            setError("")

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })
            console.log(res)
            

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Помилка реєстрації")
                return
            }

            // після успішної реєстрації → редірект на login
            await refreshUser()
            router.push("/auth/login")
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <form
            onSubmit={handleRegister}
            className="bg-white p-6 rounded-2xl shadow-md w-80"
        >
            <h1 className="text-xl font-bold mb-4">Реєстрація</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}

            <input
            placeholder="Name"
            className="w-full mb-2 p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />

            <input
            type="email"
            placeholder="Email"
            className="w-full mb-2 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            type="password"
            placeholder="Пароль"
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
            Зареєструватися
            </button>
        </form>
        </div>
    )
}

export default RegisterPage