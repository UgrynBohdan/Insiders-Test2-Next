"use client";

import { ITrip } from "@/db/models/Trip";
import useTrip from "@/hooks/useTrip";
import React from "react";

// Заглушки (пізніше заміниш на дані з API)
const tripTer = {
    _id: "123",
    title: "Подорож до Карпат",
    description: "Незабутня мандрівка горами з друзями",
    startDate: "2025-09-10",
    endDate: "2025-09-15",
    places: [
        { _id: "p1", name: "Ворохта", description: "Селище в горах" },
        { _id: "p2", name: "Говерла", description: "Найвища гора України" },
        { _id: "p3", name: "Яремче", description: "Водоспад Пробій і сувеніри" },
    ],
}

interface TripPageProps {
    params: Promise<{ tripId: string }>
}

export default function TripDetailsPage({ params }: TripPageProps) {
    const tripParams = React.use(params)
    let { trip, isLoading } = useTrip(tripParams.tripId)
    if (!trip) return <p>Завантаження...</p>
    console.log(trip)
    

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
                {/* Заголовок */}
                <h1 className="text-3xl font-bold text-blue-700 mb-2">{trip.title}</h1>
                <p className="text-gray-600 mb-4">{trip.description}</p>

                {/* Дати */}
                <div className="flex gap-4 text-gray-500 mb-6">
                    <span>📅 {trip.startDate?.toString()}</span>
                    <span>➡️</span>
                    <span>📅 {trip.endDate?.toString()}</span>
                </div>

                {/* Список місць */}
                <h2 className="text-2xl font-semibold mb-4">Місця</h2>
                <ul className="space-y-3">
                    {trip.places.map((place: any) => (
                        <li
                        key={place._id}
                        className="p-4 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition"
                        >
                            <h3 className="text-xl font-medium text-blue-600">{place.name}</h3>
                            <p className="text-gray-600">{place.description}</p>
                        </li>
                    ))}
                </ul>

                {/* Кнопка (наприклад, додати місце) */}
                <div className="mt-6 flex justify-end">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        ➕ Додати місце
                    </button>
                </div>
            </div>
        </div>
    );
}