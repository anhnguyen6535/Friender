import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonImg, createGesture, GestureDetail, createAnimation, IonButton } from '@ionic/react';
import type { Animation, Gesture } from '@ionic/react';
import Images from "../assets/friendImages/images";

import './UnlockingPage.css';
import ImgCard from '../components/ImgCard';

const UnlockingPageClone: React.FC = () => {


	var randomInt = Math.floor(Math.random() * Images.length);
	var currentFriend = randomInt;
	// var currentFriend = 0;
	
	randomInt = Math.floor(Math.random() * Images.length);
	var nextFriend = randomInt;
	// var nextFriend = 1;

	// Code modified from https://ionicframework.com/docs/utilities/animations for animation stuff

	// Bunch of references for updating specific elements
	const content = useRef<HTMLIonContentElement | null>(null);

	const frienderCard = useRef<HTMLIonCardElement | null>(null);
	const cardImage = useRef<HTMLIonImgElement | null>(null);
	const cardTitle = useRef<HTMLIonCardTitleElement | null>(null);
	const cardSubtitle = useRef<HTMLIonCardSubtitleElement | null>(null);

	const frienderCardUnder = useRef<HTMLIonCardElement | null>(null);
	const cardImageUnder = useRef<HTMLIonImgElement | null>(null);
	const cardTitleUnder = useRef<HTMLIonCardTitleElement | null>(null);
	const cardSubtitleUnder = useRef<HTMLIonCardSubtitleElement | null>(null);

	const initialStep = useRef<number>(0.5);
	const started = useRef<boolean>(false);

	const animation = useRef<Animation | null>(null);
	const gesture = useRef<Gesture | null>(null);

	// Initializes random ints and getting a new displayed Friend Thing
	// setCurrentFriend(Images[randomInt]);

	// 
	const displayNewFriend = () => {
		var lastRandom = randomInt;
		currentFriend = lastRandom;
		
		var lastRandom = randomInt;

		while (randomInt == lastRandom) {
			randomInt = Math.floor(Math.random() * Images.length);
		}

		// These update the info on the card on top with the card that was underneath it previously.
		const displayCurrentFriend = Images[currentFriend];
		if (cardImage.current) {
			cardImage.current.src = displayCurrentFriend.image;
		}
		if (cardTitle.current) {
			cardTitle.current.innerHTML = displayCurrentFriend.name + ", " + displayCurrentFriend.age;
		}
		if (cardSubtitle.current) {
			cardSubtitle.current.innerHTML = displayCurrentFriend.occupation;
		}
	}

	const displayNextFriend = () => {

		// These update the info on the card underneath with a new friend
		const displayNextFriend = Images[nextFriend];
		if (cardImageUnder.current) {
			cardImageUnder.current.src = displayNextFriend.image;
		}
		if (cardTitleUnder.current) {
			cardTitleUnder.current.innerHTML = displayNextFriend.name + ", " + displayNextFriend.age;
		}
		if (cardSubtitleUnder.current) {
			cardSubtitleUnder.current.innerHTML = displayNextFriend.occupation;
		}
	}

	useEffect(() => {
		if (content.current) {
			const target = content.current;

			if (target) {

				// Create an animation where 0 throws it left and 1 throws it right. 0.5 is base
				var cardSlide = createAnimation()
					.addElement(frienderCard.current!)
					.duration(1000)
					.keyframes([
						{ offset: 0, transform: 'translateX(-700px) rotate(-50deg)' },
						{ offset: 0.5, transform: 'translateX(0px) rotate(0deg)' },
						{ offset: 1, transform: 'translateX(700px) rotate(50deg)' }
					]);

				// Attach animation to ref of current animation
				if (animation.current === null) {
					animation.current = cardSlide;
					animation.current.progressStep(0.5);
				}

				// Create a new horizontal swipe gesture
				// gesture.current = createGesture({
				// 	el: target,
				// 	direction: 'x',
				// 	threshold: 5,
				// 	gestureName: 'swipe-horizontal',
				// 	onMove: (detail: GestureDetail) => onMove(detail),
				// 	onEnd: (detail: GestureDetail) => onEnd(detail)
				// });

				// Ensure that at the end of the animation, it will throw itself off screen, update its card
				cardSlide.onFinish(() => {
					// You may be looking at this and going why are you doing this? For some reason the images keep updating back to pre state upon animation finish for a split second before going to the next.
					// So I did this so that when the image resets position and updates itself, you won't see that weird flash :D
					if(frienderCard.current) {
						frienderCard.current.style.zIndex = '4';
						frienderCard.current.style.boxShadow = '0 0px 0px rgba(0, 0, 0, 0.12)';
					}
					if(frienderCardUnder.current)
						frienderCardUnder.current.style.zIndex = '5';

					// Makes sure animation stops and update top card friend info
					animation.current!.stop();
					displayNewFriend(); 
					// Re-enable gesture input
					// gesture.current!.enable(true);
				});

				// Enable the gesture
				// gesture.current.enable(true);


				

				// // Clamp and get step functions modified from https://ionicframework.com/docs/utilities/animations 
				// const clamp = (min: number, n: number, max: number) => {
				// 	return Math.max(min, Math.min(n, max));
				// };

				// const getStep = (ev: GestureDetail) => {
				// 	const delta = ev.deltaX + initialStep.current;
				// 	return clamp(0.0, (delta / window.innerWidth) + 0.5, 1.0);
				// };


				// return () => {
				// 	gesture.current!.destroy();
				// 	// cardSlide.destroy();
				// };
			}
		}
	}, [content]);

	const onMove = () => {
		if (!started.current) {
			// Resets animation to start
			animation.current!.progressStart(true);
			started.current = true;

			// This resets the z-indexes that were modified earlier upon moving the card. This was done to hide the weird image flash that happens when the top card resets position after animation and updates its info.
			if(frienderCard.current) {
				frienderCard.current.style.zIndex = '5';
				frienderCard.current.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)';
			}
			if(frienderCardUnder.current)
				frienderCardUnder.current.style.zIndex = '4';
			// Update card underneath
			displayNextFriend();
		}

		// Progress animation depending on how much you drag
		// animation.current!.progressStep(getStep(detail));
	}

	const onEnd = (detail: GestureDetail) => {
		if (!started.current) {
			return;
		}
		gesture.current!.enable(false);

		// Conditionals to check whether swipe left or right for now
		// if (detail.deltaX >= 0) {
		// 	animation.current!.progressEnd(1, getStep(detail));
		// }

		// else if (detail.deltaX < 0) {
		// 	animation.current!.progressEnd(0, getStep(detail));
		// }
		started.current = false;
	}

	const swipeCard = () => {
		if (content.current != null) {
			console.log("content:", content.current);
	
			// onMove()
			// if (currentCard.current != null) {
				console.log("Creating animation for current card:", frienderCard.current);
				// Create the card slide animation
				const cardSlide = createAnimation()
					.addElement(frienderCard.current!) // Current card
					.duration(1000)
					.keyframes([
						{ offset: 0, transform: 'translateX(0px)' }, // Start position
						{ offset: 1, transform: 'translateX(-700px)' } // Move left
					]);


	
				displayNewFriend()
				// Play the animation
				cardSlide.play().then(() =>{
					if (frienderCard.current) {
						frienderCard.current.style.zIndex = '4'; // Send current card back
						frienderCard.current.style.boxShadow = '0 0px 0px rgba(0, 0, 0, 0.12)';
					}
					if (frienderCardUnder.current) {
						frienderCardUnder.current.style.zIndex = '5'; // Promote the under card to the top
						frienderCardUnder.current.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.12)'; // Optional: add shadow for better visibility
					}


					displayNextFriend()

					

				})
		} 
	};

	return (
		<IonPage>
			<IonContent ref={content} scrollY={false}>
				{/* <ImgCard imgData={Images[currentFriend]} zIndex={5} ref={currentCard}/>
				<ImgCard imgData={Images[nextFriend]} zIndex={4} ref={nextCard}/> */}
				<IonCard color="dark" style={{ 'position': 'absolute', 'top': '5%', 'left': '5%', 'zIndex': '5' }} ref={frienderCard}>
					<IonImg ref={cardImage} className="friend-image" src={Images[currentFriend].image}></IonImg>
					<IonCardHeader>
						<IonCardSubtitle ref={cardSubtitle}>{Images[currentFriend].occupation}</IonCardSubtitle>
						<IonCardTitle ref={cardTitle}>{Images[currentFriend].name}, {Images[currentFriend].age}</IonCardTitle>
					</IonCardHeader>
				</IonCard>
				<IonCard color="dark" style={{ 'position': 'absolute', 'top': '5%', 'left': '5%', 'zIndex': '4' }} ref={frienderCardUnder}>
					<IonImg ref={cardImageUnder} className="friend-image" src={Images[nextFriend].image}></IonImg>
					<IonCardHeader>
						<IonCardSubtitle ref={cardSubtitleUnder}>{Images[nextFriend].occupation}</IonCardSubtitle>
						<IonCardTitle ref={cardTitleUnder}>{Images[nextFriend].name}, {Images[nextFriend].age}</IonCardTitle>
					</IonCardHeader>
				</IonCard>
				<IonButton onClick={swipeCard}>Like</IonButton>
				{/* <IonButton onClick={() => swipeCard('left')}>Dislike</IonButton> */}

				{/* Bunch of placeholder cards to give it that stack effect */}
				{Array(4).fill(0).map((_,index) =>(
					<ImgCard 
					key={index} 
					topCard={false} 
					topPosOffset={`${-index * 2 + 13}%`}  
					zIndex={0}
				/>
				))
				
				}
			</IonContent>
		</IonPage>
	);
};

export default UnlockingPageClone;
