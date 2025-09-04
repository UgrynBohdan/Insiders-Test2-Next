import { connectDB } from "@/db/db"
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { Trip } from "@/db/models/Trip"

const userData = (cookie: string) => {
    const token = cookie
    ?.split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1]

    if (!token) {
        return NextResponse.json({ error: "Неправильний токен!" }, { status: 400 })
    }
    
    return jwt.decode(token as any) as any
}

export async function GET(req: Request) {
    try {
        await connectDB()
        
        const user = userData(req.headers.get('cookie') as any)

        const allUserTrips = await Trip.find({
            $or: [
                { owner: user.userId },
                { collaborators: { $in: [user.userId] } }
            ]
        })

        return NextResponse.json({ trips: allUserTrips })
    } catch (err) {
        console.error(err)
        NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
        throw err
    }
}

export async function POST(req: Request) {
    try {
        await connectDB()
        const user = userData(req.headers.get('cookie') as any)

        const { title,  description, startDate, endDate } = await req.json()

        if (startDate > endDate) {
            return NextResponse.json({ error: 'Start must be no later than the finish!' }, { status: 400 })
        }

        const newTrip = new Trip({ title, description, startDate, endDate, owner: user._id })
        await newTrip.save()

        return NextResponse.json({ message: 'Подорож створено!' }, { status: 201 })
    } catch (err) {
        console.error(err)
        throw err
    }
}