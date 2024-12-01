const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const bodyParser = require('body-parser');
const path = require('path');
require('./models/associations'); // Asociaciones entre modelos

// Importación de modelos
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

// Importación de rutas
const userRoutes = require('./routes/userRoutes');
const negocioRoutes = require('./routes/negocioRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const horarioRoutes = require('./routes/horarioRoutes');
const disponibilidadEmpleadoRoutes = require('./routes/disponibilidadEmpleadoRoutes');
const panelReservasRoutes = require('./routes/panelReservasRoutes');
const reservaHorarioRoutes = require('./routes/reservaHorarioRoutes');
const proxyRoutes = require('./routes/proxyRoutes');
const soporteRoutes = require('./routes/soporteRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

const authMiddleware = require('./middleware/authMiddleware');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Registro de rutas API
app.use('/api/users', userRoutes);
app.use('/api/negocios', negocioRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/disponibilidad-empleado', disponibilidadEmpleadoRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/reserva-horario', reservaHorarioRoutes);
app.use('/api/panel-reservas', panelReservasRoutes);
app.use('/api/soportes', soporteRoutes);
app.use('/api/clientes', clienteRoutes);
app.use(proxyRoutes);

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'build')));

// Redirige rutas no API al frontend
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next(); // Ignora rutas de la API
  }
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Sincronización de base de datos
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

syncDatabase();

// Iniciar el servidor
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
