import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { ROOT_DIRECTORY } from "../config";
import fs from "fs"

const prisma = new PrismaClient({errorFormat: "minimal"})

const createCake = async (req: Request, res: Response): Promise<void> => {
    try {
        const cake_name: string = req.body.cake_name
        const cake_price: number = Number(req.body.cake_price)
        const cake_image: string = req.file?.filename || ``
        const best_before: Date = new Date(req.body.best_before)
        const cake_flavour: string = req.body.cake_flavour

        const newCake = await prisma.cake.create({
            data: {
                cake_name,
                cake_price,
                cake_image,
                best_before,
                cake_flavour
            }
        })

        res.status(201).json({
            message: `new cake has been created`,
            data: newCake
        })

    } catch (error) {
        res.status(500).json(error)
    }
}

const readCake = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search

        const allData = search ? await prisma.cake.findMany({ where: {
            OR: [{
                cake_name: { contains: search?.toString() || " " }
            }]
        } })
        : await prisma.cake.findMany()

        if(!allData) {
            res.status(404).json({
                message: `Cake not found`
            })
        }

        res.status(201).json({
            message: `Cake has been retrived`,
            data: allData
        })

    } catch (error) {
        res.status(500).json(error)
    }
}

const updateCake = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id

        const findCake = await prisma.cake.findFirst({ where: { 
            id: Number(id) 
        } })

        if(!findCake) {
            res.status(404).json({
                message: `Cake not found`
            })
        }

        if(req.file) {
            let oldFileName = findCake?.cake_image
            let pathFile =`${ROOT_DIRECTORY}/public/cake-image/${oldFileName}`
            let existsFile = fs.existsSync(pathFile)

            if(existsFile && oldFileName !==``) {
                fs.unlinkSync(pathFile)
            }
        }

        const { cake_name, cake_price, best_before, cake_flavour } = req.body

        const saveCake = await prisma.cake.update({ where: {
            id: Number(id)},
            data: {
                cake_name: cake_name ?? findCake?.cake_name,
                cake_price: cake_price?? findCake?.cake_price,
                cake_image: req.file ? req.file.filename : findCake?.cake_image,
                best_before: best_before?? findCake?.best_before,
                cake_flavour: cake_flavour?? findCake?.cake_flavour
            }
        })

        res.status(200).json({
            message: "Cake has been updated",
            data: saveCake
        })

    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteCake = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id
        const findCake = await prisma.cake.findFirst({ 
            where: { id: Number(id) } 
        })

        if(!findCake) {
            res.status(404).json({
                message: `Cake not found`
            })
        }

        await prisma.cake.delete({ where: { id: Number(id) }})

        res.status(200).json({
            message: `Cake has been deleted`
        })

    } catch (error) {
        res.status(500).json(error)
    }
}

export {createCake, readCake, updateCake, deleteCake}