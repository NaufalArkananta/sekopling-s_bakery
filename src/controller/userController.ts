import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient({errorFormat: "minimal"})

const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {username, user_email, user_password, user_role} = req.body

        
        const findEmail = await prisma.user.findFirst({
            where: {user_email }
        })
        
        if(findEmail) {
            res.status(400).json({
                message: `Email has exists`
            })
            return
        }
        
        const hashedPassword = await bcrypt.hash(user_password, 10)

        const newUser = await prisma.user.create({
            data: {
                username,
                user_email,
                user_password: hashedPassword,
                user_role
            }
        })

        res.status(200).json({
            message: `User has been created`,
            data: newUser
        })
        
        return

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const readUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search?.toString() || null;

        const allData = await prisma.user.findMany({
            where: search
                ? {
                    OR: [{
                            username: { contains: search },
                        },
                        {
                            user_email: { contains: search },
                        }],
                    }
                : undefined, // Jika tidak ada `search`, tidak ada kondisi `where`
        });

        res.status(200).json({
            message: `User has been retrieved`,
            data: allData,
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateUser = async(req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id

        const findUserId = await prisma.user.findFirst({where: {id: Number(id)}})

        if(!findUserId) {
            res.status(404).json({
                message: "User not found"
            })
        }

        const { username, user_email, user_password, user_role } = req.body

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                username: username ?? findUserId?.username,
                user_email: user_email ?? findUserId?.user_email,
                user_password: user_password ? await bcrypt.hash(user_password, 12) : findUserId?.user_password,
                user_role: user_role ?? findUserId?.user_role
            },
        })
        if(!updatedUser) {
            res.status(404).json({
                message: "User not found"
            })
        }
        res.status(200).json({
            message: "User updated",
            data: updatedUser
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteUser = async(req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id
        const findUser = await prisma.user.findFirst({where: {id: Number(id)}})
        if(!findUser) {
            res.status(404).json({
                message: "User not found"
            })
        }

        await prisma.order.deleteMany({
            where: { user_id: Number(id) }
        })
        await prisma.supply.deleteMany({
            where: { user_id: Number(id) }
        })

        await prisma.user.delete({where: {id: Number(id)}})
        res.status(200).json({
            message: "User deleted"
        })
        
    } catch (error) {
        res.status(500).json(error)
    }
}

/** function for login(authentication) */ 
const authentication = async(req: Request, res: Response): Promise<void> => {
    try {
        const {user_email, user_password} = req.body
        
        /**check existing email*/
        const findUser = await prisma.user.findUnique({ where: {user_email} })
        if(!findUser){
            res.status(200).json({
                message: "Email is not registered"
            })
            return
        }

        const isMatchPassword = await bcrypt.compare(user_password, findUser?.user_password)
        if(!isMatchPassword){
            res.status(200).json({
                message: "Invalid password"
            })
        }

        /** prepare to generate token using JWT */
        const payload = {
            username: findUser?.username,
            user_email: findUser?.user_email,
        }
        const signature = process.env.SECRET || ``

        const token = jwt.sign(payload, signature)
        
        res.status(200).json({
            logged: true,
            token,
            id: findUser?.id,
            username: findUser?.username,
            user_email: findUser?.user_email
        })
    } catch (error) {
        res.status(500).json(error)
    }
}
export { createUser, readUser, updateUser, deleteUser, authentication }