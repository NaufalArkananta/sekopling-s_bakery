import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({errorFormat: "minimal"})

type DetailSupply = {
    material_id: number,
    material_price: number
    quantity: number,
}

const createSupply = async (req: Request, res: Response): Promise<void> => {
    try {
        // read a requestt data
        const supplier_id: number = req.body.supplier_id
        const supply_date: Date = new Date(req.body.supply_date)
        const user_id: number = req.body.user_id
        const detailSupply: DetailSupply[] = req.body.detailSupply
    
        // checking supplier (memastikan id supplier tersedia)
        const findSupplierId = await prisma.supplier.findUnique({
            where: {id: supplier_id}
        })
        

        if(!findSupplierId) {
            res.status(404).json({
                message: "Supplier not found"
            })
            return
        }
    
        // checking user (memastikan id user tersedia)
        const findUserId = await prisma.user.findUnique({
            where: {id: user_id}
        })

        if(!findUserId) {
            res.status(404).json({
                message: `User not found`
            })
            return
        }

        // checking material (memastikan id material tersedia)
        const arrayMaterialId = detailSupply.map(item => item.material_id)
        
        const findMaterial = await prisma.material.findMany({
            where: { id: { in: arrayMaterialId } }
        })

        // check id material yang tidak tersedia
        const notFoundMaterial = arrayMaterialId.filter(
            item => !findMaterial.map(
                material => material.id
            ).includes(
                item
            )
        )
    
        if(notFoundMaterial.length > 0) {
            res.status(404).json({
                message: `Material(s) not found: ${notFoundMaterial.join(", ")}`
            })
            return
        }
    
        // save supply data
        const newSupply = await prisma.supply.create({
            data: {
                supplier_id: supplier_id,
                supply_date: supply_date,
                user_id: user_id
            }
        })
    
        // prepare data for detailsupply
        let newDetail = []
        for (let index = 0; index < detailSupply.length; index++) {
            const { material_id, material_price, quantity } = detailSupply[index]
    
            const materialItem = findMaterial.find(item => item.id == material_id)
    
            newDetail.push({
                supply_id: newSupply.id,
                material_id,
                material_price,
                quantity            
            })
        }
        
        // save supply detail
        await prisma.detailSupply.createMany({
            data: newDetail
        })
    
        res.status(200).json({
            message: "Supply has been created",
        })
        return
    
    } catch (error) {
        res.status(500).json(error)
    }
}

const readSupply = async (req: Request, res: Response): Promise<void> => {
    try {
        let allSupply = await prisma.supply.findMany({
            include: {
                detailSupplies: {
                    include: { material: true }
                }
            },
            orderBy: { supply_date: "desc" }
        })

        res.status(200).json({
            message: `All Transaction has been retrieved`,
            data: allSupply
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateSupply = async (req: Request, res: Response): Promise<void> => {
    try {
        // read id from params
        const id = req.params.id

        // check supply
        const findSupply = await prisma.supply.findFirst({
            where: { id: Number(id) },
            include: {detailSupplies: true}
        })

        if(!findSupply) {
            res.status(404).json({
                message: "Supply not found"
            })
        }

        // read request body
        const supplier_id: number = req.body.supplier_id || findSupply?.supplier_id
        const supply_date: Date = new Date(req.body.supply_date) || findSupply?.supply_date
        const user_id: number = req.body.user_id || findSupply?.user_id
        const detailSupply: DetailSupply[] = req.body.detailSupply || findSupply?.detailSupplies

        await prisma.detailSupply.deleteMany({
            where: { supply_id: Number(id) }
        })

        // checking material (memastikan id material tersedia)
        const arrayMaterialId = detailSupply.map(item => item.material_id)
        
        const findMaterial = await prisma.material.findMany({
            where: { id: { in: arrayMaterialId } }
        })

        // check id material yang tidak tersedia
        const notFoundMaterial = arrayMaterialId.filter(
            item => !findMaterial.map(
                material => material.id
            ).includes(
                item
            )
        )
    
        if(notFoundMaterial.length > 0) {
            res.status(404).json({
                message: `Material(s) not found: ${notFoundMaterial.join(", ")}`
            })
        }
    
        // save supply data
        const newSupply = await prisma.supply.update({
            where: {id: Number(id)},
            data: {
                supplier_id,
                supply_date,
                user_id
            }
        })
    
        // prepare data for detailsupply
        let newDetail = []
        for (let index = 0; index < detailSupply.length; index++) {
            const { material_id, material_price, quantity } = detailSupply[index]
    
            const materialItem = findMaterial.find(item => item.id == material_id)
    
            newDetail.push({
                supply_id: newSupply.id,
                material_id,
                material_price,
                quantity            
            })
        }
        
        // save supply detail
        await prisma.detailSupply.createMany({
            data: newDetail
        })
    
        res.status(200).json({
            message: "Supply has been updated"
        })
    
    } catch (error) {
        console.log(error)
    }
}

const deleteSupply = async (req: Request, res: Response): Promise<void> => {
    try {
        // read id from params
        const id = req.params.id

        const findSupply = await prisma.supply.findFirst({
            where: {id: Number(id)}
        })

        if(!findSupply) {
            res.status(404).json({
                message: "Supply not found"
            })
        }

        // hapus detail supply dulu, karena detail adalah tabel yang tergantung pada table supply
        await prisma.detailSupply.deleteMany({ where: { supply_id: Number(id) } })
        await prisma.supply.delete({ where: { id: Number(id) } })
        res.status(200).json({
            message: `Transaction has been removed`
        })

    } catch (error) {
        res.status(500).json(error)
    }
}


export { createSupply, readSupply, updateSupply, deleteSupply }