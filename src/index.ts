import Express from 'express'
import CakeRoute from "./router/cakeRoute"
import MaterialRoute from"./router/materialRoute"
import CompositionRoute from "./router/compositionRoute"
import SupplierRoute from "./router/supplierRoute"
import SupplyRoute from "./router/supplyRoute"
import UserRoute from "./router/userRoute"
import OrderRoute from "./router/orderRoute"

const app = Express()

app.use(Express.json())

app.use(`/cake`, CakeRoute)
app.use(`/material`, MaterialRoute)
app.use(`/composition`, CompositionRoute)
app.use(`/supplier`, SupplierRoute)
app.use(`/supply`, SupplyRoute)
app.use(`/user`, UserRoute)
app.use(`/order`, OrderRoute)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})