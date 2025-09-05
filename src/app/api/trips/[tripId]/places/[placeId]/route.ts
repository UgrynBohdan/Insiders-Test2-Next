import { connectDB } from "@/db/db"
import { Trip } from "@/db/models/Trip"
import { NextResponse } from "next/server"
import { hasRight, userData } from "../../route"
import { UserTokenData } from "../../../route"
import { Place } from "@/db/models/Place"

export async function DELETE(req: Request, { params }: any) {
    try {
        await connectDB()

        const { tripId, placeId } = await params

        console.log(`tripId: ${tripId},\nplaceId: ${placeId}`)

        // Знаходимо поїздку
        const trip = await Trip.findById(tripId)
        if (!trip) {
            return NextResponse.json({ error: "Trip not found." }, { status: 404 })
        }

        const user = userData(req.headers.get('cookie') as any) as UserTokenData

        // Перевірка прав доступу
        if (hasRight(user, trip)) {
            return NextResponse.json({ error: "You do not have access to this trip." }, { status: 403 })
        }

        // Знаходимо місце
        const place = await Place.findOne({ _id: placeId, tripId })
        if (!place) {
            return NextResponse.json({ error: "Place not found." }, { status: 404 })
        }

        // Видаляємо місце
        await place.deleteOne()

        // Прибираємо з Trip.places
        trip.places = trip.places.filter((id: any) => id.toString() !== placeId)
        await trip.save()

        return NextResponse.json({ error: 'Place deleted successfully.' })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
    } 
}