import { ITrip, Trip } from "@/db/models/Trip"
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { UserTokenData } from "../route"
import { connectDB } from "@/db/db"
import { Place } from "@/db/models/Place"
import { User } from "@/db/models/User"

export const userData = (cookie: string) => {
    const token = cookie
    ?.split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1]

    if (!token) {
        return NextResponse.json({ error: "Неправильний токен!" }, { status: 400 })
    }
    
    return jwt.decode(token as any) as any
}

export const hasRight = (user: UserTokenData, trip: ITrip) => {
    return trip.owner.toString() !== user.userId && !trip.collaborators.some((e) => e.toString() === user.userId)
}

export async function GET(req: Request, { params }: any) {
    try {
        const awaitParams = await params
        await connectDB()

        const trip = await Trip.findById(awaitParams.tripId) as ITrip

        if (!trip) {
            return NextResponse.json({ error: 'Подорожі не існує!' }, { status: 404 })
        }        

        const user = userData(req.headers.get('cookie') as string) as UserTokenData
        
        if (hasRight(user, trip)) {
            return NextResponse.json({ error: 'У вас немає доступу до цієї подорожі!' }, { status: 401 })
        }

        await Place

        const tripInfoFull = await trip.populate(['places', 'collaborators'])
        // const tripInfoFull = await trip.populate(['collaborators'])

        return NextResponse.json({ trip: tripInfoFull })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: any) {
    try {
        const { tripId } = await params
        await connectDB()

        const trip = await Trip.findById(tripId) as ITrip
        if (!trip) {
            return NextResponse.json({ error: 'Trip not found!' }, { status: 404 })
        }

        const user = userData(req.headers.get('cookie') as string)
        if (trip.owner.toString() !== user.userId) {
            return NextResponse.json({ error: "You don't have enough rights" }, { status: 401 })
        }

        // Видалення подорожі
        await Trip.findByIdAndDelete(tripId)
        
        // Видалення посилання на цю подорож у користувача
        await User.findByIdAndUpdate(trip.owner, {
            $pull: { trips: tripId }
        })

        return NextResponse.json({ message: 'Deleting successful' })


    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
    }
}