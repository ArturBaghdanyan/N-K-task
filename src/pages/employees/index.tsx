import { useCallback, useEffect, useMemo, useState } from 'react';
import { type MaterialReactTableProps } from 'material-react-table';
import { Box, Stack, TextField } from '@mui/material';
import EmployeeService from '../../shared/services/employee.service';
import { useSnackbar } from '../../shared/hooks';
import { Table } from '../../components/Table';
import { CreateModal } from '../../components/CreateModal';
import { validateEmail, validateRequired } from '../../shared/utils';
import { IEmployeePayload, IEmployee } from '../../types/employees';
import { containerStyle, stackStyle } from './styles';
import { payloadInitialState } from './types';
import { useHistory } from 'react-router-dom';
import { routes } from '../../shared/routes/route';

const fields = [
  {
    name: 'name',
    label: 'Name',
  },
  {
    name: 'surname',
    label: 'Surname',
  },
  {
    name: 'email',
    label: 'Email',
  },
  {
    name: 'position',
    label: 'Position',
  },
];

export const Employees = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState<Array<IEmployee>>([]);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});
  const [employeePayload, setEmployeePayload] =
    useState<IEmployeePayload>(payloadInitialState);

  const { setSnackbar } = useSnackbar();
  const history = useHistory();

  const getEmployees = async () => {
    try {
      const res = await EmployeeService.getEmployees();
      return setTableData(res);
    } catch (ex) {
      return setSnackbar({
        message: ex,
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const handleCreateNewEmployee = async () => {
    try {
      await EmployeeService.createEmployee(employeePayload);
      await getEmployees();
      return setSnackbar({
        message: 'Employee created successfully',
        severity: 'success',
      });
    } catch (ex) {
      return setSnackbar({
        message: ex,
        severity: 'error',
      });
    } finally {
      setCreateModalOpen(false);
      setEmployeePayload(payloadInitialState);
    }
  };

  const handleEditEmployee: MaterialReactTableProps<any>['onEditingRowSave'] =
    async ({ exitEditingMode, values }) => {
      const { id, ...rest } = values;

      if (!Object.keys(validationErrors).length) {
        try {
          await EmployeeService.updateEmployee(id, rest);
          await getEmployees();
          return setSnackbar({
            message: `Employee ${id} updated successfully`,
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

  const handleDeleteEmployee = async (row: any) => {
    const {
      original: { id },
    } = row;
    try {
      await EmployeeService.deleteEmployee(id);
      setSnackbar({
        message: 'Employee deleted successfully',
        severity: 'success',
      });
      return await getEmployees();
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
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)
              : validateRequired(event.target.value);
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
        accessorKey: 'surname',
        header: 'Surname',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'email',
        }),
      },
      {
        accessorKey: 'position',
        header: 'Position',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }: any) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <Box sx={containerStyle}>
      <Table
        muiTableBodyRowProps={({ row }: any) => ({
          onClick: () => history.push(`${routes.employees}/${row.original.id}`),
          sx: {
            cursor: 'pointer',
          },
        })}
        columns={columns}
        data={tableData}
        handleEditEmployee={handleEditEmployee}
        handleCancelEdit={handleCancelEdit}
        handleDelete={handleDeleteEmployee}
        createButtonLabel="Create New Employee"
        handleOpenModal={setCreateModalOpen}
      />
      <CreateModal
        open={createModalOpen}
        fields={fields}
        onClose={() => setCreateModalOpen(false)}
        handleSubmit={handleCreateNewEmployee}
        createButtonText="Create"
        label="Create New Employee"
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack sx={stackStyle}>
            {fields.map((field: any, index: number) => (
              <TextField
                key={index}
                label={field.label}
                name={field.name}
                onChange={(e) =>
                  setEmployeePayload({
                    ...employeePayload,
                    [e.target.name]: e.target.value,
                  })
                }
              />
            ))}
          </Stack>
        </form>
      </CreateModal>
    </Box>
  );
};
