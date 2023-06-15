interface IEmployeeBase {
  name: string;
  surname: string;
  email: string;
  position: string;
}

export interface IEmployee extends IEmployeeBase {
  id: string;
}

export interface IEmployeePayload extends IEmployeeBase {}
