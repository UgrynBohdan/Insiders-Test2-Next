"use client";

import NewPlaceForm from "@/components/NewPlaceForm";
import useTrip from "@/hooks/useTrip";
import React, { useState } from "react";

interface TripPageProps {
    params: Promise<{ tripId: string }>
}

export default function TripDetailsPage({ params }: TripPageProps) {
    const [wantAddPlace, setWantAddPlace] = useState(false)

    const tripParams = React.use(params)
    let { trip, isLoading } = useTrip(tripParams.tripId)
    if (!trip) return <p>Завантаження...</p>

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
                        // <Link href={`/trips/${place.tripId}/places`} key={place._id}>
                        <li
                            key={place._id}
                            className="p-4 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition"
                        >
                            <h4 className="text-xl font-medium text-blue-600">День №{place.dayNumber}</h4>
                            <h3 className="text-xl font-medium text-blue-500">{place.locationName}</h3>
                            <p className="text-gray-600">{place.notes}</p>
                        </li>
                        // </Link>
                    ))}
                </ul>

                
                {wantAddPlace ?
                    <NewPlaceForm setWantAddPlace={setWantAddPlace} tripParams={tripParams} />
                :
                    <div className="mt-6 flex justify-end">
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            onClick={() => setWantAddPlace(true)}
                        >
                            ➕ Додати місце
                        </button>
                    </div>
                    }
            </div>
        </div>
    );
}