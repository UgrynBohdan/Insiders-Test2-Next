import { useQuery } from "@tanstack/react-query"
import axios from "axios"

interface Trip {
    _id: number
    title: string
    description: string
    owner: string
    collaborators: string[]
    places: string[]
    endDate: Date | null
    startDate: Date | null
}

async function getUserTrips() {
    try {
        const { data } = await axios.get('/api/trips', { withCredentials: true })
        return data.trips as Trip[]
    } catch (err) {
        console.error(err)
        throw err
    }
}

function useTrip() {
    
    const { data: trips, isLoading: tripsIsLoading, error } = useQuery({
        queryKey: ["userTrips"],
        queryFn: getUserTrips,
        // retry: false,
    })

    return {
        trips,
        tripsIsLoading,
        tripsError: error
    }

}

export default useTrip