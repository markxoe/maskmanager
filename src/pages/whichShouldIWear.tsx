import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import {
  calculateSenseofWearing,
  getMaskWearDuration,
} from "../functions/Masks";
import { convertMStoHHMMSS } from "../functions/time";
import { useAppContext } from "../hooks/AppContext";

const WhichShouldIWearPage: React.FC = () => {
  const { state } = useAppContext();

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Welche Maske soll ich tragen?</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Wie wird das Berechnet?</IonCardTitle>
            <IonCardSubtitle>
              Wichtig: Dies ist nur eine Berechnung und somit eine Empfehlung.
              Einige Faktoren wie die Feuchtigkeit werden nicht berücksichtigt
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Berechnung mit Punkten</p>
            <p>
              200 Punkte für letztes Tragen vor mehr als 7 Tagen oder neu. (Je
              weiter entfernt die letzte Nutzung ist, desto mehr Punkte gibt es)
            </p>
            <p>
              100 Punkte für 0 Stunden getragen (Je länger getragen, desto
              weniger Punkte (3h &rarr; 49, 7h &rarr; 25))
            </p>
            <p>
              50 Punkte für garnicht getragen. (Je öfter getragen, desto weniger
              Punkte (ab 5 mal Tragen &rarr; 0 Punkte))
            </p>
            <p>
              Disclaimer: Die Wiederverwendung von Masken kann zu einem erhöhten
              Infektionsrisiko führen!
            </p>
          </IonCardContent>
        </IonCard>

        <IonListHeader>Masken</IonListHeader>
        {state.masks
          .map((mask) => ({
            mask,
            senseOfWearing: calculateSenseofWearing(mask),
          }))
          .sort((a, b) => a.senseOfWearing - b.senseOfWearing)
          .reverse()
          .map(({ mask, senseOfWearing }, index) => (
            <IonCard key={`${mask.id}:${senseOfWearing}`}>
              <IonCardHeader>
                <IonCardTitle>
                  {mask.id}: {senseOfWearing.toFixed(2)}
                </IonCardTitle>
                <IonCardSubtitle>
                  {new Date(mask.auspackungszeit).toLocaleString()} |{" "}
                  {convertMStoHHMMSS(getMaskWearDuration(mask, true))}
                </IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default WhichShouldIWearPage;
