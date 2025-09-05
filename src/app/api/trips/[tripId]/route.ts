import { ITrip, Trip } from "@/db/models/Trip"
import { NextResponse } from "next/server"
import jwt from 'jsonwebtoken'
import { UserTokenData } from "../route"
import { Place } from "@/db/models/Place"

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

export async function GET(req: Request, { params }: any) {
    try {
        const awaitParams = await params

        const trip = await Trip.findById(awaitParams.tripId) as ITrip

        if (!trip) {
            return NextResponse.json({ error: 'Подорожі не існує!' }, { status: 404 })
        }        

        const user = userData(req.headers.get('cookie') as string) as UserTokenData
        
        if (
            trip.owner.toString() !== user.userId &&
            !trip.collaborators.some((e) => e.toString() ===user.userId)
        ) {
            return NextResponse.json({ error: 'У вас немає доступу до цієї подорожі!' }, { status: 401 })
        }

        // await Place

        const tripInfoFull = await trip.populate(['places', 'collaborators'])
        // const tripInfoFull = await trip.populate(['collaborators'])

        return NextResponse.json({ trip: tripInfoFull })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
    }
}