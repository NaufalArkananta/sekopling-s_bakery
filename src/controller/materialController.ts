import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { number } from "joi";

const prisma = new PrismaClient();

type MaterialType = "LIQUID" | "POWDER" | "SOLID"

const createMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
        const {material_name, material_price} = req.body
        const  material_type: MaterialType = req.body.material_type

        const newData = await prisma.material.create({
            data: {
                material_name,
                material_price,
                material_type
            }
        })

        res.status(201).json({
            message: "Material has been created",
            data: newData
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const readMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search

        const allData = search ? await prisma.material.findMany({ where: {
            OR: [{
                material_name: { contains: search?.toString() || " " }
            }]
        } })
        : await prisma.material.findMany()

        if(!allData) {
            res.status(404).json({
                message: `Cake not found`
            })
            return
        }

        res.status(201).json({
            message: `Material has been retrived`,
            data: allData
        })
        return
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id

        const findData = await prisma.material.findFirst({
            where: {
                id: Number(id)
            }
        })

        if(!findData){
            res.status(404).json({
                message: `Material not found`
            })
        }

        const {material_name, material_price} = req.body
        const material_type: MaterialType = req.body.material_type

        const newData = await prisma.material.update({
            where: {
                id: Number(id)
            },
            data: {
                material_name,
                material_price,
                material_type
            }
        })
        
        res.status(200).json({
            message: "Material has been updated",
            data: newData
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id

        const findData = await prisma.material.findFirst({
            where: { id: Number(id) }
        })

        if(!findData) {
            res.status(404).json({
                message: `Material not found`
            })
        }

        await prisma.material.delete({
            where: { id: Number(id) }
        })

        res.status(200).json({
            message: `Material has been deleted`
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export { createMaterial, readMaterial, updateMaterial, deleteMaterial }