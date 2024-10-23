import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonImg, createGesture, GestureDetail, createAnimation, IonButton } from '@ionic/react';
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
	function shuffleArray(array: Image[]) {
		const newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
		  const j = Math.floor(Math.random() * (i + 1));
		  [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
		}
		return newArray;
	}

	const imgArr = useMemo(() =>{
		const arr = shuffleArray(Images)
		console.log(Images);
		
		return arr
	},[])

	const ionContent = useRef<HTMLIonContentElement>(null)
	const cardRefs = useRef<(HTMLIonCardElement | null)[]>(Array(4).fill(null))

	const swipeCard = () => {
		if(currentIndex >= imgArr.length-1) console.log('fail');
		
		else if (cardRefs.current[currentIndex]) {
			const cardSlide = createAnimation()
				.addElement(cardRefs.current[currentIndex]) 
				.duration(500)
				.keyframes([
				{ offset: 0, transform: 'translateX(0px) rotate(0deg)' }, 
				{ offset: 1, transform: 'translateX(700px) rotate(50deg)' } 
				]);

			// Play the animation
			cardSlide.play().then(() => {
				setCurrentIndex(currentIndex+1)
			});
		}
	};
	
	return (
		<IonPage>
			<IonContent ref={ionContent} scrollY={false}>
				{imgArr.slice(0, 4).map((imgData, index) =>(
					<ImgCard
						key={index}
						imgData={imgData}
						zIndex={9 - index}
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
				
				<IonButton onClick={swipeCard}>Like</IonButton>
				
			</IonContent>
		</IonPage>

	);
};

export default UnlockingPage;
