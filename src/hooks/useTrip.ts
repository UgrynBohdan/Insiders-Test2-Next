import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Trip } from "./useTrips"

async function getTrip(tripId: string) {
    try {
        const { data } = await axios.get(`/api/trips/${tripId}`, { withCredentials: true })
        return data.trip as Trip
    } catch (err) {
        console.error(err)
        throw err
    }
}

export interface NewPlace {
    tripId: string
    data: {
        locationName: string
        dayNumber: number
        notes?: string
    }
}

async function createPlace(newPlace: NewPlace) {
    try {        
        const { data } = await axios.post(`/api/trips/${newPlace.tripId}/places`, newPlace.data, { withCredentials: true })
        return data
    } catch (err) {
        console.error()
        throw err
    }
}

function useTrip(tripId: string) {
    const queryClient = useQueryClient()

    const { data: trip, isLoading } = useQuery({
        queryKey: ['chosenTrip', tripId],
        queryFn: () => getTrip(tripId),
    })

    const newPlace = useMutation({
        mutationFn: (data: NewPlace['data']) => createPlace({ tripId, data }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chosenTrip", tripId] })
        }
    })

    return {
        trip, isLoading, newPlace
    }
    
}

export default useTrip