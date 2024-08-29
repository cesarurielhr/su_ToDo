const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Array en memoria para almacenar las tareas
let tareas = [];
let idCounter = 1;

// Ruta para crear una nueva tarea (POST /tareas)
app.post('/tareas', (req, res) => {
    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion) {
        return res.status(400).json({ message: 'Título y descripción son requeridos' });
    }

    const nuevaTarea = {
        id: idCounter++,
        titulo,
        descripcion,
        completado: false,
        fechaCreacion: new Date()
    };
    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});

// Ruta para leer todas las tareas (GET /tareas)
app.get('/tareas', (req, res) => {
    res.json(tareas);
});

// Ruta para leer una tarea específica por su ID (GET /tareas/:id)
app.get('/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id === parseInt(req.params.id));

    if (!tarea) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(tarea);
});

// Ruta para actualizar una tarea existente (PUT /tareas/:id)
app.put('/tareas/:id', (req, res) => {
    const tarea = tareas.find(t => t.id === parseInt(req.params.id));

    if (!tarea) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const { titulo, descripcion, completado } = req.body;

    if (titulo !== undefined) tarea.titulo = titulo;
    if (descripcion !== undefined) tarea.descripcion = descripcion;
    if (completado !== undefined) tarea.completado = completado;

    res.json(tarea);
});

// Ruta para eliminar una tarea por su ID (DELETE /tareas/:id)
app.delete('/tareas/:id', (req, res) => {
    const tareaIndex = tareas.findIndex(t => t.id === parseInt(req.params.id));

    if (tareaIndex === -1) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    tareas.splice(tareaIndex, 1);
    res.status(204).send();
});

// Ruta para calcular estadísticas sobre las tareas (GET /tareas/estadisticas)
app.get('tareas/estadisticas', (req, res) => {
    if (tareas.length === 0) {
        return res.status(200).json({
            totalTareas: 0,
            tareaMasReciente: null,
            tareaMasAntigua: null,
            completadas: 0,
            pendientes: 0
        });
    }

    const totalTareas = tareas.length;
    const tareaMasReciente = tareas.reduce((prev, curr) => (prev.fechaCreacion > curr.fechaCreacion) ? prev : curr);
    const tareaMasAntigua = tareas.reduce((prev, curr) => (prev.fechaCreacion < curr.fechaCreacion) ? prev : curr);
    const completadas = tareas.filter(t => t.completado).length;
    const pendientes = totalTareas - completadas;

    res.json({
        totalTareas,
        tareaMasReciente,
        tareaMasAntigua,
        completadas,
        pendientes
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
