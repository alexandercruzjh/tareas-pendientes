# Aplicación de Tareas

Esta es una **aplicación de gestión de tareas** desarrollada con React y TypeScript.  
Permite organizar tareas, establecer fechas de vencimiento y mostrar alertas visuales cuando las tareas están próximas a vencer o ya vencidas.  

Incluye un sistema de progreso general y persistencia de datos en **localStorage**.

## Tecnologías utilizadas
- **React** con **TypeScript** para la lógica y la UI
- **TailwindCSS** y **shadcn/ui** para estilos y componentes
- **Zod** para validación de datos
- **Lucide-react** para íconos

## Características
- Agregar, marcar como completadas y eliminar tareas
- Indicador de progreso general
- Diferenciación visual de:
  - 🟢 Tareas completadas  
  - 🟢 Tareas activas  
  - 🟡 Tareas próximas a vencer  
  - 🔴 Tareas vencidas  
- Persistencia de tareas en el navegador con `localStorage`

## Vista previa
[Visitar aplicación](https://tareas-pendientes-delta.vercel.app/)

## Instalación y uso
Clona el repositorio en tu máquina local:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
```

Instala las dependencias:
```bash
npm install
```

Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en http://localhost:5173/ (o el puerto configurado por Vite).

## Contacto
- **LinkedIn:** [Alexander Cruz](https://www.linkedin.com/in/alexander-cruz-480526351)
- **GitHub:** [alexandercruzjh](https://github.com/alexandercruzjh)
- **Email:** alexandercruzjh@gmail.com

---
*Desarrollado por Alexander Cruz*
