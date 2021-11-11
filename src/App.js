import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import HomePage from "./Pages/HomePage";
import AdminHomePage from "./Pages/AdminHomePage";
import ViewAllOrders from "./Pages/ViewAllOrders";
import { PublicRoute } from "./Routes/PublicRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <PublicRoute exact path="/" component={Signup} />
          <PublicRoute exact path="/login" component={Login} />
          <PublicRoute exact path="/home" component={HomePage} />
          <PublicRoute exact path="/admin-page" component={AdminHomePage} />
          <PublicRoute exact path="/all-orders" component={ViewAllOrders} />
        </Switch>
      </Router>
    </div>
  );
}
export default App;
