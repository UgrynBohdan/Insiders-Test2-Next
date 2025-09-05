"use client";
import NewTripForm from "@/components/NewTripForm";
import useTrip from "@/hooks/useTrips";
import Link from "next/link";
import { useState } from "react";

function TripsPage() {
    const { trips, tripsIsLoading, tripsError } = useTrip()
    const [ wantAddTrip, setWantAddTrip ] = useState(false)

    if (tripsIsLoading) {
        return <p className="flex justify-center">Завантаження подорожей...</p>;
    }

    if (tripsError) {
        return <p className="text-red-500 flex justify-center">Помилка при завантаженні даних</p>;
    }
    // console.log(trips)

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
            <div className="flex flex-1 justify-center py-10">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
                🌍 Мої подорожі
                </h2>

                {(!trips || trips.length === 0) ? (
                <p className="flex justify-center text-gray-500">
                    Немає жодної подорожі 😢
                </p>
                ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trips.map((trip) => (
                    <Link href={`/trips/${trip._id}`} key={trip._id}>
                        <li className="p-4 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow-md 
                                    hover:shadow-lg hover:scale-[1.02] transition cursor-pointer">
                            <h3 className="text-xl font-semibold text-blue-800 mb-1">
                                {trip.title}
                            </h3>
                            {trip.description && (
                                <p className="text-gray-600 text-sm line-clamp-2">
                                {trip.description}
                                </p>
                            )}
                            {/* <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                                📅 <span>Дати уточнюються</span>
                            </div> */}
                        </li>
                    </Link>
                    ))}
                </ul>
                )}

                {wantAddTrip ? (
                <NewTripForm setWantAddTrip={setWantAddTrip} />
                ) : (
                <button
                    className="mt-6 w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-medium 
                            hover:bg-blue-700 shadow-md hover:shadow-lg transition"
                    onClick={() => setWantAddTrip(true)}
                >
                    ➕ Додати нову подорож
                </button>
                )}
            </div>
            </div>
        </div>
        )
    
}

export default TripsPage;
