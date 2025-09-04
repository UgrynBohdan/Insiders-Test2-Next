import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: Request) {
    try {
        const cookie = req.headers.get("cookie") || "";
        const token = cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

        if (!token) {
        return NextResponse.json({ loggedIn: false });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);

        return NextResponse.json({ loggedIn: true, user: payload });
    } catch {
        return NextResponse.json({ loggedIn: false });
    }
}
