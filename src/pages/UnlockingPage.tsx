import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonImg, createGesture, GestureDetail, createAnimation, IonButton } from '@ionic/react';
import type { Animation, Gesture } from '@ionic/react';
import Images from "../assets/friendImages/images";

import './UnlockingPage.css';
import ImgCard from '../components/ImgCard';

interface Image {
	name: string;
	age: string;
	occupation: string;
	bio: string;
	image: string;
}

const UnlockingPage: React.FC = () => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [nextIndex, setNextIndex] = useState(1)
	function shuffleArray(array: Image[]) {
		const newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
		  const j = Math.floor(Math.random() * (i + 1));
		  [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
		}
		return newArray;
	}

	const imgArr = useMemo(() =>{
		return shuffleArray(Images)
	},[])

	const ionContent = useRef<HTMLIonContentElement>(null)
	const currentCard = useRef<HTMLIonCardElement>(null)
	const nextCard = useRef<HTMLIonCardElement>(null)
	const [isSwiping, setIsSwiping] = useState(false)
	const [isTransitioning, setIsTransitioning] = useState(false)
	const [isSwapping, setIsSwapping] = useState(true)


	const [swipeDirection, setSwipeDirection] = useState(''); // Track swipe direction ('right' for like, 'left' for dislike)

	const swipeCard = () => {
		if (ionContent.current != null) {
			// console.log("ionContent:", ionContent.current);
	
			// onMove()
			// if (currentCard.current != null) {
				console.log("isSwapping", isSwapping);
				console.log("currentImgIndex", currentCard.current?.style.zIndex);
				console.log("nextImgIndex", nextCard.current?.style.zIndex);
				// Create the card slide animation
				const cardSlide = createAnimation()
					.addElement(isSwapping ? currentCard.current! : nextCard.current!) // Current card
					.duration(1000)
					.keyframes([
						{ offset: 0, transform: 'translateX(0px)' }, // Start position
						{ offset: 1, transform: 'translateX(-700px)' } // Move left
					]);


	
				// Play the animation
				cardSlide.play().then(() =>{
					if(isSwapping) setNextIndex((currentIndex + 1) % imgArr.length)
					else setCurrentIndex((nextIndex+1) % imgArr.length)
					

				cardSlide.onFinish(() => {
					// You may be looking at this and going why are you doing this? For some reason the images keep updating back to pre state upon animation finish for a split second before going to the next.
					// So I did this so that when the image resets position and updates itself, you won't see that weird flash :D
					if(isSwapping){
						if (currentCard.current) {
							currentCard.current.style.zIndex = '4'; // Send current card back
							currentCard.current.style.boxShadow = '0 0px 0px rgba(0, 0, 0, 0.12)';
							// currentCard.current.style.transform = 'translateX(700px)';
						}
						if (nextCard.current) {
							nextCard.current.style.zIndex = '5'; // Promote the under card to the top
							nextCard.current.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)'; // Optional: add shadow for better visibility
							
						}
					}else{
						if (nextCard.current) {
							nextCard.current.style.zIndex = '4'; // Send current card back
							nextCard.current.style.boxShadow = '0 0px 0px rgba(0, 0, 0, 0.12)';
							// nextCard.current.style.transform = 'translateX(700px)';
						}
						if (currentCard.current) {
							currentCard.current.style.zIndex = '5'; // Promote the under card to the top
							currentCard.current.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)'; // Optional: add shadow for better visibility
						}
					}

					// Makes sure animation stops and update top card friend info
					// animation.current!.stop();
					// displayNewFriend(); 
					// Re-enable gesture input
					// gesture.current!.enable(true);
					const cardReverse = createAnimation()
					.addElement(isSwapping ? currentCard.current! : nextCard.current!) // Current card
					.duration(0)
					.keyframes([
						{ offset: 0, transform: 'translateX(0px)' }, // Start position
						// { offset: 1, transform: 'translateX(700px)' } // Move right
					]);
					
					cardReverse.play().then(() => {
						setIsSwapping(!isSwapping)
					
					})
				});
					
					
					// setIsSwapping(true);
				})
		} 
	};

	return (
		<IonPage>
			<IonContent ref={ionContent} scrollY={false}>
				<ImgCard imgData={imgArr[currentIndex]} zIndex={5} isSwiping={isSwiping} swipeDirection={swipeDirection} ref={currentCard}/>
				<ImgCard imgData={imgArr[nextIndex]} zIndex={4} ref={nextCard}/>
				
				<IonButton onClick={swipeCard}>Like</IonButton>
				{/* <IonButton onClick={() => swipeCard('left')}>Dislike</IonButton> */}
			</IonContent>
		</IonPage>

	);
};

export default UnlockingPage;
