import {BrowserRouter, Switch, Route} from "react-router-dom"
import News from "./routes/News";
import Home from "./routes/Home";

function Router(){
    return (
    <BrowserRouter>
        <Switch>
            <Route path={process.env.PUBLIC_URL + "/"}>
                <Home/>
            </Route>
            <Route path="/:news">
                <News/>
            </Route>
        </Switch>
    </BrowserRouter>
    )
}
export default Router;