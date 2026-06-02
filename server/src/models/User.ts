import mongoose ,{ Document, Schema} from "mongoose";


export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    xp: number;
    streak: number;
    hearts: number;
    badges: string[];
    createdAT: Date;

}

const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: true, trim:true },
        email:    { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, minlength: 6 },
        xp:       { type: Number, default: 0 },
        streak:   { type: Number, default: 0 },
        hearts:   { type: Number, default: 5 },
        badges:   { type: [String], default: [] },
    },
    { timestamps: true }
);


export default mongoose.model<IUser>("User", UserSchema);
