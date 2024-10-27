import { IonButton } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
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
  const [initialX, setInitialX] = useState<number | null>(null);
  const [shakeRVal, setShakeRVal] = useState<number>(0);
  const [shakeLVal, setShakeLVal] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const history = useHistory();

  const SHAKE_THRESHOLD = 9; // sensor sensitivity
  const DEBOUNCE_TIME = 500; // Time in ms to debounce shakes
  const STABLE_TIME = 2000;
  const ERR_MARGIN = 5;
  const stableTimer = useRef<NodeJS.Timeout | null>(null); // Timer to track stable x values
  let lastShakeTime = Date.now();

  useEffect(() => {
    const DEAD_ZONE : number = 0; // Adjust as needed for sensitivity
    let lastDirection : "left" | "right" | null = null; 
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

        if(initialX === null && x != undefined){
          setInitialX(x)
        }

        // Check for right or left shake based on x-axis acceleration
        if (x && currentTime - lastShakeTime > DEBOUNCE_TIME && initialX) {
          // setShakeVal(currentTime - lastShakeTime)
          if (x - initialX > SHAKE_THRESHOLD && Math.abs(x) > DEAD_ZONE && lastDirection !== "right") {
            setShakeRVal(x)
            setShakeRight((prev) => prev + 1);
            lastShakeTime = currentTime;
            lastDirection = "right";
          } else if (x - initialX < -SHAKE_THRESHOLD && Math.abs(x) > DEAD_ZONE && lastDirection !== "left") {
            setShakeLVal(x)
            setShakeLeft((prev) => prev + 1);
            lastShakeTime = currentTime;
            lastDirection = "left";
          }
        }

        // Check if x is stable within errMargin of initialX
        if (initialX !== null && x && Math.abs(x - initialX) >= ERR_MARGIN) {
          if (!stableTimer.current) {
            stableTimer.current = setTimeout(() => {
              setInitialX(x); // Update initialX after stability
              stableTimer.current = null;
            }, STABLE_TIME);
          }
        } else if (stableTimer.current) {
          // Reset the timer if x goes out of range
          clearTimeout(stableTimer.current);
          stableTimer.current = null;
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

  return (
    <div>
      <h1>Motion Permission</h1>
      {!permissionGranted && (
        <>
          <p>We wont show this screen on the demo. This screen is to enable permission for sensor.</p>
          <p>Once permission is granted, demo starts from the next page (swipe-up)!!</p>
          <IonButton onClick={requestMotionPermission}>Enable Motion Data</IonButton>
          <IonButton onClick={requestMotionforDebug}>Shaking debug</IonButton>
        </>
      )}
      {permissionGranted && (
        <div>
          <p>X-axis acceleration: {acceleration.x} m/s²</p>
          <p>Initial X: {initialX} m/s²</p>
          {/* <p>Y-axis acceleration: {acceleration.y} m/s²</p>
          <p>Z-axis acceleration: {acceleration.z} m/s²</p> */}
          <p>Shake Right: {shakeRight} value: {shakeRVal}</p>
          <p>Shake Left: {shakeLeft} value: {shakeLVal}</p>
        </div>
      )}
    </div>
  );
}

export default Shaking;
