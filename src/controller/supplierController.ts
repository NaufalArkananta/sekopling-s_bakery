import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({errorFormat: "minimal"})

const createSupllier = async (req: Request, res: Response): Promise<void> => {
    try {
        const { supplier_name, supplier_address, supplier_phone } = req.body

        const newSupplier = await prisma.supplier.create({
            data: {
                supplier_name,
                supplier_address,
                supplier_phone
            }
        })

        res.status(201).json({
            message: "Supplier has been created",
            data: newSupplier
        })

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const readSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const supplier_name = req.query.supplier_name

        const findSupplier = supplier_name ? await prisma.supplier.findMany({ where: { 
            OR: [{
                supplier_name: { contains: supplier_name?.toString() || " " }
            }]
        } })
        : await prisma.supplier.findMany()

        if (!findSupplier) {
            res.status(404).json({
                message: `Supplier with name ${supplier_name} not found`
            })
        }

        res.status(200).json({
            message: `Supplier has been retrived`,
            data: findSupplier
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateSupplier = async (req: Request, res: Response): Promise<void> =>{
    try {
        const search = req.params.search

        const findSupplier = await prisma.supplier.findFirst({
            where: { id: Number(search) }
        })

        if(!findSupplier) {
            res.status(404).json({
                message: `Supplier not found`
            })
        }

        const { supplier_name, supplier_address, supplier_phone } = req.body

        const newData = await prisma.supplier.update({
            where: { id: Number(search) },
            data: {
                supplier_name: supplier_name ?? findSupplier?.supplier_name,
                supplier_address: supplier_address ?? findSupplier?.supplier_address,
                supplier_phone: supplier_phone ?? findSupplier?.supplier_phone
            }
        })

        res.status(200).json({
            message: `Supplier has been updated`,
            data: newData
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.params.search

        const findSupplier = await prisma.supplier.findMany({
            where: { id: Number(search) }
        })

        if(!findSupplier) {
            res.status(404).json({
                message: `Supplier with name ${search} not found`
            })
        }

        await prisma.supplier.delete({
            where: { id: Number(search) }
        })

        res.status(200).json({
            message: `Supplier has been deleted`
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export { createSupllier, readSupplier, updateSupplier, deleteSupplier}