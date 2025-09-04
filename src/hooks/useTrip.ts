import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

async function getTrip(tripId: string) {
    try {
        const { data } = await axios.get(`/api/trips/${tripId}`, { withCredentials: true })
        return data.trip
    } catch (err) {
        console.error(err)
        throw err
    }
}

function useTrip(tripId: string) {
    const queryClient = useQueryClient()

    const { data: trip } = useQuery({
        queryKey: ['chosenTrip', tripId],
        queryFn: () => getTrip(tripId),
    })

    return {
        trip
    }
    
}

export default useTrip