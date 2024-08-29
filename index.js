const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Array en memoria para almacenar las tareas
let tareas = [];
let idCounter = 1;

app.post('/tareas', (req, res) => {
    const tareasNuevas = req.body;

    // Verifica que sea un array
    if (!Array.isArray(tareasNuevas)) {
        return res.status(400).json({ message: 'Error de formato en el array' });
    }

    // Validar y agregar cada tarea
    const tareasCreadas = [];
    for (let i = 0; i < tareasNuevas.length; i++) {
        const tarea = tareasNuevas[i];

        if (!tarea.titulo || !tarea.descripcion) {
            return res.status(400).json({ message: `La tarea en la posición ${i} no tiene un título o descripción válidos` });
        }

        const nuevaTarea = {
            id: idCounter++,
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            completado: tarea.completado || false,
            fechaCreacion: new Date()
        };
        tareas.push(nuevaTarea);
        tareasCreadas.push(nuevaTarea);
    }

    res.status(201).json(tareasCreadas);
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


// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
