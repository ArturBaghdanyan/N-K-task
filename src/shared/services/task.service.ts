import { ITask } from '../../types/task';
import HttpService from './http.service';

class TaskService {
  endpoint = 'tasks';

  getTasks = async (): Promise<Array<ITask>> => {
    const tasks = await HttpService.get(this.endpoint);
    return tasks as Array<ITask>;
  };

  getEmployeeTasks = async (employeeId: string) => {
    const tasks = await HttpService.get(
      `${this.endpoint}?employeeId=${employeeId}`
    );
    return tasks as Array<ITask>;
  };

  createTask = async (payload: any) => {
    return await HttpService.post(this.endpoint, payload);
  };

  updateTask = async (id: string, payload: any) => {
    return await HttpService.put(`${this.endpoint}/${id}`, payload);
  };

  deleteTask = async (id: string) => {
    return await HttpService.delete(`${this.endpoint}/${id}`);
  };
}

export default new TaskService();
