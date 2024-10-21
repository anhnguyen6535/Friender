import { useEffect, useState } from 'react';
// import './App.css';

interface Acceleration {
  x: number;
  y: number;
  z: number;
}

function Shaking() {
  const [acceleration, setAcceleration] = useState<Acceleration>({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    // Handle device motion
    function handleMotion(event: DeviceMotionEvent) {
      if (event.accelerationIncludingGravity) {
        const { x, y, z } = event.accelerationIncludingGravity;
        
        setAcceleration({
          x: x ? parseFloat(x.toFixed(2)) : 0, // Use 0 if x is null
          y: y ? parseFloat(y.toFixed(2)) : 0, // Use 0 if y is null
          z: z ? parseFloat(z.toFixed(2)) : 0, // Use 0 if z is null
        });

        // Log the acceleration data
        console.log(`X: ${x} m/s²`);
        console.log(`Y: ${y} m/s²`);
        console.log(`Z: ${z} m/s²`);
      }
    }

    // Add event listener for devicemotion
    window.addEventListener('devicemotion', handleMotion);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return (
    <div>
      <h1>Device Motion Data</h1>
      <p>X-axis acceleration: {acceleration.x} m/s²</p>
      <p>Y-axis acceleration: {acceleration.y} m/s²</p>
      <p>Z-axis acceleration: {acceleration.z} m/s²</p>
    </div>
  );
}

export default Shaking;
