import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export const runtime = "nodejs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function middleware(req: NextRequest) {
    
    const token = req.cookies.get("token")?.value;    

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
        jwt.verify(token, JWT_SECRET)
        
        return NextResponse.next();
    } catch (err) {
        console.error(err)
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
}

// Захищаємо сторінки
export const config = {
    matcher: ["/dashboard/:path*"],
}
