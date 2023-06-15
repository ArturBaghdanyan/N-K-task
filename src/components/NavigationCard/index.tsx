import { Box, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { containerStyles } from './styles.ts';
export const NavigationCard = (props: any) => {
  const { name, route } = props;
  const history = useHistory();
  return (
    <Box
      onClick={() => history.push(route)}
      sx={containerStyles}
    >
      <Typography fontWeight="bold">{name}</Typography>
    </Box>
  );
};
