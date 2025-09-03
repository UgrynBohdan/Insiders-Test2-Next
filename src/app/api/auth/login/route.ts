import { connectDB } from "@/db/db"
import User from "@/db/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

const JWT_SECRET = process.env.JWT_SECRET as string

export async function POST(req: Request) {
    try {
        await connectDB()
        const { email, password } = await req.json()

        // Перевіряємо чи існує користувач
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 })
        }

        // Перевірка пароля
        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            return NextResponse.json({ error: "Невірний email або пароль" }, { status: 401 })
        }

        // Створюємо JWT
        const token = jwt.sign({ userId: user._id, name: user.name, role: user.role }, JWT_SECRET, {
            expiresIn: "1h",
        })

        // Відправляємо у HttpOnly cookie
        const response = NextResponse.json({ message: "Успішний вхід" })
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 1
        })

        return response
    } catch (err) {
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
    }
}
