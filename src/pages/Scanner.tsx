import {
  AlertOptions,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonAlert,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { newScan } from "../functions/qrcodes";
import { Mask } from "../types/Mask";
import { useAppContext } from "../hooks/AppContext";
import {
  findMask,
  generateWearId,
  getCurrentWear,
  getLatestWear,
  getMaskWearDuration,
  isCurrentlyWearing,
} from "../functions/Masks";
import {
  ActionAddMask,
  ActionAddWear,
  ActionDeleteMask,
  ActionSetCameraDirection,
  ActionStopCurrentWear,
} from "../db/Actions";
import { useIonToastAdvanced } from "../hooks/useIonToastAdvanced";
import { convertMStoHHMMSS } from "../functions/time";
import { useTime } from "../hooks/time";

const ScannerPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const time = useTime(500);
  const showToast = useIonToastAdvanced();
  const [openAlert] = useIonAlert();
  const video = useRef<HTMLVideoElement | null>(null);

  const [latestResult, setLatestResult] = useState<string | undefined>();

  const [mask, setMask] = useState<Mask | undefined>(undefined);

  const isMaskSaved = mask !== undefined;

  useEffect(() => {
    setMask(latestResult ? findMask(state.masks, latestResult) : undefined);
  }, [latestResult, state.masks]);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <video hidden ref={video} width="100%" />

          <IonCardHeader>
            <IonCardTitle>QR-/Barcode Scanner</IonCardTitle>
            <IonCardSubtitle>
              Scanne QR-/Barcodes von deiner Maske, um sie hinzuzufügen oder zu
              tragen. Jeder QR- oder Barcode ist zulässig.
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            {!isPlatform("hybrid") && (
              <IonList lines="none">
                <IonItem>
                  <IonLabel>Kamerarichtung:</IonLabel>
                </IonItem>
                <IonItem>
                  <IonSelect
                    interfaceOptions={{ translucent: true } as AlertOptions}
                    slot="start"
                    onIonChange={(e) => {
                      dispatch(ActionSetCameraDirection(e.detail.value));
                    }}
                    value={state.defaultCameraDirection}
                    placeholder="Kamera">
                    <IonSelectOption value={"environment"}>
                      Umgebungskamera
                    </IonSelectOption>
                    <IonSelectOption value={"user"}>
                      Frontkamera
                    </IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
            )}
            <IonButton
              size="default"
              onClick={() => {
                newScan(
                  video.current!,
                  (redirect) =>
                    openAlert("Kamera wird benötigt", [
                      { text: "Nö" },
                      { text: "Oke", handler: redirect },
                    ]),
                  state.defaultCameraDirection
                ).then(({ status, data, err }) => {
                  if (status === "ok") {
                    setLatestResult(data);
                    console.log(data);
                  } else {
                    showToast(err!, 5000);
                  }
                  console.log({ status, data, err });
                });
              }}>
              Scanner öffnen
            </IonButton>
            <IonButton
              size="default"
              onClick={() => setLatestResult(undefined)}>
              Reset
            </IonButton>
          </IonCardContent>
        </IonCard>
        {latestResult ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{latestResult}</IonCardTitle>
              <IonCardSubtitle>
                {isMaskSaved
                  ? `Ausgepackt am ${new Date(
                      mask!.auspackungszeit
                    ).toLocaleString()} | ${
                      mask!.wears.length
                    } mal Getragen | ${convertMStoHHMMSS(
                      getMaskWearDuration(mask!, true)
                    )}`
                  : "Maske noch nicht eingespeichert"}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {isMaskSaved ? (
                <>
                  <p>
                    {isCurrentlyWearing(mask!)
                      ? `Wird getragen seit ${convertMStoHHMMSS(
                          time - (getCurrentWear(mask!)?.startTime ?? 0)
                        )}`
                      : getLatestWear(mask!)
                      ? `Zuletzt getragen bis ${new Date(
                          getLatestWear(mask!).endTime ?? 0
                        ).toLocaleString()}`
                      : "Noch nicht getragen"}
                  </p>
                  <br />
                  {isCurrentlyWearing(mask!) ? (
                    <IonButton
                      onClick={() => dispatch(ActionStopCurrentWear(mask!))}>
                      Stoppe Tragen
                    </IonButton>
                  ) : (
                    <IonButton
                      onClick={() =>
                        dispatch(
                          ActionAddWear(mask!, {
                            id: generateWearId(),
                            startTime: Date.now(),
                          })
                        )
                      }>
                      Starte Tragen
                    </IonButton>
                  )}
                  <IonButton
                    color="danger"
                    onClick={() =>
                      openAlert("Bist du dir Sicher?", [
                        {
                          text: "Ja",
                          handler: () => dispatch(ActionDeleteMask(mask!)),
                        },
                        { text: "Nein" },
                      ])
                    }>
                    Maske löschen
                  </IonButton>
                </>
              ) : (
                <>
                  <IonButton
                    onClick={() =>
                      dispatch(
                        ActionAddMask({
                          auspackungszeit: Date.now(),
                          id: latestResult,
                          wears: [],
                        })
                      )
                    }>
                    Maske Hinzufügen
                  </IonButton>
                </>
              )}
            </IonCardContent>
          </IonCard>
        ) : (
          ""
        )}
      </IonContent>
    </IonPage>
  );
};

export default ScannerPage;
