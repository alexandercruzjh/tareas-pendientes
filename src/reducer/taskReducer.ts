
import * as z from "zod";

interface Task {
    id: number,
    title: string,
    completed: boolean,
    dueDate: Date,
    createdAt: Date,
}

interface taskState {
    tasks: Task[];
    length: number;
    completedNo: number;
    pendingNo: number;
}

export type TaskAction =
    | { type: 'ADD_TODO', payload: string, dueDate: string }
    | { type: 'TOGGLE_TODO', payload: number }
    | { type: 'DELETE_TODO', payload: number };

const TaskSchema = z.object({
    id: z.number(),
    title: z.string(),
    completed: z.boolean(),
    dueDate: z.string().transform((val) => new Date(val)), 
    createdAt: z.string().transform((val) => new Date(val)),
});

const TaskStateSchema = z.object({
    tasks: z.array(TaskSchema),
    completedNo: z.number(),
    pendingNo: z.number(),
    length: z.number(),
});

export const getTaskInitialState = (): taskState => {
    const localStorageState = localStorage.getItem('tasks');
    if (!localStorageState){
        return {
            tasks: [],
            completedNo: 0,
            pendingNo: 0,
            length: 0,
        };
    };

    const result = TaskStateSchema.safeParse(JSON.parse(localStorageState));

    if (result.error) {
        console.log(result.error);
        return {
            tasks: [],
            completedNo: 0,
            pendingNo: 0,
            length: 0,
        };
    };
    return result.data;
};

export const taskReducer = (state: taskState, action: TaskAction): taskState => {
    switch (action.type) {
        case 'ADD_TODO': {
            const newTask: Task = {
                id: Date.now(),
                title: action.payload.trim(),
                completed: false,
                dueDate: new Date(action.dueDate.replace(/-/g, '\/')),
                createdAt: new Date(),
            }
            return {
                ...state,
                tasks: [...state.tasks, newTask],
                length: state.tasks.length + 1,
                pendingNo: state.pendingNo + 1,
            };
        }
        case 'DELETE_TODO': {
            const updatedTasks = state.tasks.filter(task => task.id != action.payload);
            return {
                ...state,
                tasks: updatedTasks,
                length: updatedTasks.length,
                completedNo: updatedTasks.filter(task => task.completed === true).length,
                pendingNo: updatedTasks.filter(task => task.completed === false).length,
            };
        }
        case 'TOGGLE_TODO': {
            const updatedTasks = state.tasks.map(task => {
                if (task.id === action.payload) {
                    return { ...task, completed: !task.completed }
                };
                return task;
            });
            return {
                ...state,
                tasks: updatedTasks,
                completedNo: updatedTasks.filter(task => task.completed === true).length,
                pendingNo: updatedTasks.filter(task => task.completed === false).length,
            };
        }

        default:
            return state;
    };
};