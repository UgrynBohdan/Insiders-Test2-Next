import { connectDB } from "@/db/db";
import { User } from "@/db/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
     try {
        await connectDB()
        const { name, email, password } = await req.json()

        // Перевірка чи користувач існує
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "Користувач вже існує" }, { status: 400 });
        }

        const hash = await bcrypt.hash(password, 10)
        const newUser = new User({ name, email, password: hash })

        await newUser.save()

        return NextResponse.json({ message: "Реєстрація успішна", user: newUser })
    } catch (error) {
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
    }
}