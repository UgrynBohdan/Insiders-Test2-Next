import { NextResponse } from "next/server"
import { connectDB } from "@/db/db"
import { Trip } from "@/db/models/Trip"
import { UserTokenData } from "../../route"
import { hasRight, userData } from "../route"
import { Place } from "@/db/models/Place"

export async function POST(req: Request, { params }: any) {
    try {
        await connectDB()

        const { locationName, dayNumber, notes } = await req.json()
        if (dayNumber < 1) {
            return NextResponse.json({ message: 'dayNumber must be greater than 1!' }, { status: 404 })
        }

        const { tripId } = await params

        const user = userData(req.headers.get('cookie') as string) as UserTokenData
        const trip = await Trip.findById(tripId)

        if (!trip) {
            return NextResponse.json({ message: 'Trip not found.' }, { status: 404 })
        }

        // Перевіряємо, чи користувач є власником
        if (hasRight(user, trip)) {
            return NextResponse.json({ message: 'You do not have access to this trip.' }, { status: 401 })
        }

        const newPlace = new Place({ tripId, locationName, notes, dayNumber })
        await newPlace.save()

        trip.places.push(newPlace._id as any)
        await trip.save()

        return NextResponse.json({ message: 'Місце створено' }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
    }
}