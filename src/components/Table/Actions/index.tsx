import {Box, IconButton, Tooltip} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import React from "react";

export const TableActions = (props: any) => {
  const { handleEdit, handleDelete, row } = props;

  return   <Box sx={{ display: 'flex', gap: '1rem' }}>
    <Tooltip arrow placement="left" title="Edit">
      <IconButton onClick={() => handleEdit(row)}>
        <Edit />
      </IconButton>
    </Tooltip>
    <Tooltip arrow placement="right" title="Delete">
      <IconButton color="error" onClick={() => handleDelete(row)}>
        <Delete />
      </IconButton>
    </Tooltip>
  </Box>
}
