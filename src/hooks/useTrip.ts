import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { Trip } from "./useTrips"

export interface NewPlace {
    tripId: string
    data: {
        locationName: string
        dayNumber: number
        notes?: string
    }
}

export interface InviteCollaborator {
    tripId: string
    email: string
}

async function getTrip(tripId: string) {
    try {
        const { data } = await axios.get(`/api/trips/${tripId}`, { withCredentials: true })
        return data.trip as Trip
    } catch (err) {
        console.error(err)
        throw err
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

async function inviteCollaborator(invite: InviteCollaborator) {
    try {        
        const { data } = await axios.post(`/api/trips/${invite.tripId}/invite`, { invitedEmail: invite.email }, { withCredentials: true })
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

    const invite = useMutation({
        mutationFn: (email: string) => inviteCollaborator({ tripId, email })
    })

    return {
        trip, isLoading, newPlace, inviteCollaborator: invite
    }
    
}

export default useTrip