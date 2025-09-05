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
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="flex flex-1 justify-center">
                <div className="bg-white p-6 rounded shadow w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Мої подорожі</h2>
                    {(!trips || trips.length === 0) ? <p className="flex justify-center">Немає жодної подорожі 😢</p> :
                        <ul className="space-y-2">
                            {trips.map((trip) => (
                                <Link href={`/trips/${trip._id}`} key={trip._id}>
                                    <li
                                        className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                                    >
                                        <p className="text-center">Title: { trip.title }</p>
                                        {trip.description ? <p className="text-center">Description: { trip.description }</p> : <></>}
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    }
                    {wantAddTrip?
                        <NewTripForm setWantAddTrip={setWantAddTrip} />
                    :
                        <button
                            className="mt-4 w-full bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() => setWantAddTrip(true)}
                        >
                            Додати нову подорож
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}

export default TripsPage;
