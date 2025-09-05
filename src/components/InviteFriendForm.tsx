import useTrip from "@/hooks/useTrip"
import React, { useState } from "react"

function InviteFriendForm({ setWantAddCollaborator, tripId } : {
     setWantAddCollaborator: (a: boolean) => void,
     tripId: string
}) {
    const [email, setEmail] = useState('')
    const { inviteCollaborator } = useTrip(tripId)

    const handleSubmit = (e: any) => {
        e.preventDefault()
        inviteCollaborator.mutate(email)
        setWantAddCollaborator(false)
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
                <label htmlFor="locationName" className="block text-sm font-medium text-gray-700">Вкажіть кого запрошуєте</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@site.com"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Запросити
                </button>
            </div>
            </form>
        </div>
    )
}

export default InviteFriendForm