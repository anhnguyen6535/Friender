import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonText, useIonRouter } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const UnlockFail: React.FC = () => {
    const history = useHistory();
    const [countdown, setCountdown] = useState(3);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
  
      const redirectTimer = setTimeout(() => {
        history.replace('/swipe-up'); // Redirect to the swipe-up page
        window.location.reload();
      }, 3000);
  
      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimer);
      };
    }, [history]);

    return (
        <IonPage>
          <IonContent className="ion-padding">
            <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '20px',
                textAlign: 'center'
              }}>
              <div>
                <IonText color="danger">
                  <h1>Failed Unlock</h1>
                </IonText>
                <p style={{color: "pink"}}>Redirecting back to unlock screen in: <br />{countdown} Seconds</p>
              </div>
            </div>
          </IonContent>
        </IonPage>
      );
    }

export default UnlockFail;