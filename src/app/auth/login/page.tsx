"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"

function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { refreshUser } = useAuth()

    async function handleLogin(e: React.FormEvent) {
        try {
            e.preventDefault()
            setError("")

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })

            const data = await res.json()
            
            // const { data } = await axios.post('/api/auth/login', { email, password }, { headers: { "Content-Type": "application/json" }})
            // console.log(data)

            if (!res.ok) {
                setError(data.error || "Помилка входу")
                return
            }

            // Якщо все ок → редірект на захищену сторінку
            await refreshUser()
            router.push("/dashboard")
        } catch (err) {
            throw err
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <form
            onSubmit={handleLogin}
            className="bg-white p-6 rounded-2xl shadow-md w-80"
        >
            <h1 className="text-xl font-bold mb-4">Вхід</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}

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
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
            Увійти
            </button>
        </form>
        </div>
    )
}

export default LoginPage