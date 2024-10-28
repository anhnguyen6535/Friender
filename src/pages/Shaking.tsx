import { IonButton } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

interface Acceleration {
  x: number;
  y: number;
  z: number;
}

function Shaking() {
  const [acceleration, setAcceleration] = useState<Acceleration>({ x: 0, y: 0, z: 0 });
  const [shakeRight, setShakeRight] = useState<number>(0);
  const [shakeLeft, setShakeLeft] = useState<number>(0);
  const [shakeRVal, setShakeRVal] = useState<number>(0);
  const [shakeLVal, setShakeLVal] = useState<number>(0);
  const [debounceTime, setDebounceTime] = useState<number>(200);
  const [shakeThreshold, setShakeThreshold] = useState<number>(10.00);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const history = useHistory();

  // const SHAKE_THRESHOLD = 10.00; // sensor sensitivity
  // const DEBOUNCE_TIME = 200; // Time in ms to debounce shakes
  let lastShakeTime = Date.now();

  useEffect(() => {
    // Function to handle motion events
    function handleMotion(event: DeviceMotionEvent) {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        const currentTime = Date.now();

        // Set the acceleration state
        setAcceleration({
          x: x ? parseFloat(x.toFixed(2)) : 0,
          y: y ? parseFloat(y.toFixed(2)) : 0,
          z: z ? parseFloat(z.toFixed(2)) : 0,
        });

        // Check for right or left shake based on x-axis acceleration
        if (x && currentTime - lastShakeTime > debounceTime) {
          if (x > shakeThreshold) {
            setShakeRight(prev => prev + 1);
            setShakeRVal(x)
            lastShakeTime = currentTime; 
          } else if (x < -shakeThreshold) {
            setShakeLeft(prev => prev + 1);
            setShakeLVal(x)
            lastShakeTime = currentTime; 
          }
        }
      }
    }

    // Add the event listener only if permission is granted
    if (permissionGranted) {
      window.addEventListener('devicemotion', handleMotion);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (permissionGranted) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [permissionGranted]);

  // Function to request permission on iOS devices
  const requestMotionPermission = () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof (DeviceMotionEvent as any).requestPermission === 'function'
    ) {
      (DeviceMotionEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            setPermissionGranted(true);
            history.push('/swipe-up')
          } else {
            alert('Permission for motion data was denied.');
          }
        })
        .catch((error: Error) => {
          console.error('Error requesting device motion permission:', error);
        });
    } else {
      // Non-iOS devices or older Safari versions
      setPermissionGranted(true);
      history.push('/swipe-up')
    }
  };

  const requestMotionforDebug = () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof (DeviceMotionEvent as any).requestPermission === 'function'
    ) {
      (DeviceMotionEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            setPermissionGranted(true);
            // history.push('/swipe-up')
          } else {
            alert('Permission for motion data was denied.');
          }
        })
        .catch((error: Error) => {
          console.error('Error requesting device motion permission:', error);
        });
    } else {
      // Non-iOS devices or older Safari versions
      setPermissionGranted(true);
      // history.push('/swipe-up')
    }
  };

  const increaseDebounce = () =>{ setDebounceTime(prev => prev + 50)}
  const decreaseDebounce = () =>{ setDebounceTime(prev => prev - 50)}
  const increaseShakeThreshold = () =>{ setShakeThreshold(prev => prev + 1)}
  const decreaseShakeThreshold = () =>{ setShakeThreshold(prev => prev - 1)}

  return (
    <div>
      <h1>Motion Permission</h1>
      {!permissionGranted && (
        <>
          <p>We wont show this screen on the demo. This screen is to enable permission for sensor.</p>
          <p>Once permission is granted, demo starts from the next page (swipe-up)!!</p>
          <IonButton onClick={requestMotionPermission}>Enable Motion Data</IonButton>
          {/* <IonButton onClick={requestMotionforDebug}>Shaking debug</IonButton> */}
        </>
      )}
      {permissionGranted && (
        <div>
          <p>X-axis acceleration: {acceleration.x} m/s²</p>
          {/* <p>Y-axis acceleration: {acceleration.y} m/s²</p>
          <p>Z-axis acceleration: {acceleration.z} m/s²</p> */}
          <p>Shake Right: {shakeRight} value: {shakeRVal}</p>
          <p>Shake Left: {shakeLeft} value: {shakeLVal}</p>
          <p>Debounce Time: {debounceTime}</p>
          <IonButton onClick={increaseDebounce} >Increase Debounce Time</IonButton>
          <IonButton onClick={decreaseDebounce} >Decrease Debounce Time</IonButton>
          <p>Shake Threshold: {shakeThreshold}</p>
          <IonButton onClick={increaseShakeThreshold} >Increase Shake Threshold</IonButton>
          <IonButton onClick={decreaseShakeThreshold} >Decrease Shake Threshold</IonButton>
        </div>
      )}
    </div>
  );
}

export default Shaking;