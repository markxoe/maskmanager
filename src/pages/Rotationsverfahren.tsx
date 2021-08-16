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
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import {
  getColorForRotation,
  getLatestWear,
  getMaskWearDuration,
} from "../functions/Masks";
import { convertMStoHHMMSS, howManyDaysAgo } from "../functions/time";
import { useAppContext } from "../hooks/AppContext";

// TODO: Masken, die heute getragen wurden, markieren oder nach ganz oben packen

const RotationsVerfahrenPage: React.FC = () => {
  const { state } = useAppContext();
  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Rotationsverfahren</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Das Rotationsverfahren</IonCardTitle>
            <IonCardSubtitle>
              Ordne deine Masken einem Wochentag zu
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              Bei dem Rotationsverfahren ordnest du eine Maske dem Montag zu,
              eine dem Dienstag und so weiter. Nach einer Woche recyclest du
              dann die Maske von letzer Woche, sodass jede Maske 7 Tage trocknen
              kann
            </p>
            <p>
              Dieser Assistent hilft dir dabei. Bei jeder Maske steht nach dem{" "}
              <code>:</code>, wann die Maske zuletzt getragen wurde.
              <br />
              Die <IonText color="success">Grün</IonText> markierten, sind älter
              als 7 Tage.
              <br />
              Die <IonText color="warning">Orange</IonText> markierten, sind
              zwischen 5 und 6 Tage alt
              <br />
              Die <IonText color="danger">Rot</IonText> markierten, sind 5 Tage
              oder neuer alt, somit eher ungeeignet
              <br />
            </p>
            <p>
              Falls eine Maske öfters als 5 mal getragen wurde, wird dies
              ebenfalls Markiert
            </p>
            <p>Sortiert wird nach dem letzten Tragen, die älteste ganz oben</p>
            <p>
              Disclaimer: Die Wiederverwendung von Masken kann zu einem erhöhten
              Infektionsrisiko führen!
            </p>
          </IonCardContent>
        </IonCard>
        {state.masks
          .map((mask) => ({
            mask,
            latestWearEnd: getLatestWear(mask)?.endTime,
          }))
          .sort(
            (amask, bmask) =>
              (amask.latestWearEnd ?? 0) - (bmask.latestWearEnd ?? 0)
          )
          .map(({ mask, latestWearEnd }) => {
            return (
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>
                    {mask.id}:{" "}
                    {latestWearEnd !== undefined ? (
                      <>
                        Vor{" "}
                        <IonText
                          color={getColorForRotation(
                            howManyDaysAgo(latestWearEnd)
                          )}>
                          {howManyDaysAgo(latestWearEnd).toFixed(2)}
                        </IonText>{" "}
                        Tagen getragen
                      </>
                    ) : (
                      <IonText color="success">Noch nicht getragen</IonText>
                    )}
                  </IonCardTitle>
                  <IonCardSubtitle>
                    {new Date(mask.auspackungszeit).toLocaleString()} |{" "}
                    {convertMStoHHMMSS(getMaskWearDuration(mask, true))} |{" "}
                    <IonText color={mask.wears.length >= 5 ? "danger" : ""}>
                      {mask.wears.length} mal Getragen
                    </IonText>
                  </IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            );
          })}
      </IonContent>
    </IonPage>
  );
};

export default RotationsVerfahrenPage;
