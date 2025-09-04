import { NextResponse } from "next/server"


export async function GET(req: Request, { params }: any) {
    try {
        const awaitParams = await params
        console.log(awaitParams.tripId)
        
        return NextResponse.json({ m: 'OK' }, { status: 201 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Помилка сервера" }, { status: 500 })
    }
}