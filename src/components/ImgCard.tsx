import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/react';
import { forwardRef, type FC } from 'react';

interface ImgDTO {
    name?: string;
    age?: string;
    occupation?: string;
    bio?: string;
    image?: string;
}

interface ImgCardProps {
    imgData?: ImgDTO;  // Use ImgDTO for profile data
    topPosOffset?: string;
    topCard?: boolean;
    zIndex: number;
    isSwiping?: boolean;
    isTransitioning?: boolean;
    swipeDirection?: string
}

const ImgCard = forwardRef<HTMLIonCardElement, ImgCardProps>(({
    imgData = {
        name: "Mr. Mysterious",
        age: "xx",
        occupation: "N/A",
        bio: "No bio available",
        image: ""
    },
    topPosOffset = '5%',
    topCard = true,
    zIndex,
    isSwiping = false, 
    isTransitioning = false, 
    swipeDirection = 'right',
}, ref) => {
    return (
        <IonCard
            ref={ref}
            color="dark"
            className={`${isSwiping ? (swipeDirection === 'right' ? 'swipe-out-right' : 'swipe-out-left') : ''}`}
            style={{ position: 'absolute', top: topPosOffset, left: '5%', zIndex }}
        >
            {topCard ? (
                <>
                    <IonImg className="friend-image" src={imgData.image} />
                    <IonCardHeader>
                        <IonCardSubtitle>{imgData.occupation}</IonCardSubtitle>
                        <IonCardTitle>{imgData.name}, {imgData.age}</IonCardTitle>
                    </IonCardHeader>
                </>
            ) : (
                <>
                    <IonImg className="friend-image"/>
                    <IonCardHeader>
                        <IonCardSubtitle>Test</IonCardSubtitle>
                        <IonCardTitle>Test</IonCardTitle>
                    </IonCardHeader>
                </>
            )}
        </IonCard>
    );
});

export default ImgCard;
