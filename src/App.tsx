import React, {useEffect, useState} from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Menu from './components/Menu';

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

/* Theme variables */
import './theme/variables.css';
import './theme/style.css';
import MainTabs from './pages/MainTabs';
import Login from './pages/Authenfication/Login/Login';
import Register from "./pages/Authenfication/Register/Register";
import {PushNotifications, Token, ActionPerformed, PushNotificationSchema} from "@capacitor/push-notifications";
import {Toast} from "@capacitor/toast";
import {notificationsRegistration,  showToast} from "./services/NotificationService";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonicApp />
  );
};

interface IonicAppProps { }

const IonicApp: React.FC<IonicAppProps> = ({}) => {
    const nullEntry: any[] = []
    const [notifications, setnotifications] = useState(nullEntry);
    useEffect(() => {
        try{
            registerNotifications();
        }
        catch(Exception){
            console.log("erreur notif "+Exception);
        }
    }, []);


    const registerNotifications = async () => {
        await PushNotifications.checkPermissions().then(async (res) => {
            if (res.receive !== 'granted') {
                await PushNotifications.requestPermissions().then((res) => {
                    if (res.receive === 'denied') {
                        showToast('Push Notification permission denied');
                    }
                    else {
                        showToast('Push Notification permission granted');
                        notificationsRegistration(setnotifications, notifications);
                    }
                });
            }
            else {
                notificationsRegistration(setnotifications, notifications);
            }
        }).catch((err) => {
            console.log("erreur notif "+err);
        });
    };

  return (
        <IonApp >
          <IonReactRouter>
            <IonSplitPane contentId="main">
              <Menu />
              <IonRouterOutlet id="main">
                {/*
                We use IonRoute here to keep the tabs state intact,
                which makes transitions between tabs and non tab pages smooth
                */}
                <Route path="/tabs" render={() => <MainTabs />} />
                <Route path="/login" component={Login}  exact/>
                <Route path="/register" component={Register} exact/>
                <Route path="/logout" />
                <Route path="/" render={() => <Redirect to={{pathname:"/login"}}/>} exact />
              </IonRouterOutlet>
            </IonSplitPane>
          </IonReactRouter>
        </IonApp>
      )
}

export default App;
