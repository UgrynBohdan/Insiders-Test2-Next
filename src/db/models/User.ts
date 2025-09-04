import mongoose, { Schema, Document, Model } from "mongoose"

export interface IUser extends Document {
    name: string
    email: string
    password: string
    role: string
    trips: mongoose.Types.ObjectId[]
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, default: "User" },
    trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }]
})

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);