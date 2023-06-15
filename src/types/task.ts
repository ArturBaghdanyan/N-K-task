interface ITaskBase {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  employeeId: string;
}

export interface ITask extends ITaskBase {
  id: string;
}

export interface ITaskPayload extends ITaskBase {}
