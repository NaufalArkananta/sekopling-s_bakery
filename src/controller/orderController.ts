import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({errorFormat: "minimal"})

type DetailOrder = {
    cake_id: number,
    cake_price: number,
    quantity: number,
}

type OrderStatus = "PROCESS" | "DELIVERED"

const createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const order_date: Date = new Date(req.body.order_date)
        const user_id: number = req.body.user_id
        const status: OrderStatus = req.body.status
        const detailOrder: DetailOrder[] = req.body.detailOrder

        const findUser = await prisma.user.findUnique({where: {id: user_id}})
        if (!findUser) {
            res.status(404).json({
                message: "User not found"
            })
        }
        
        const arrayCakeId = detailOrder.map(item => item.cake_id)

        const findCake = await prisma.cake.findMany({
            where: { id: { in: arrayCakeId } }
        })

        const notFoundCake = arrayCakeId.filter(
            item => !findCake.map(
                cake => cake.id
            ).includes(
                item
            )
        )

        if(notFoundCake.length > 0) {
            res.status(404).json({
                message: `Cake(s) not found: ${notFoundCake.join(", ")}`
            })
        }

        const newOrder = await prisma.order.create({
            data: {
                order_date,
                user_id,
                status,
            }
        })

        let newDetail = []
        for (let index = 0; index < detailOrder.length; index++) {
            const { cake_id, cake_price, quantity } = detailOrder[index]

            const cakeItem = findCake.find(item => item.id == cake_id)

            newDetail.push({
                order_id: newOrder.id,
                cake_id,
                cake_price,
                quantity,
            })   
        }

        await prisma.detailOrder.createMany({
            data: newDetail
        })

        res.status(500).json({
            message: "Order has been created"
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

const readOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search
        const findOrder = search ? await prisma.order.findUnique({
            where: { id: Number(search) }
        }) : await prisma.order.findMany()
        
        if (!findOrder) {
            res.status(404).json({
                message: "Order not found"
            })
        }
        
        res.status(200).json(findOrder)
        
    } catch (error) {
        res.status(500).json(error)
    }
}

const updateOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id

        const findOrder = await prisma.order.findFirst({
            where: {id: Number(id)},
            include: { detailOrders: true }
        })

        if(!findOrder) {
            res.status(404).json({
                message: "Order not found"
            })
        }

        const order_date: Date = new Date(req.body.order_date) || findOrder?.order_date
        const user_id: number = req.body.user_id || findOrder?.user_id
        const status: OrderStatus = req.body.status || findOrder?.status
        const detailOrder: DetailOrder[] = req.body.detailOrder || findOrder?.detailOrders

        await prisma.detailOrder.deleteMany({
            where: {order_id: Number(id)}
        })

        const arrayCakeId = detailOrder.map(item => item.cake_id)

        const findCake = await prisma.cake.findMany({
            where: { id: { in: arrayCakeId } }
        })

        const notFoundCake = arrayCakeId.filter(
            item => !findCake.map(
                cake => cake.id
            ).includes(
                item
            )
        )

        if(notFoundCake.length > 0) {
            res.status(404).json({
                message: `Cake(s) not found: ${notFoundCake.join(", ")}`
            })
        }

        const newOrder = await prisma.order.update({
            where: { id: Number(id) },
            data: {
                order_date,
                user_id,
                status,
            }
        })

        let newDetail = []
        for (let index = 0; index < detailOrder.length; index++) {
            const { cake_id, cake_price, quantity } = detailOrder[index]

            const cakeItem = findCake.find(item => item.id == cake_id)

            newDetail.push({
                order_id: newOrder.id,
                cake_id,
                cake_price,
                quantity,
            })   
        }

        await prisma.detailOrder.createMany({
            data: newDetail
        })

        res.status(500).json({
            message: "Order has been updated"
        })

    } catch (error) {
        res.status(500).json(error)
    }
}

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id

        const findOrder = await prisma.order.findFirst({
            where: { id: Number(id) }
        })

        if(!findOrder) {
            res.status(404).json({
                message: "Order not found"
            })
        }

        await prisma.detailOrder.deleteMany({
            where: { order_id: Number(id) }
        })
        await prisma.order.delete({
            where: { id: Number(id) }
        })

        res.status(200).json({
            message: "Order has been deleted"
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

export { createOrder, readOrder, updateOrder, deleteOrder }