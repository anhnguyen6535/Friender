import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg } from '@ionic/react';
import { forwardRef, type FC } from 'react';

interface ImgDTO {
    name?: string;
    age?: string;
    occupation?: string;
    bio?: string;
    image?: string;
	rotation?: number
}

interface ImgCardProps {
    imgData?: ImgDTO; 
    topPosOffset?: string;
    zIndex: number;
    topCard?: boolean;
	rotateVal?: string;
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
    zIndex,
    topCard = false,
	rotateVal = '0'
}, ref) => {
    return (
        <IonCard
            ref={ref}
            color="dark"
            className={topCard ? 'topCard' : 'underCard'}
            style={{ position: 'absolute', top: topPosOffset, left: '5%', zIndex, rotate: rotateVal}}
        >
            <IonImg className="friend-image" src={topCard ? imgData.image : ""} />
            <IonCardHeader>
                <IonCardSubtitle>{topCard ? imgData.occupation : "Test"}</IonCardSubtitle>
                <IonCardTitle>{topCard ? `${imgData.name}, ${imgData.age}` : "Test"}</IonCardTitle>
            </IonCardHeader>
        </IonCard>
    );
});

export default ImgCard;
