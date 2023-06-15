import { Box } from '@mui/material';
import { NavigationCard } from '../../components/NavigationCard';
import { routes } from '../../shared/routes/route';
import { navigationStyles } from './styles';
export const Home = () => {
  return (
    <Box
      sx={navigationStyles}
    >
      <NavigationCard name="Employees" route={routes.employees} />
      <NavigationCard name="Tasks" route={routes.tasks} />
    </Box>
  );
};
