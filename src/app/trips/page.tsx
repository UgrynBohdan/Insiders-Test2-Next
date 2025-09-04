"use client";
import useTrip from "@/hooks/useTrip";

function TripsPage() {
    const { trips, tripsIsLoading, tripsError } = useTrip();  

    if (tripsIsLoading) {
        return <p>Завантаження подорожей...</p>;
    }

    if (tripsError) {
        return <p className="text-red-500">Помилка при завантаженні даних</p>;
    }

    if (!trips || trips.length === 0) {
        return <p>Немає жодної подорожі 😢</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="flex flex-1 justify-center">
                <div className="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Мої подорожі</h2>
                <ul className="space-y-2">
                    {trips.map((trip: any) => (
                    <li
                        key={trip._id}
                        className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                    >
                        <p className="text-center">Title: { trip.title }</p>
                        <p className="text-center">Description: { trip.description }</p>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    );
}

export default TripsPage;
