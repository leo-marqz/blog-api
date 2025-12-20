
/**
 * @copyright 2025 leomarqz
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    firstName?: string;
    lastName?: string;
    socialLinks?: {
        website?: string;
        facebook?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
        x?: string;
    }
};

/**
 * User Schema
 */

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        maxLength: [20, 'Username cannot exceed 20 characters'],
        minLength: [4, 'Username must be at least 4 characters'],
        unique: [true, 'Username must be unique'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        maxLength: [50, 'Email cannot exceed 50 characters'],
        minLength: [4, 'Email must be at least 4 characters'],
        unique: [true, 'Email must be unique'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters'],
        select: false,
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is not supported',
        },
        default: 'user',
    },
    firstName: {
        type: String,
        maxLength: [20, 'First name must be less than 20 characters'],
    },
    lastName: {
        type: String,
        maxLength: [20, 'Last name must be les than 20 characters'],
    },
    socialLinks: {
        website: {
            type: String,
            maxLenght: [100, 'Website address must be less than 100 characters']
        },
        facebook: {
            type: String,
            maxLenght: [100, 'Facebook profile url must be less than 100 characters']
        },
        instagram: {
            type: String,
            maxLenght: [100, 'Instagram profile url must be less than 100 characters']
        },
        linkedin: {
            type: String,
            maxLenght: [100, 'Linkedin profile url must be less than 100 characters']
        },
        youtube: {
            type: String,
            maxLenght: [100, 'YYoutube profile url must be less than 100 characters']
        },
        x: {
            type: String,
            maxLenght: [100, 'X profile url must be less than 100 characters']
        },
    }
}, {
    timestamps: true,
});

userSchema.pre('save', async function(next){
    // Only hash the password if it has been modified (or is new)
    if(!this.isModified('password')){
        return next();
    }
    // Hash the password with a salt round of 10
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Proceed to save the user
})

export default model<IUser>('User', userSchema);


