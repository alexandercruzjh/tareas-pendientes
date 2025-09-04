import { useState, useEffect, useReducer } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Clock, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTaskInitialState, taskReducer } from "./reducer/taskReducer"

export default function TodoApp() {
  const [inputValue, setInputValue] = useState('');
  const [inputDate, setInputDate] = useState('');

  const [state, dispatch] = useReducer(taskReducer, getTaskInitialState());

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state))
  }, [state])

  const addTask = () => {
    dispatch({ type: 'ADD_TODO', payload: inputValue, dueDate: inputDate })
    setInputValue('')
    setInputDate('')
  }

  const toggleTask = (id: number) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  }

  const deleteTask = (id: number) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  }

  const isTaskDueSoon = (dueDate: Date) => {
    const now = new Date()
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 2 && diffDays > 0
  }

  const isTaskOverdue = (dueDate: Date) => {
    const now = new Date()
    return dueDate < now
  }

  const { tasks, completedNo: completedTasks, length: totalTasks } = state;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const sortedTasks = [...tasks].sort((a, b) => {
    // Primero las no completadas, luego por fecha de vencimiento
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    return a.dueDate.getTime() - b.dueDate.getTime()
  })

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Mis Tareas Pendientes</h1>
          <p className="text-muted-foreground">Organiza tus tareas y mantente productivo</p>
        </div>

        {/* Barra de progreso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Progreso General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>
                {completedTasks} de {totalTasks} tareas completadas
              </span>
              <span className="font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Formulario para agregar tareas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Agregar Nueva Tarea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Añade una nueva tarea..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full sm:w-auto"
                />
                <Button onClick={addTask} disabled={!inputValue.trim() || !inputDate}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de tareas */}
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Circle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No tienes tareas pendientes. ¡Agrega una nueva tarea para comenzar!
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedTasks.map((task) => {
              const isDueSoon = isTaskDueSoon(task.dueDate)
              const isOverdue = isTaskOverdue(task.dueDate)

              return (
                <Card
                  key={task.id}
                  className={cn(
                    "transition-all duration-200 hover:shadow-md",
                    task.completed && "opacity-75",
                    isDueSoon && !task.completed && "border-red-500 bg-red-50 dark:bg-red-950/20",
                    isOverdue && !task.completed && "border-red-500 bg-red-50 dark:bg-red-950/20",
                    !isDueSoon && !isOverdue && !task.completed && "border-green-500 bg-green-50 dark:bg-green-950/20",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="mt-1" />

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h3
                            className={cn(
                              "font-medium text-balance",
                              task.completed && "line-through text-muted-foreground",
                            )}
                          >
                            {task.title}
                          </h3>

                          <div className="flex items-center gap-2 flex-wrap">
                            {isDueSoon && !task.completed && (
                              <Badge variant="destructive" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Por vencer
                              </Badge>
                            )}
                            {isOverdue && !task.completed && (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Vencida
                              </Badge>
                            )}

                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {task.dueDate.toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            Creada: {task.createdAt.toLocaleDateString("es-ES")}
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
