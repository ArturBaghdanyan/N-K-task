import { useCallback, useEffect, useMemo, useState } from 'react';
import { type MaterialReactTableProps } from 'material-react-table';
import {
  Box,
  FormControl,
  Stack,
  TextField,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useSnackbar } from '../../shared/hooks';
import TaskService from '../../shared/services/task.service';
import { Table } from '../../components/Table';
import { CreateModal } from '../../components/CreateModal';
import { validateRequired } from '../../shared/utils';
import EmployeeService from '../../shared/services/employee.service';
import { ITask, ITaskPayload } from '../../types/task';
import { payloadInitialState } from './types';
import { containerStyle, stackStyle } from './styles';

const fields = [
  {
    name: 'name',
    label: 'Name',
  },
  {
    name: 'description',
    label: 'Description',
  },
  {
    name: 'startDate',
    label: 'Start Date',
  },
  {
    name: 'endDate',
    label: 'End Date',
  },
];

export const Tasks = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState<Array<ITask>>([]);
  const [employees, setEmployees] = useState<any>([]);
  const [taskPayload, setTaskPayload] =
    useState<ITaskPayload>(payloadInitialState);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const { setSnackbar } = useSnackbar();

  const getTask = async () => {
    try {
      const res = await TaskService.getTasks();
      return setTableData(res);
    } catch (ex) {
      return setSnackbar({
        message: ex,
        severity: 'error',
      });
    }
  };

  const getEmployees = async () => {
    try {
      const res = await EmployeeService.getEmployees();
      return setEmployees(res);
    } catch (ex) {
      return setSnackbar({
        message: ex,
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    getTask();
    getEmployees();
  }, []);

  const handleCreateTask = async () => {
    try {
      await TaskService.createTask(taskPayload);
      await getTask();
      return setSnackbar({
        message: 'Task created successfully',
        severity: 'success',
      });
    } catch (ex) {
      return setSnackbar({
        message: ex,
        severity: 'error',
      });
    } finally {
      setCreateModalOpen(false);
      setTaskPayload(payloadInitialState);
    }
  };

  const handleEditTask: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, values }) => {
      if (!Object.keys(validationErrors).length) {
        try {
          const { id, ...rest } = values;
          await TaskService.updateTask(id, rest);
          await getTask();
          return setSnackbar({
            message: `Task ${id} updated successfully`,
            severity: 'success',
          });
        } catch (ex) {
          return setSnackbar({
            message: ex,
            severity: 'error',
          });
        } finally {
          exitEditingMode();
        }
      }
    };


  const handleCancelEdit = () => {
    setValidationErrors({});
  };

  const handleDeleteTask = async (row: any) => {
    const { original: { id } } = row;
    try {
      await TaskService.deleteTask(id);
      setSnackbar({
        message: 'Task deleted successfully',
        severity: 'success',
      });
      return await getTask();
    } catch (ex) {
      return setSnackbar({ message: ex, severity: 'error' });
    }
  };

  const getCommonEditTextFieldProps = useCallback(
    (cell: any): any['muiTableBodyCellEditTextFieldProps'] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event: any) => {
          const isValid = validateRequired(event.target.value);
          if (!isValid) {
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorFn: (row: any) => {
          const employee = employees.find(
            (employee: any) => employee.id === row.employeeId
          );
          return (employee && employee.name) || '';
        },
        header: 'Employee',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps, employees]
  );


  return (
    <Box sx={containerStyle}>
      <Table
        columns={columns}
        data={tableData}
        handleEdit={handleEditTask}
        handleCancelEdit={handleCancelEdit}
        handleDelete={handleDeleteTask}
        createButtonLabel="Create New Task"
        handleOpenModal={setCreateModalOpen}
      />
      <CreateModal
        open={createModalOpen}
        fields={fields}
        onClose={() => setCreateModalOpen(false)}
        handleSubmit={handleCreateTask}
        createButtonText="Create"
        label="Create New Task"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack sx={stackStyle}>
            {fields.map((field: any, index: number) => (
              <TextField
                key={index}
                label={field.label}
                name={field.name}
                onChange={(e) =>
                  setTaskPayload({
                    ...taskPayload,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            ))}
            <FormControl>
              <InputLabel id="employee-label">Employees</InputLabel>
              <Select
                onChange={(e) =>
                  setTaskPayload({ ...taskPayload, employeeId: e.target.value })
                }
                id="employee-label"
                value={taskPayload.employeeId || ''}
                label={'Employees'}
              >
                {employees.map((employee: any) => (
                  <MenuItem value={employee.id}>{employee.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </form>
      </CreateModal>
    </Box>
  );
};
