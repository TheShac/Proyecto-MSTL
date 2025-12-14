import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import employeeRouter from './routes/employee.routes.js'
import catalogoRouter from './routes/catalogo.routes.js';
import inventoryRoutes from './routes/products/inventory.routes.js';
import profileRoutes from "./routes/employee/profile.routes.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api/auth', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/employees', employeeRouter);
app.use('/api/catalogo', catalogoRouter);
app.use('/api/inventory', inventoryRoutes);
app.use("/api/profile", profileRoutes);

export default app;
