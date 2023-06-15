import { Route, Switch } from 'react-router-dom';
import { Employees, Tasks } from '../../pages';
import { Home } from '../../pages/home';
import { routes } from './route';
import { Employee } from '../../pages/employees/id';

export const Routes = () => {
  return (
    <Switch>
      <Route exact path={routes.home} component={Home} />
      <Route exact path={routes.employees} component={Employees} />
      <Route
        exact
        path={`${routes.employees}/:employeeId`}
        component={Employee}
      />
      <Route exact path={routes.tasks} component={Tasks} />
    </Switch>
  );
};
