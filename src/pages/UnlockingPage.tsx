import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IonContent, IonPage, createAnimation } from '@ionic/react';
import Images from "../assets/friendImages/images";

import './UnlockingPage.css';
import ImgCard from '../components/ImgCard';

interface Image {
	id: number;
	name: string;
	age: string;
	occupation: string;
	bio: string;
	image: string;
}

interface Acceleration {
	x: number;
	y: number;
	z: number;
}

const UnlockingPage: React.FC = () => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isAnimating, setIsAnimating] = useState(false)
	const [noCardLeft, setNoCardLeft] = useState(false)		// DEBUG PURPOSE ONLY
	function shuffleArray(array: Image[]) {
		const newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
		  const j = Math.floor(Math.random() * (i + 1));
		  [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
		}
		return newArray;
	}

	const imgArr = useMemo(() => shuffleArray(Images), []);

	const ionContent = useRef<HTMLIonContentElement>(null)
	const cardRefs = useRef<(HTMLIonCardElement | null)[]>(Array(Images.length).fill(null))

	const swipeCard = (direction: number) => {
		if(currentIndex >= imgArr.length-1){
			console.log('fail');
			setNoCardLeft(true)
		} 
		
		else if (cardRefs.current[currentIndex] && !isAnimating) {
			setIsAnimating(true)
			const cardSlide = createAnimation()
				.addElement(cardRefs.current[currentIndex]) 
				.duration(500)
				.keyframes([
				{ offset: 0, transform: 'translateX(0px) rotate(0deg)' }, 
				{ offset: 1, transform: `translateX(${700*direction}px) rotate(50deg)` } 
				]);

			// Play the animation
			cardSlide.play().then(() => {
				setCurrentIndex(currentIndex+1)
				setIsAnimating(false)
			});
		}
	};

  
	const [shakeRight, setShakeRight] = useState<number>(0);
  	const [shakeLeft, setShakeLeft] = useState<number>(0);
	const SHAKE_THRESHOLD = 5; // sensor sensitivity
	const DEBOUNCE_TIME = 300; // Time in ms to debounce shakes
	let lastShakeTime = Date.now();
  
	useEffect(() => {
		// Function to handle motion events
		function handleMotion(event: DeviceMotionEvent) {
			if (event.accelerationIncludingGravity) {
			const { x, y, z } = event.accelerationIncludingGravity;
			const currentTime = Date.now();
	
			// Check for right or left shake based on x-axis acceleration
			if (x && currentTime - lastShakeTime > DEBOUNCE_TIME) {
				if (x > SHAKE_THRESHOLD) {
					swipeCard(1)
					setShakeRight(prev => prev + 1);
					lastShakeTime = currentTime; 
				} else if (x < -SHAKE_THRESHOLD) {
					setShakeLeft(prev => prev + 1);
					swipeCard(-1)
					lastShakeTime = currentTime; 
				}
			}
			}
		}
  
		window.addEventListener('devicemotion', handleMotion);
		
		return () => {
			window.removeEventListener('devicemotion', handleMotion);
		};
	}, [isAnimating]);
	
	return (
		<IonPage>
			<IonContent ref={ionContent} scrollY={false}>
				{imgArr.slice(0, Images.length).map((imgData, index) =>(
					<ImgCard
						key={index}
						imgData={imgData}
						zIndex={Images.length+6 - index}
						ref={el => cardRefs.current[index] = el}
						topCard={true}
					/>
				))}

				{Array(4).fill(null).map((_, index) => (
					<ImgCard
						key={index}
						topPosOffset={`${13 - 2*index}%`}
						zIndex={index} 
					/>
				))}
				
				{/* <IonButton onClick={() => swipeCard(-1)}>Left</IonButton>
				<IonButton onClick={() => swipeCard(1)}>Right</IonButton> */}

				{/* DEBUG PURPOSE WILL DELETE WHEN SUBMIT!!!! */}
				
				{noCardLeft ? <p style={{color: 'white'}}>No pic left</p> : 
					<>
						<span>Shake Right: {shakeRight} </span>
						<span>Shake Left: {shakeLeft}</span>
					</>
				}
				
			</IonContent>
		</IonPage>

	);
};

export default UnlockingPage;
