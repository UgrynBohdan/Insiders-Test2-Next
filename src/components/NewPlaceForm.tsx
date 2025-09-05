import useTrip, { NewPlace } from "@/hooks/useTrip"
import React, { useState } from "react"


function NewPlaceForm({ setWantAddPlace, tripParams }: {
    setWantAddPlace: (arg: boolean) => void,
    tripParams: { tripId: string }
}) {
    const { newPlace } = useTrip(tripParams.tripId)
    const [formData, setFormData] = useState<NewPlace['data']>({
        locationName: '',
        dayNumber: 1,
        notes: ''
    })

    const handleChange = (e: any) => {
        const { name, value, type } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "number" ? (Number(value) < 1 ? 1 : Number(value)) : value
        }))
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        newPlace.mutate(formData)
        setWantAddPlace(false)
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Додати нове місце</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
                <label htmlFor="locationName" className="block text-sm font-medium text-gray-700">Назва місця</label>
                <input
                id="locationName"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                placeholder="Карпати"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>

            <div>
                <label htmlFor="dayNumber" className="block text-sm font-medium text-gray-700">День подорожі</label>
                <input
                type="number"
                id="dayNumber"
                name="dayNumber"
                value={formData.dayNumber}
                onChange={handleChange}
                placeholder="Короткий опис вашої подорожі"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Опис місця</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    rows={4}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    // required
                />
            </div>
            
            <div className="flex justify-center">
                <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                Додати місце
                </button>
            </div>
            </form>
        </div>
        </div>
    )
}

export default NewPlaceForm