import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({errorFormat: "minimal"})

type Composition = {
    material_id: number,
    quantity: number
}

const createComposition = async (req: Request, res: Response): Promise<void> => {
    try {
        const cake_id: number = req.body.cake_id;
        const composition: { material_id: number; quantity: number }[] = req.body.composition;

        // checking cake
        const findCake = await prisma.cake.findUnique({
            where: { id: Number(cake_id) }
        });

        // checking for cake id
        if (!findCake) {
            res.status(404).json({
                message: `Cake not found`
            });
        }

        // check material id from array
        const arrayMaterialId = composition.map(item => item.material_id);
        const findMaterial = await prisma.material.findMany({
            where: { id: { in: arrayMaterialId } }
        });

        const notFoundMaterial = arrayMaterialId.filter(
            item => !findMaterial.map(material => material.id).includes(item)
        );
        if (notFoundMaterial.length > 0) {
            res.status(404).json({
                message: `Material(s) not found: ${notFoundMaterial.join(", ")}`
            });
        }

        // Create compositions in bulk using createMany
        await prisma.composition.createMany({
            data: composition.map(item => ({
                cake_id: cake_id,
                material_id: item.material_id,
                quantity: item.quantity
            }))
        });

        // Retrieve the newly created compositions to include in the response
        const newCompositions = await prisma.composition.findMany({
            where: {
                cake_id: cake_id,
                material_id: { in: arrayMaterialId }
            }
        });

        res.status(201).json({
            message: "Composition has been created",
            data: newCompositions
        });

    } catch (error) {
        res.status(500).json(error)
    }
};


const readComposition = async (req: Request, res: Response): Promise <void> => {
    try {
        const search = req.query.search;

        // Ambil semua data composition dengan relasi ke cake dan material
        const allData = await prisma.composition.findMany({
            include: {
                cake: true,  // Mengambil detail dari cake
                material: true  // Mengambil detail dari material
            }
        });

        // Definisikan tipe eksplisit untuk akumulator
        type CompositionWithDetails = {
            cake_id: number;
            cake: any;
            compositions: {
                material: any;
                quantity: number;
            }[];
        };

        // Gabungkan berdasarkan cake_id
        const groupedData = allData.reduce<CompositionWithDetails[]>((result, current) => {
            const { cake_id, cake, material, quantity } = current;

            // Cari jika cake_id sudah ada dalam result
            let existingCake = result.find(item => item.cake_id === cake_id);

            if (existingCake) {
                // Jika sudah ada, tambahkan material ke dalam array compositions
                existingCake.compositions.push({  material, quantity });
            } else {
                // Jika belum ada, buat objek baru
                result.push({
                    cake_id,
                    cake,  // Detail dari cake
                    compositions: [{ material, quantity }]  // Array material
                });
            }

            return result;
        }, []);

        // Kirim respons dalam format yang diinginkan
        res.status(200).json({
            message: "Composition has been retrieved",
            data: groupedData
        });

    } catch (error) {
        res.status(500).json(error)
    }
}

const updateComposition = async (req: Request, res: Response):Promise <void> => {
    try {
        const id = req.params.id;

        // Mencari komposisi berdasarkan id
        const findComposition = await prisma.composition.findUnique({
            where: { id: Number(id) }
        });

        if (!findComposition) {
            res.status(404).json({
                message: `Composition not found`
            });
        }

        // Komposisi baru yang akan diperbarui
        const composition: { material_id: number; quantity: number }[] = req.body.composition;

        // Periksa apakah material_id ada di dalam database
        const arrayMaterialId = composition.map(item => item.material_id);
        const findMaterial = await prisma.material.findMany({
            where: { id: { in: arrayMaterialId } }
        });

        const notFoundMaterial = arrayMaterialId.filter(
            item => !findMaterial.map(material => material.id).includes(item)
        );
        if (notFoundMaterial.length > 0) {
            res.status(404).json({
                message: `Material(s) not found: ${notFoundMaterial.join(", ")}`
            });
        }

        // Update compositions satu per satu dengan transaksi
        await prisma.$transaction(
            composition.map(item =>
                prisma.composition.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        material_id: item.material_id,
                        quantity: item.quantity
                    }
                })
            )
        );

        res.status(200).json({
            message: "Composition has been updated",
            data: composition
        });
    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteComposition = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id
        
        // check existing composition
        const findComposition = await prisma.composition.findUnique({
            where: { id: Number(id) }
        });
        
        if (!findComposition) {
            res.status(404).json({
                message: `Composition not found`
            });
        }

        await prisma.composition.delete({
            where: { id: Number(id) }
        })

        res.status(200).json({
            message: "Composition has been deleted"
        });
    } catch (error) {
        res.status(500).json(error)
    }
}

export {createComposition, readComposition, updateComposition, deleteComposition}