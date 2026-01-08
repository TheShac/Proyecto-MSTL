import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomerModel } from "../models/customer.model.js";
import { EmployeeModel } from "../models/employee.model.js";

dotenv.config();

export const googleCallback = async (req, res) => {
  try {
    const { email, googleId, name, lastName, photo } = req.user;

    // 1) Buscar por google_id primero
    let user = await CustomerModel.findByGoogleId(googleId);
    let userType = "customer";

    if (!user) {
      user = await EmployeeModel.findByGoogleId(googleId);
      userType = "employee";
    }

    // 2) Si no se encontró por google_id, buscar por email
    if (!user) {
      user = await CustomerModel.findByEmailOrUsername(email);
      userType = "customer";

      if (!user) {
        user = await EmployeeModel.findByEmailOrUsername(email);
        userType = "employee";
      }
    }

    // 3) Si existe usuario, vincular google_id si no lo tiene
    if (user) {
      if (userType === "customer" && !user.google_id) {
        await CustomerModel.setGoogleId(user.uuid_customer, googleId);
        user.google_id = googleId;
      }

      if (userType === "employee" && !user.google_id) {
        await EmployeeModel.setGoogleId(user.uuid_emps, googleId);
        user.google_id = googleId;
      }
    }

    // 4) Si NO existe en ninguno => crear CUSTOMER automáticamente
    if (!user) {
      const username = email.split("@")[0];

      await CustomerModel.createGoogleUser({
        username,
        email,
        nombre: name,
        apellido: lastName,
        image_profile: photo,
        google_id: googleId,
      });

      user = await CustomerModel.findByEmailOrUsername(email);
      userType = "customer";
    }

    // 5) Generar tu JWT igual que Login normal
    const id = userType === "employee" ? user.uuid_emps : user.uuid_customer;
    const username = userType === "employee" ? user.emp_username : user.stl_username;
    const role = userType === "employee" ? user.nombre_rol : "customer";

    const token = jwt.sign(
      { id, username, role, userType },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "3h" }
    );

    // 6) Redirigir al frontend con token
    return res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}`);

  } catch (error) {
    console.error(error);
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
};
