import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IonContent, IonPage, createAnimation, IonButton, IonItem, IonCheckbox, IonFooter, IonRow, IonGrid, IonCol, IonHeader, IonImg } from '@ionic/react';
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

	const unlockSequence = [10, 0, 11, 8]; // Unlock sequence = [Naruto, Erza, Gojo(Student), Jiraiya]
	const seeCorrectWithin = 4; // Constant variable to set AT MOST how many cards you'll see before seeing the correct card.

	const [currentIndex, setCurrentIndex] = useState(0)
	const [isAnimating, setIsAnimating] = useState(false)
	const [reshuffleProgress, setReshuffleProgress] = useState(0);
	const [successScore, setSuccessScore] = useState(0);
	const [noCardLeft, setNoCardLeft] = useState(false)		// DEBUG PURPOSE ONLY
	const [isUnlocked, setIsUnlocked] = useState(false);
  
	// SHake states
	const [shakeRight, setShakeRight] = useState<number>(0);
  	const [shakeLeft, setShakeLeft] = useState<number>(0);

	function shuffleArray(array: Image[]) {
		const newArray = [...array];
		// for (let i = newArray.length - 1; i > 0; i--) {
		//   const j = Math.floor(Math.random() * (i + 1));
		//   [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
		// }
		
		// Reversing sorting direction to make it easier to setup unlock sequence.
		let incorrectCount = 0;
		let correctCount = 0;
		for (let i = 0; i < newArray.length - 2; i++) {
			let j = Math.floor((i + 1) + (Math.random() * (newArray.length - (i + 1)))); // initialize j to be random first

			// While loop to avoid a correct card from appearing earlier than expected
			while(unlockSequence.includes(newArray[j].id, correctCount + 1)) {
				j = Math.floor((i + 1) + (Math.random() * (newArray.length - (i + 1))));
			}

			// This section adds in a guarantee chance for correct card to show up within `seeCorrectWithin` value. 
			// Chances increase the more incorrects are selected.
			const forceCorrectChance = Math.floor((incorrectCount / seeCorrectWithin) * 100);
			const forceCorrect = Math.floor(1 + (Math.random() * 100)); // [0, 100]% chance
			if(forceCorrect < forceCorrectChance && correctCount < unlockSequence.length) { // check to see if rolled to guarantee correct
				j = newArray.findIndex((image) => image.id == unlockSequence[correctCount]);
			}

			// If/Else to see if it needs to update correct/incorrect values.
			if(newArray[j].id != unlockSequence[correctCount]) {
				incorrectCount++;
			} 
			else {
				incorrectCount = 0;
				correctCount++;
			}
			[newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
		}
		return newArray;
	}

	const imgArr = useMemo(() => shuffleArray(Images), [noCardLeft]); // Updated so that if setNoCardLeft is ever used, it will reshuffle!

	const ionContent = useRef<HTMLIonContentElement>(null)
	const ionFooter = useRef<HTMLIonFooterElement>(null)
	const cardRefs = useRef<(HTMLIonCardElement | null)[]>(Array(Images.length).fill(null))

	async function reshuffle() {
		console.log('reshuffling');
		setNoCardLeft(true);

		// Loop through all cards and reset their positions by playing a new animation.
		for(let i = imgArr.length - 1; i >= 0; i--) {
			// setReshuffleProgress(prev => prev + 1);
			const randomX = Math.floor(Math.random() * 100);
			if(cardRefs.current[i]) {

				const cardSlide = createAnimation()
				.duration(75)
				.keyframes([
				{ offset: 0, transform: `translateX(${(randomX >= 50 ? 1 : -1)}50px) translateY(-700px) rotate(0deg)` }, 
				{ offset: 1, transform: `translateX(0px) translateY(0px) rotate(0deg)` } 
				]);

				cardSlide.addElement(cardRefs.current[i]!)

				cardRefs.current[i]!.style.zIndex

				await cardSlide.play().then(() => {
					// setReshuffleProgress(prev => prev - 1);
				});
			}
		}

		// Reset states
		setCurrentIndex(0);
		setSuccessScore(0);
		setNoCardLeft(false);
		setIsUnlocked(false);
		setShakeLeft(0);
		setShakeRight(0);
	}

	const swipeCard = (direction: number) => {
		if(currentIndex >= imgArr.length - 1){
			console.log('fail');
			reshuffle();
		} 
		
		// else if (cardRefs.current[currentIndex] && !isAnimating) { // Testing to see if isAnimating is necessary. Cards feel more responsive with buttons without
		else if (cardRefs.current[currentIndex]) {

			// Section to track progress and update a "Score" only on swipe rights
			// NOTE: This code only works if cards are not re-used. If cards will be re-used after shaking left, this will need to change.
			if(direction == 1){
				imgArr[currentIndex].id == unlockSequence[Math.max(0, successScore)] ? setSuccessScore(prev => prev + 1) : setSuccessScore(prev => prev - 1); // If correct, add 1 to score, otherwise subtract 1
			}

			setIsAnimating(true)
			setCurrentIndex(currentIndex+1) // Moved here to update currentIndex without waiting for animation to end.
			const cardSlide = createAnimation()
				.addElement(cardRefs.current[currentIndex]) 
				.duration(500)
				.keyframes([
				{ offset: 0, transform: 'translateX(0px) rotate(0deg)' }, 
				{ offset: 1, transform: `translateX(${700*direction}px) rotate(50deg)` } 
				]);

			// Play the animation
			cardSlide.play().then(() => {
				// setCurrentIndex(currentIndex+1) // Moved to line 95 to update without waiting for animation to end
				setIsAnimating(false)
			});
		}
	};

	// Callback for setIsAnimation(false) to check if the phone needs to unlock when the animation ends.
	function checkSuccessState() {
		// This section makes sures it returns when sequence has been met
		if(!isUnlocked && successScore >= unlockSequence.length && ionContent.current && ionFooter.current) {
			console.log('Success - Route/Transition to app screen');
			// Insert routing to unlocked page?
			setIsUnlocked(true);
			
			const openHomeScreen = createAnimation()
				.addElement(ionContent.current) 
				.addElement(ionFooter.current) 
				.easing('ease-out')
				.duration(500)
				.keyframes([
				{ offset: 0, transform: 'translateY(0px)' }, 
				{ offset: 1, transform: `translateY(-1600px)` } 
				]);

			// Play the animation of the unlock screen lifting
			openHomeScreen.play().then(() => {
			});
		} else if(shakeRight >= unlockSequence.length && successScore < unlockSequence.length){
			console.log('fail');
			reshuffle();
		}
		return;
	}

	// Moved shake states above
	const SHAKE_THRESHOLD = 5; // sensor sensitivity
	const DEBOUNCE_TIME = 300; // Time in ms to debounce shakes
	let lastShakeTime = Date.now();
  
	useEffect(() => {
		checkSuccessState();
		// Function to handle motion events
		function handleMotion(event: DeviceMotionEvent) {
			if (event.accelerationIncludingGravity) {
			const { x, y, z } = event.accelerationIncludingGravity;
			const currentTime = Date.now();
	
			// Check for right or left shake based on x-axis acceleration
			// if (reshuffleProgress <= 0 && x && currentTime - lastShakeTime > DEBOUNCE_TIME) { // Makes sure it only shakes once reshuffle animations are complete
			if (x && currentTime - lastShakeTime > DEBOUNCE_TIME) { // Makes sure it only shakes once reshuffle animations are complete
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
			<IonContent ref={ionContent} scrollY={false} fullscreen={true} >

				{imgArr.slice(0, Images.length).map((imgData, index) =>(
					<ImgCard
						key={index}
						imgData={imgData}
						topPosOffset={`${13 + 1*index}%`}
						zIndex={Images.length+6 - index}
						ref={el => cardRefs.current[index] = el}
						topCard={true}
						rotateVal={`${((index % 2) ? -1 : 1) * (3 - (0.35 * (index % 4)))}deg`} // Idk I tried making it look random without using random :c (Random keeps changing every update)
					/>
				))}

				{/* {Array(4).fill(null).map((_, index) => (
					<ImgCard
						key={index}
						topPosOffset={`${13 - 2*index}%`}
						zIndex={index} 
					/>
				))} */}
				
				{/* <IonButton onClick={() => {if(reshuffleProgress > 0) return; swipeCard(-1); setShakeLeft(prev => prev + 1)}}>Left</IonButton>
				<IonButton onClick={() => {if(reshuffleProgress > 0) return; swipeCard(1); setShakeRight(prev => prev + 1)}}>Right</IonButton> */}

				{/* DEBUG PURPOSE WILL DELETE WHEN SUBMIT!!!! */}
				
				{/* {noCardLeft ? <p style={{color: 'white'}}>No pic left</p> : 
					<>
						<span>Shake Right: {shakeRight} </span>
						<span>Shake Left: {shakeLeft}</span>
						<span>Score: {successScore}</span>
					</>
				} */}
				
			</IonContent>
			<IonFooter ref={ionFooter} hidden={true}>
				<IonGrid slot="fixed" fixed={true}>
					<IonRow>
						{Array(Math.min(unlockSequence.length, shakeRight)).fill(null).map((_, index) => (
							<IonCol 
								key={index}
							>
								<IonCheckbox 
									style={{"opacity": 1}} 
									labelPlacement="stacked" 
									disabled={true} 
									checked={true} 
									alignment={'center'}
								></IonCheckbox>
							</IonCol>
						))}
						{Array(Math.max(0, unlockSequence.length - shakeRight)).fill(null).map((_, index) => (
							<IonCol
								key={index + shakeRight}
							>
								<IonCheckbox 
									style={{"opacity": 1}} 
									labelPlacement="stacked" 
									disabled={true} 
									alignment={'center'}
								></IonCheckbox>
							</IonCol>
						))}
					</IonRow>
				</IonGrid>
			</IonFooter>
		</IonPage>

	);
};

export default UnlockingPage;
