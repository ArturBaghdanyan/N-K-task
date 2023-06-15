import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { employeeInitialState } from '../types';
import { useSnackbar } from '../../../shared/hooks';
import EmployeeService from '../../../shared/services/employee.service';
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import TaskService from '../../../shared/services/task.service';
import { ITask } from '../../../types/task';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { containerStyles } from './styles';
export const Employee = () => {
  const { employeeId } = useParams<any>();

  const [employee, setEmployee] = useState<any>(employeeInitialState);
  const [employeeTasks, setEmployeeTasks] = useState<Array<ITask>>([]);
  const { setSnackbar } = useSnackbar();

  const getEmployee = async () => {
    try {
      const res = await EmployeeService.getEmployee(employeeId);
      return setEmployee(res);
    } catch (ex) {
      return setSnackbar({
        message: ex,
        severity: 'error',
      });
    }
  };

  const getEmployeeTasks = async () => {
    try {
      const res = await TaskService.getEmployeeTasks(employeeId);
      return setEmployeeTasks(res);
    } catch (ex) {
      return setSnackbar({
        message: ex,
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (!employeeId) return;

    getEmployee();
    getEmployeeTasks();
  }, [employeeId]);

  return (
    <Box
      sx={containerStyles}
    >
      {Object.keys(employee).map((key) => (
        <TextField disabled label={key.toUpperCase()} value={employee[key]} />
      ))}
      <Typography>Tasks: </Typography>
      <List>
        {employeeTasks.map((task) => (
          <ListItem sx={{ border: '0.5px solid grey' }}>
            <ListItemAvatar>
              <Avatar>
                <AssignmentIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={task.name} secondary={task.description} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
