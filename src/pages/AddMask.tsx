import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonSlide,
  IonSlides,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useContext } from "react";
import { useHistory } from "react-router";
import IonPadding from "../components/IonPadding";
import { ActionAddMask } from "../db/Actions";
import { AppContext } from "../db/Context";
import { generateMaskId } from "../functions/Masks";

import "./AddMask.css";

const AddMaskPage: React.FC = () => {
  const { dispatch } = useContext(AppContext);
  const history = useHistory();

  const [newID, setNewID] = React.useState("");

  useIonViewWillEnter(() => {
    setNewID(generateMaskId());
  });

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
        <IonSlides pager={true}>
          <IonSlide>
            <IonPadding>
              <h1>Schritt 1: Maske auspacken</h1>
            </IonPadding>
          </IonSlide>
          <IonSlide>
            <IonPadding>
              <h1>Schritt 2: Maske beschriften</h1>
              <h2>
                Beschrifte deine Maske mit <code>{newID}</code>
              </h2>
              <h4>
                Ne, der Code gefällt mit nicht:{" "}
                <IonButton onClick={() => setNewID(generateMaskId())}>
                  Regenerieren
                </IonButton>
              </h4>
            </IonPadding>
          </IonSlide>
          <IonSlide>
            <IonPadding>
              <h1>Fertig</h1>
              <IonButton
                onClick={() => {
                  dispatch(
                    ActionAddMask({
                      id: newID,
                      auspackungszeit: Date.now(),
                      wears: [],
                    })
                  );
                  history.push("/");
                }}>
                Fertig
              </IonButton>
            </IonPadding>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default AddMaskPage;
