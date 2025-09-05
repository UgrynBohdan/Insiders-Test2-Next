"use client";

import InviteFriendForm from "@/components/InviteFriendForm";
import NewPlaceForm from "@/components/NewPlaceForm";
import useTrip from "@/hooks/useTrip";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface TripPageProps {
    params: Promise<{ tripId: string }>
}

export default function TripDetailsPage({ params }: TripPageProps) {
    const [wantAddPlace, setWantAddPlace] = useState(false)
    const [wantAddCollaborator, setWantAddCollaborator] = useState(false)
    const router = useRouter()

    const tripParams = React.use(params)
    let { trip, deleteTrip, deletePlace } = useTrip(tripParams.tripId)
    if (!trip) return <p>Завантаження...</p>
    // console.log(trip)
    
    const handelDeleteTrip = () => {
        router.push('/trips')
        deleteTrip.mutate()
    }

    const handelDeletePlace = (placeId: string) => {
        deletePlace.mutate(placeId)
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
                <div className="flex justify-between items-center">
                    <div>
                        {/* Заголовок */}
                        <h1 className="text-3xl font-bold text-blue-700 mb-2">{trip.title}</h1>
                        <p className="text-gray-600 mb-4">{trip.description}</p>

                        {/* Дати */}
                        <div className="flex gap-4 text-gray-500 mb-6">
                            <span>📅 {trip.startDate?.toString()}</span>
                            <span>➡️</span>
                            <span>📅 {trip.endDate?.toString()}</span>
                        </div>
                    </div>

                    <button
                        className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 text-white"
                        onClick={handelDeleteTrip}
                    >
                        Видалити подорож
                    </button>
                </div>

                {/* Список місць */}
                <h2 className="text-2xl font-semibold mb-4">Місця</h2>
                <ul className="space-y-3">
                    {trip.places.sort((p1, p2) => p1.dayNumber - p2.dayNumber).map((place) => (
                        // <Link href={`/trips/${place.tripId}/places`} key={place._id}>
                        <li
                            key={place._id}
                            className="p-4 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition flex justify-between items-center"
                        >
                            <div className="">
                                <h4 className="text-xl font-medium text-blue-600">День №{place.dayNumber}</h4>
                                <h3 className="text-xl font-medium text-blue-500">{place.locationName}</h3>
                                <p className="text-gray-600">{place.notes}</p>
                            </div>
                            <button
                                className="bg-red-500 px-4 py-2 rounded hover:bg-red-700 text-white"
                                onClick={() => handelDeletePlace(place._id)}
                            >
                                Видалити
                            </button>
                        </li>
                        // </Link>
                    ))}
                </ul>

                {/* Список колаборантів */}
                <h2 className="text-2xl font-semibold mb-4">Колаборанти</h2>
                <ul className="space-y-3">
                    {trip.collaborators.map((collaborator) => (
                        // <Link href={`/trips/${place.tripId}/places`} key={place._id}>
                        <li
                            key={collaborator._id}
                            className="p-4 bg-blue-50 rounded-lg shadow hover:bg-blue-100 transition"
                        >
                            <h4 className="text-xl font-medium text-blue-600">{collaborator.name}</h4>
                        </li>
                        // </Link>
                    ))}
                </ul>


                <div className="flex flex-col gap-2 mt-3">
                    {wantAddPlace ?
                        <NewPlaceForm setWantAddPlace={setWantAddPlace} tripParams={tripParams} />
                    :
                        <div className="flex justify-center">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                onClick={() => setWantAddPlace(true)}
                            >
                                ➕ Додати місце
                            </button>
                        </div>
                    }
                    {wantAddCollaborator ?
                        <InviteFriendForm setWantAddCollaborator={setWantAddCollaborator} tripId={tripParams.tripId} />
                    :
                        <div className="flex justify-center">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                onClick={() => setWantAddCollaborator(true)}
                            >
                                😎 Запросити друга
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}