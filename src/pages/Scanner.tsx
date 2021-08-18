import {
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
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { BrowserCodeReader } from "@zxing/browser";
import { newScan } from "../functions/qrcodes";
import { Mask } from "../types/Mask";
import { useAppContext } from "../hooks/AppContext";
import {
  findMask,
  generateWearId,
  isCurrentlyWearing,
} from "../functions/Masks";
import {
  ActionAddMask,
  ActionAddWear,
  ActionStopCurrentWear,
} from "../db/Actions";

const ScannerPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const video = useRef<HTMLVideoElement | null>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currDeviceId, setDeviceId] = useState<string | undefined>();
  const [latestResult, setLatestResult] = useState<string | undefined>();

  const [mask, setMask] = useState<Mask | undefined>(undefined);

  const isMaskSaved = mask !== undefined;

  useEffect(() => {
    setMask(latestResult ? findMask(state.masks, latestResult) : undefined);
  }, [latestResult, state.masks]);

  useEffect(() => {
    if (!isPlatform("hybrid"))
      BrowserCodeReader.listVideoInputDevices().then((newDevices) =>
        setDevices(newDevices)
      );
  });

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
          <video hidden ref={video} />

          <IonCardHeader>
            <IonCardTitle>QR-/Barcode Scanner</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList lines="none">
              {isPlatform("hybrid") ? (
                ""
              ) : (
                <>
                  <IonItem>
                    <IonLabel>Kamera auswählen:</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonSelect
                      slot="start"
                      onIonChange={(e) => {
                        setDeviceId(e.detail.value);
                      }}
                      placeholder="Kamera">
                      {devices.map((dev) => (
                        <IonSelectOption value={dev.deviceId}>
                          {dev.label}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </>
              )}
              <IonItem>
                <IonButton
                  size="default"
                  onClick={() => {
                    newScan(video.current!, currDeviceId).then(
                      ({ status, data }) => {
                        if (status === "ok") {
                          setLatestResult(data);
                          console.log(data);
                        }
                        console.log({ status, data });
                      }
                    );
                  }}>
                  Scanner öffnen
                </IonButton>
                <IonButton
                  size="default"
                  onClick={() => setLatestResult(undefined)}>
                  Reset
                </IonButton>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        {latestResult ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{latestResult}</IonCardTitle>
              <IonCardSubtitle>
                {isMaskSaved
                  ? "Vorhandene Maske"
                  : "Maske noch nicht eingespeichert"}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              {isMaskSaved ? (
                <>
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
