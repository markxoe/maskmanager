import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonPage,
  IonSlide,
  IonSlides,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { arrowForward, qrCode } from "ionicons/icons";
import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router";
import IonPadding from "../components/IonPadding";
import { ActionAddMask } from "../db/Actions";
import { AppContext } from "../db/Context";
import { generateMaskId } from "../functions/Masks";

import "./AddMask.css";

const AddMaskPage: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const history = useHistory();
  const swiper = useRef<null | HTMLIonSlidesElement>(null);

  const [newID, setNewID] = useState<string | undefined>("");
  const [isOpenModal, setIsOpenModal] = useState(false);

  useIonViewWillEnter(() => {
    setNewID(generateMaskId());
  });

  const isNewIdValid =
    state.masks.find((i) => i.id === newID) === undefined && newID?.length;

  const goToSeNextSlide = () => {
    swiper.current?.slideNext().catch(() => {});
  };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Maske hinzufügen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSlides ref={swiper}>
          <IonSlide>
            <IonPadding>
              <h1>Schritt 1: Maske auspacken</h1>
              <h2>
                <IonButton fill="clear" onClick={() => goToSeNextSlide()}>
                  Weiter <IonIcon icon={arrowForward} slot="end" />
                </IonButton>
              </h2>
            </IonPadding>
          </IonSlide>
          <IonSlide>
            <IonPadding>
              <h1>Schritt 2: Maske beschriften</h1>
              <h2>Beschrifte deine Maske mit</h2>
              <h2>
                <code>{newID}</code>
              </h2>
              <h5>
                Ne, der Code gefällt mit nicht:
                <br />
                <IonButton onClick={() => setNewID(generateMaskId())}>
                  Regenerieren
                </IonButton>
                <IonButton onClick={() => setIsOpenModal(true)}>
                  Eigener Code
                </IonButton>
                <br />
              </h5>
              <IonButton fill="clear" onClick={() => goToSeNextSlide()}>
                Weiter <IonIcon icon={arrowForward} slot="end" />
              </IonButton>
            </IonPadding>
          </IonSlide>
          <IonSlide>
            <IonPadding>
              <h1>Fertig</h1>
              <IonButton
                disabled={!isNewIdValid}
                onClick={() => {
                  if (newID)
                    dispatch(
                      ActionAddMask({
                        id: newID,
                        auspackungszeit: Date.now(),
                        wears: [],
                      })
                    );
                  history.goBack();
                }}>
                Speichern
              </IonButton>
            </IonPadding>
          </IonSlide>
        </IonSlides>
        <IonModal
          isOpen={isOpenModal}
          onDidDismiss={() => setIsOpenModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Eigener Code</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  disabled={!isNewIdValid}
                  onClick={() => setIsOpenModal(false)}>
                  Schließen
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonCard>
              <IonCardContent>
                <IonList lines="none">
                  <IonItem>
                    <IonInput
                      placeholder="BA65C"
                      type="text"
                      value={newID}
                      onIonChange={(e) => setNewID(e.detail.value ?? undefined)}
                    />
                    <IonButton
                      slot="end"
                      fill="clear"
                      routerLink="/scanner"
                      color="dark"
                      onClick={() => setIsOpenModal(false)}>
                      <IonIcon icon={qrCode} />
                    </IonButton>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AddMaskPage;
