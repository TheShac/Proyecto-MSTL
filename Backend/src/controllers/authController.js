import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CustomerModel } from '../models/customer.model.js';
import { EmployeeModel } from '../models/employee.model.js';

dotenv.config();

const ALLOWED_EMPLOYEE_CREATOR_ROLES = process.env.ALLOWED_EMPLOYEE_CREATOR_ROLES ? process.env.ALLOWED_EMPLOYEE_CREATOR_ROLES.split(',').map(role => role.trim()) : ['stl_administrador', 'stl_superadministrador'];

// LOGIN DE USUARIOS
export const Login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
      let user = await CustomerModel.findByEmailOrUsername(identifier);
      let userType = 'customer';

      if (!user) {
        user = await EmployeeModel.findByEmailOrUsername(identifier);
        userType = 'employee';
      };

      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const storedPasswordHash = userType === 'employee' ? user.emp_password : user.stl_password;

      if (!storedPasswordHash) return res.status(500).json({ message: 'Error de configuración: Contraseña no recuperada.' });

      const isValid = await bcrypt.compare(password, storedPasswordHash);
      if (!isValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

      const id = userType === 'employee' ? user.uuid_emps : user.uuid_customer;
      const username = userType === 'employee' ? user.emp_username : user.stl_username;
      const role = userType === 'employee' ? user.nombre_rol : 'customer';

      const token = jwt.sign(
        { id, username, role, userType },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '3h' }
      );

      if(userType === 'employee') await EmployeeModel.updateLastLogin(id);

      res.json({ message: 'Login exitoso', token, userType, role, id, username });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
};

// REGISTRO DE USUARIOS CUSTOMER
export const registerCustomer = async (req, res) => {
  try {
      const { username, email, password, nombre, apellido, telefono, image_profile } = req.body;
      if (await CustomerModel.findByEmailOrUsername(username) || await CustomerModel.findByEmailOrUsername(email)) {
        return res.status(409).json({ message: 'El nombre de usuario o email ya están registrados.' });
      };
      const hashedPassword = await bcrypt.hash(password, 10);
      const id = await CustomerModel.create({ username, email, password: hashedPassword, nombre, apellido, telefono, image_profile });
      res.json({ message: 'Cliente registrado correctamente', id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
};

// REGISTRO DE USUARIOS EMPLOYEE
export const registerEmployee = async (req, res) => {

  if (!req.user) {
    return res.status(403).json({ message: 'Acceso denegado. Se requiere autenticación.' });
  };

  const creatorRole = req.user.role;

  if (!ALLOWED_EMPLOYEE_CREATOR_ROLES.includes(creatorRole)) {
    return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden registrar empleados.' });
  };

  try {
    const { username, email, password, nombre, apellido, telefono, image_profile, id_role } = req.body;
    if (await EmployeeModel.findByEmailOrUsername(username) || await EmployeeModel.findByEmailOrUsername(email)) {
      return res.status(409).json({ message: 'El nombre de usuario o email ya están registrados.' });
    };
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = await EmployeeModel.create({ username, email, password: hashedPassword, nombre, apellido, telefono, image_profile, id_role });
    res.json({ message: 'Empleado registrado correctamente', id });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// EDITAR PERFIL DE USUARIO (CUSTOMER O EMPLOYEE)
export const editProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'No autenticado.' });

  const userId = req.user.id;
  const userType = req.user.userType;
  const userData = req.body;
  try {
    let updatedRows = 0;
    if (userData.password) userData.password = await bcrypt.hash(userData.password, 10);
    if (userType === 'customer') {
      updatedRows = await CustomerModel.update(userId, {
        username: userData.username, 
        email: userData.email, 
        telefono: userData.telefono,
        nombre: userData.nombre,
        apellido: userData.apellido,
        image_profile: userData.image_profile,
        password: userData.password
      });
    }
    else if (userType === 'employee') {
      updatedRows = await EmployeeModel.update(userId, {
        username: userData.username, 
        email: userData.email, 
        telefono: userData.telefono,
        nombre: userData.nombre,
        apellido: userData.apellido,
        image_profile: userData.image_profile,
        password: userData.password
      });
    }

    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o no hubo cambios.' });
    }
    res.json({ message: 'Perfil actualizado correctamente.' });
  }
  catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El nuevo email o nombre de usuario ya está en uso.' });
    }
    res.status(500).json({ error: 'Error en el servidor al actualizar el perfil.' });
  }
};

export const getProfile = async (req, res) => {
    if (!req.user) {
        return res.status(404).json({ message: 'Perfil de usuario no encontrado.' });
    }

    const profileData = {
        // Datos comunes
        id: req.user.uuid_customer || req.user.uuid_emps,
        nombre: req.user.stl_nombre || req.user.emp_nombre,
        apellido: req.user.stl_apellido || req.user.emp_apellido,
        userType: req.user.userType,
        
        // Datos de Cliente
        stl_email: req.user.stl_email || null,
        stl_username: req.user.stl_username || null,
        stl_telefono: req.user.stl_telefono || null,
        image_profile: req.user.stl_image_profile || null, 
        emp_email: req.user.emp_email || null,
        emp_username: req.user.emp_username || null,
        emp_telefono: req.user.emp_telefono || null,
        role: req.user.nombre_rol || null, 
        
        image_profile: req.user.stl_image_profile || req.user.emp_image_profile || null, 
    };

    res.json(profileData);
};


/**export const AuthController = {

  // RECUPERAR CONTRASEÑA - ENVIAR EMAIL CON TOKEN
  forgotPassword: async (req, res) => {
    const { email } = req.body;

      try {
        // 1. Buscar usuario por email (puede ser cliente o empleado)
        let user = await CustomerModel.findByEmailOrUsername(email);
        let userType = 'customer';
        if (!user) {
          user = await EmployeeModel.findByEmailOrUsername(email);
          userType = 'employee';
        }

        if (!user) {
          // Importante: Devolver un mensaje genérico para no dar pistas
          return res.json({ message: 'Si el correo existe, recibirá un enlace para restablecer la contraseña.' });
        }

        // 2. Generar un Token de Uso Único y Corta Duración
        const idKey = userType === 'employee' ? 'uuid_emps' : 'uuid_customer';
        const resetToken = jwt.sign(
          { id: user[idKey], userType: userType },
          process.env.RESET_TOKEN_SECRET,
          { expiresIn: '15m' } // Válido solo por 15 minutos
        );

        // 3. Crear el Enlace de Restablecimiento para el Frontend
        // El frontend debe tener una ruta que acepte el token (ej: /reset-password?token=...)
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            
        // 4. Enviar Correo con el Enlace
        await sendEmail({
          to: email,
          subject: 'Restablecer Contraseña para Store TL',
          html: `
            <p>Has solicitado restablecer tu contraseña. Haz clic en el enlace:</p>
            <a href="${resetLink}">Restablecer Contraseña</a>
            <p>Este enlace expirará en 15 minutos.</p>
          `,
        });

        return res.json({ message: 'Si el correo existe, recibirá un enlace para restablecer la contraseña.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al procesar la solicitud.' });
      }
    },

  // RESTABLECER CONTRASEÑA - USAR TOKEN PARA CAMBIAR CONTRASEÑA
    resetPassword: async (req, res) => {
      const { token, newPassword } = req.body;

      try {
        // 1. Verificar y Decodificar el Token
        const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
        const userId = decoded.id;
        const userType = decoded.userType;

        // 2. Hashear la nueva Contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3. Actualizar la Contraseña en el modelo correspondiente
        let updatedRows = 0;
        if (userType === 'customer') {
          updatedRows = await CustomerModel.updatePassword(userId, hashedPassword);
        } 
        else if (userType === 'employee') {
          updatedRows = await EmployeeModel.updatePassword(userId, hashedPassword);
        }

        if (updatedRows === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado o la contraseña ya fue cambiada.' });
        }

        res.json({ message: 'Contraseña restablecida correctamente.' });

      } catch (error) {

        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
          return res.status(401).json({ message: 'El enlace de restablecimiento es inválido o ha expirado.' });
        }
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al restablecer la contraseña.' });
      }
    },
};*/
