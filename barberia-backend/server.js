const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database'); // Configuración de la base de datos
const bodyParser = require('body-parser');
const path = require('path');
require('./models/associations'); // Asociaciones entre modelos

// Importa tus modelos explícitamente
const Usuario = require('./models/Usuario');
const Negocio = require('./models/Negocio');
const Servicio = require('./models/Servicio');
const HorarioNegocio = require('./models/HorarioNegocio');
const DisponibilidadEmpleado = require('./models/DisponibilidadEmpleado');
const Reserva = require('./models/Reserva');
const DuenoNegocio = require('./models/DuenoNegocio');
const EmpleadoNegocio = require('./models/EmpleadoNegocio');
const Pago = require('./models/Pago');
const Cliente = require('./models/Cliente');
const Evento = require('./models/Evento');
const EmpleadoServicio = require('./models/EmpleadoServicio.js');
const Soporte = require('./models/Soporte');

// Importamos las rutas
const userRoutes = require('./routes/userRoutes');
const negocioRoutes = require('./routes/negocioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const horarioRoutes = require('./routes/horarioRoutes');
const disponibilidadEmpleadoRoutes = require('./routes/disponibilidadEmpleadoRoutes');
const panelReservasRoutes = require('./routes/panelReservasRoutes');
const eventoRoutes = require('./routes/eventoRoutes');
const reservaHorarioRoutes = require('./routes/reservaHorarioRoutes');
const proxyRoutes = require('./routes/proxyRoutes');
const soporteRoutes = require('./routes/soporteRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

const app = express();

// Configuración avanzada de CORS
const allowedOrigins = [
  'http://localhost:3000', // Desarrollo local
  'https://rheaf-production.up.railway.app', // Dominio de producción en Railway
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes desde los dominios permitidos
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true, // Permitir uso de cookies o headers de autorización
}));

// Middlewares globales
app.use(express.json());
app.use(bodyParser.json());

// Registrar las rutas
app.use('/api/users', userRoutes);
app.use('/api/negocios', negocioRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/disponibilidad-empleado', disponibilidadEmpleadoRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/eventos', eventoRoutes);
app.use('/api/reserva-horario', reservaHorarioRoutes);
app.use('/api/panel-reservas', panelReservasRoutes);
app.use('/api/soportes', soporteRoutes);
app.use('/api/clientes', clienteRoutes);
app.use(proxyRoutes);

// Middleware para manejar errores de CORS
app.use((err, req, res, next) => {
  if (err.message === 'No permitido por CORS') {
    res.status(403).json({ error: 'Solicitud bloqueada por política CORS' });
  } else {
    next(err);
  }
});

// Función asincrónica para sincronizar la base de datos en el orden correcto
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');

    await Usuario.sync({ force: false });
    await Negocio.sync({ force: false });
    await Cliente.sync({ force: false });
    await EmpleadoNegocio.sync({ force: false });
    await DuenoNegocio.sync({ force: false });
    await Servicio.sync({ force: false });
    await HorarioNegocio.sync({ force: false });
    await DisponibilidadEmpleado.sync({ force: false });
    await Reserva.sync({ force: false });
    await Pago.sync({ force: false });
    await Evento.sync({ force: false });
    await EmpleadoServicio.sync({ force: false });
    await Soporte.sync({ force: false });
    console.log('Tablas sincronizadas correctamente.');
  } catch (error) {
    console.error('Error al conectar o sincronizar la base de datos:', error);
  }
};

// Iniciar la sincronización de la base de datos
syncDatabase();

// Iniciar el servidor en el puerto configurado
const PORT = process.env.PORT || 8080;
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
  });
