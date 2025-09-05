import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export interface Trip {
    _id: number
    title: string
    description: string
    owner: string
    collaborators: string[]
    places: string[]
    endDate: string | null
    startDate: string | null
}

export interface NewTrip {
    title: string
    description?: string
    startDate?: string
    endDate?: string
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

async function postNewTrip(newTrip: NewTrip) {
    try {
        const { data } = await axios.post('/api/trips', newTrip, { withCredentials: true })
        return data.newTrip
    } catch (err) {
        console.error(err)
        throw err
    }
}

function useTrips() {
    const queryClient = useQueryClient()
    
    const { data: trips, isLoading: tripsIsLoading, error } = useQuery({
        queryKey: ["userTrips"],
        queryFn: getUserTrips,
        // retry: false,
    })

    const newTripMutation = useMutation({
        mutationFn: postNewTrip,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userTrips'] })
        }
    })



    return {
        trips,
        tripsIsLoading,
        tripsError: error,
        newTrip: newTripMutation,

    }

}

export default useTrips