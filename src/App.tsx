import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { AppContextProvider } from "./db/Context";
import AddMaskPage from "./pages/AddMask";
import EditWearsPage from "./pages/EditWears";
import WhichShouldIWearPage from "./pages/whichShouldIWear";
import RotationsVerfahrenPage from "./pages/Rotationsverfahren";
import SettingsPage from "./pages/Settings";
import ScannerPage from "./pages/Scanner";

const App: React.FC = () => (
  <AppContextProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/mask/add">
            <AddMaskPage />
          </Route>
          <Route exact path="/mask/:id/wears">
            <EditWearsPage />
          </Route>
          <Route exact path="/mask/which">
            <WhichShouldIWearPage />
          </Route>
          <Route exact path="/mask/which-rotation">
            <RotationsVerfahrenPage />
          </Route>
          <Route exact path="/settings">
            <SettingsPage />
          </Route>
          <Route exact path="/scanner">
            <ScannerPage />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </AppContextProvider>
);

export default App;
