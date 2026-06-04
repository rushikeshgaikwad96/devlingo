import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body;

        //check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            res.status(400).json({ message: "Email already registered"});
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        //create the user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        //create JWT token
       const token = jwt.sign({
         id: user._id },
         process.env.JWT_SECRET as string,
         { expiresIn: "7d"}
       );

        res.status(201).json({
            token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    xp: user.xp,
                    streak: user.streak,
                    hearts: user.hearts,
                },

        });


    } catch (error) {
        res.status(500).json({message: "Server error", error});

    }
};




export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        //find user

        const user = await User.findOne({ email });
        if(!user) {
            res.status(400).json({ message: "Invalid credentials"});
            return;
        }

        //check password 
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
           res.status(400).json({ message: "Invalid credentials"});
           return; 
        }

        //create token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                xp: user.xp,
                streak: user.streak,
                hearts: user.hearts,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error});

    }
};


export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
