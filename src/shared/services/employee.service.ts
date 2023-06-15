import { IEmployee } from '../../types/employees';
import HttpService from './http.service';

class EmployeeService {
  endpoint = 'employees';

  getEmployees = async (): Promise<Array<IEmployee>> => {
    const employees = await HttpService.get(this.endpoint);
    return employees as Array<IEmployee>;
  };

  getEmployee = async (id: string): Promise<IEmployee> => {
    const employee = await HttpService.get(`${this.endpoint}/${id}`);
    return employee as IEmployee;
  };

  createEmployee = async (payload: any) => {
    return await HttpService.post(this.endpoint, payload);
  };

  updateEmployee = async (id: string, payload: any) => {
    return await HttpService.put(`${this.endpoint}/${id}`, payload);
  };

  deleteEmployee = async (id: string) => {
    return await HttpService.delete(`${this.endpoint}/${id}`);
  };
}
export default new EmployeeService();
