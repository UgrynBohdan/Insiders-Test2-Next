import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { userData } from "../route"
import { Trip } from "@/db/models/Trip"
import { User } from "@/db/models/User"
import jwt from 'jsonwebtoken'
import { connectDB } from "@/db/db"

// створюємо транспортер
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function POST(req: Request, { params }: any) {
    try {
        await connectDB()
        const { invitedEmail } = await req.json()
        const { tripId } = await params
        const user = userData(req.headers.get('cookie') as string)

        const trip = await Trip.findById(tripId)
        if (!trip) throw new Error('Trip not found!')

        const invitedUser = await User.findOne({ email: invitedEmail }) as any
        if (invitedUser && user.userId.toString() === invitedUser._id.toString()) {
            throw new Error("You can't invite yourself!")
        }

        // Створення одноразового токена
        const token = jwt.sign(
            { tripId, invitedEmail },
            process.env.INVITE_SECRET_KEY as string,
            { expiresIn: '24h' } // Токен дійсний 24 години
        )

        const invitationLink = `${process.env.BACKEND_URL}/api/trips/${tripId}/invite?token=${token}`
        
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: invitedEmail,
            subject: `Запрошення до співпраці над подорожжю "${trip.title}"`,
            html: `
                <p>Вітаємо!</p>
                <p>Користувач <b>${user.name}</b> запросив вас до співпраці над плануванням подорожі <b>"${trip.title}"</b>.</p>
                <p>Щоб прийняти запрошення та отримати доступ, перейдіть за цим посиланням:</p>
                <a href="${invitationLink}">Прийняти запрошення</a>
                <p>Це посилання дійсне протягом 24 годин.</p>
                <p>З повагою,<br>Команда Trip Planner</p>
            `,
        }

        await transporter.sendMail(mailOptions)
        return NextResponse.json({ message: "Invite sent" })

    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
    }
}

export async function GET(req: Request, { params }: any) {
    try {
        await connectDB()
        const { searchParams } = new URL(req.url)
        const token = searchParams.get('token')
        if (!token || typeof token !== "string") {
            return NextResponse.json({ message: "Invalid token" }, { status: 400 });
        }

        const payload = jwt.verify(token, process.env.INVITE_SECRET_KEY as string) as {
            tripId: string;
            invitedEmail: string;
        }

        const trip = await Trip.findById(payload.tripId)
        if (!trip) return NextResponse.json({ message: "Trip not found" }, { status: 400 })

        const invitedUser = await User.findOne({ email: payload.invitedEmail }) as any
        if (!invitedUser) return NextResponse.json({ message: "User not found" }, { status: 400 })

        // додаємо користувача, якщо ще немає
        if (!trip.collaborators.some((id: any) => id.toString() === invitedUser._id.toString())) {
            trip.collaborators.push(invitedUser._id)
            await trip.save()
        }
        
        return NextResponse.json({ message: 'You have successfully joined the trip!' })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
    }
}