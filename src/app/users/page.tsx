import React from "react"

interface User {
    id: number
    name: string
    userName: string
    email: string
}

const UsersPage = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    const users: User[] = await res.json()
    
    return (
        <div>
            <h3>Користувачі</h3>
            <ul>
                {users.map((user) => (
                    <li key={user.id} className="flex justify-between">
                        <span className="pr-10">Ім'я: {user.name}</span>
                        <span className="pr-10">Ім'я користувача: {user.userName}</span>
                        <span className="pr-10">Пошта: {user.email}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UsersPage