import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import SwipeUpUnlock from './components/swipeUp';
import FailUnlock from './components/unlockFail';
import UnlockingPage from './pages/UnlockingPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './App.css';
import Shaking from './pages/Shaking';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/swipe-up" component={SwipeUpUnlock} />
        <Route exact path="/home" component={UnlockingPage} />
        <Route exact path="/fail" component={FailUnlock} />
        {/* Swipe-up refers to the unlock screen. in order to change the screen behind it
            make sure you change the following line: history.push('/fail'); to which ever page you
            declare here
            
            FailUnlock refers to the fail screen upon failing the password puzzle. You
            can change which page it redirects to in this line: history.replace('/swipe-up');
            to whichever page you declare here. You can also redirect to the fail unlock page
            in your own component using history.push as opposed to a boolean!

            have fun! We can regroup next week to discuss how it should look appearance wise :)
            */}
        <Route exact path="/shake" component={Shaking} />
        <Route exact path="/">
          <Redirect to="/swipe-up" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
