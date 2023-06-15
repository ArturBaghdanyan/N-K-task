import React from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Button } from '@mui/material';
import { TableActions } from './Actions';

export const Table = (props: any) => {
  const {
    columns,
    data,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    createButtonLabel,
    handleOpenModal,
    ...rest
  } = props;
  return (
    <MaterialReactTable
      displayColumnDefOptions={{
        'mrt-row-actions': {
          muiTableHeadCellProps: {
            align: 'center',
          },
          size: 120,
        },
      }}
      columns={columns}
      data={data}
      editingMode="modal"
      enableColumnOrdering
      enableEditing
      onEditingRowSave={handleEdit}
      onEditingRowCancel={handleCancelEdit}
      renderRowActions={({ row, table }) => (
        <TableActions
          handleEdit={table.setEditingRow}
          row={row}
          handleDelete={handleDelete}
        />
      )}
      renderTopToolbarCustomActions={() => (
        <Button
          color="secondary"
          onClick={() => handleOpenModal(true)}
          variant="contained"
        >
          {createButtonLabel}
        </Button>
      )}
      {...rest}
    />
  );
};
