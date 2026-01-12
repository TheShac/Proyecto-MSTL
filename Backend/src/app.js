import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import passport from 'passport';

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import './config/passport.js';

import productRoutes from './routes/product.routes.js';
import employeeRouter from './routes/employee.routes.js'
import catalogoRouter from './routes/catalogo.routes.js';
import inventoryRoutes from './routes/products/inventory.routes.js';
import profileRoutes from "./routes/employee/profile.routes.js";
import orderRoutes from './routes/orders/order.routes.js';
import orderCustomerRoutes from './routes/orders/orders.customer.routes.js';
import ordersGuestRoutes from "./routes/orders/orders.guest.routes.js";
import featuredRoutes from "./routes/featured.routes.js";
import offersRoutes from "./routes/products/offers.routes.js";


dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(passport.initialize());

app.use('/api/auth', userRoutes);
app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/api/employees', employeeRouter);
app.use('/api/catalogo', catalogoRouter);
app.use('/api/inventory', inventoryRoutes);
app.use("/api/profile", profileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/orders', orderCustomerRoutes);
app.use("/api/orders", ordersGuestRoutes);
app.use("/api/featured", featuredRoutes);
app.use("/api/offers", offersRoutes);

export default app;
