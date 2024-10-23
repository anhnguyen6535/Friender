import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonPage, createGesture, GestureDetail } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import opening from './opening.jpg';

// createGesture: Ionic utility for creating custom gestures
// GestureDetail: TypeScript type definition for gesture details

const SwipeUnlock: React.FC = () => {
  // State to track the progress of the unlock gesture (0 to 1)
  const [isUnlocked, setIsUnlocked] = useState(0);
  const contentRef = useRef<HTMLIonContentElement | null>(null); // Ref to access the IonContent element
  const history = useHistory();

  useEffect(() => {
    if (contentRef.current) { 
      const gesture = createGesture({
        el: contentRef.current, // The element to attach the gesture to
        direction: 'y', // Allow vertical swiping only
        threshold: 10, // Minimum distance (in pixels) to start detecting the gesture
        gestureName: 'swipe-unlock',
        onMove: (detail: GestureDetail) => {
          // Calculate progress based on how far they've swiped
          const progress = Math.abs(detail.deltaY) / 300; 
          // Update the unlock state so it doesn't exceed 1
          setIsUnlocked(Math.min(progress, 1));
        },
        onEnd: (detail: GestureDetail) => {
          if (detail.deltaY < -500) {
            // If swiped up more than 500 pixels, navigate to home page
            history.push('/home'); 
          }
           // Reset the unlock progress
          setIsUnlocked(0);
        },
      });
      gesture.enable();

      return () => {
        gesture.destroy();
      };
    }
  }, []);

  return (
    <IonContent className="tester" ref={contentRef} 
    > {/* Assigning the ref here 
       ref={contentRef} attaches our ref to this element
      */}
      <div 
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '20px',
          background: `url(${opening})`, // Replace with your actual image URL
          backgroundSize:'cover',
          backgroundPosition: 'center', // Center the image
          backgroundRepeat: 'no-repeat',
          width: '100vw', // Full viewport width
          top: 0,
          left: 0,
          objectFit: 'cover'
        }}
      >
        <div style={{
          opacity: 1 - isUnlocked // Fade out as user swipes up
        }}>
          <div>Swipe Up To Unlock</div>
        </div>
      </div>
    </IonContent>
  );
};

export default SwipeUnlock;