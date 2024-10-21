import { FC, useEffect } from 'react';
import { IonButton } from '@ionic/react';

function createEvent<Type extends string, Detail>(
  type: Type,
  detail: Detail,
): CustomEvent<Detail> & { type: Type } {
  return new CustomEvent(type, { detail }) as CustomEvent<Detail> & { type: Type };
}

function getMaxAcceleration(event: DeviceMotionEvent): number {
  let max = 0;
  if (event.acceleration) {
    for (const key of ['x', 'y', 'z'] as const) {
      const value = Math.abs(event.acceleration[key] ?? 0);
      if (value > max) max = value;
    }
  }
  return max;
}

export type ShakeEventData = DeviceMotionEvent;
export type ShakeEvent = CustomEvent<ShakeEventData> & { type: 'shake' };
export type ShakeEventListener = (event: ShakeEvent) => void;

export type ShakeOptions = {
  threshold: number; // Minimum acceleration needed to dispatch an event (m/s²)
  timeout: number; // Duration between shake events (milliseconds)
};

export class Shake extends EventTarget {
  #approved?: boolean;
  #threshold: ShakeOptions['threshold'];
  #timeout: ShakeOptions['timeout'];
  #timeStamp: number;

  constructor(options?: Partial<ShakeOptions>) {
    super();
    const {
      threshold = 15,
      timeout = 1000,
    } = options ?? {};
    this.#threshold = threshold;
    this.#timeout = timeout;
    this.#timeStamp = timeout * -1;
  }

  addEventListener(type: 'shake', listener: ShakeEventListener | null, options?: boolean | AddEventListenerOptions): void {
    super.addEventListener(type, listener as EventListener, options);
  }

  dispatchEvent(event: ShakeEvent): boolean {
    return super.dispatchEvent(event);
  }

  async approve(): Promise<boolean> {
    if (typeof this.#approved === 'undefined') {
      if (!('DeviceMotionEvent' in window)) return this.#approved = false;
      try {
        type PermissionRequestFn = () => Promise<PermissionState>;
        type DME = typeof DeviceMotionEvent & { requestPermission: PermissionRequestFn };
        if (typeof (DeviceMotionEvent as DME).requestPermission === 'function') {
          const permissionState = await (DeviceMotionEvent as DME).requestPermission();
          this.#approved = permissionState === 'granted';
        } else this.#approved = true;
      } catch {
        this.#approved = false;
      }
    }
    return this.#approved;
  }

  #handleDeviceMotion = (event: DeviceMotionEvent): void => {
    const diff = event.timeStamp - this.#timeStamp;
    if (diff < this.#timeout) return;
    const accel = getMaxAcceleration(event);
    if (accel < this.#threshold) return;
    this.#timeStamp = event.timeStamp;
    this.dispatchEvent(createEvent('shake', event));
  };

  async start(): Promise<boolean> {
    const approved = await this.approve();
    if (!approved) return false;
    window.addEventListener('devicemotion', this.#handleDeviceMotion);
    return true;
  }

  stop(): void {
    window.removeEventListener('devicemotion', this.#handleDeviceMotion);
  }
}

const Shaking: React.FC = () => {
  const shake = new Shake({ threshold: 15, timeout: 1000 });

  useEffect(() => {
    // Event listener for shake events
    const shakeListener = (event: ShakeEvent) => {
      console.log('Shake detected!', event.detail);
    };

    shake.addEventListener('shake', shakeListener);

    return () => {
      shake.removeEventListener('shake', shakeListener);
      shake.stop(); // Clean up on unmount
    };
  }, []);

  const handleStart = async () => {
    const approved = await shake.start();
    if (!approved) {
      console.error('Shake permission denied');
    } else {
      console.log('Shake detection started');
    }
    // console.log("click");
    
  };

  return (
    <div>
      <h1>Shake Detector</h1>
      {/* <button onClick={handleStart}>Start Listening for Shakes</button> */}
      <IonButton onClick={handleStart}>Click</IonButton>
      <p>Shake your phone to see the results in the console.</p>
    </div>
  );
};

export default Shaking;
