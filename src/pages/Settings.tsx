import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonPage,
  IonTextarea,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { save, trashBin } from "ionicons/icons";
import React, { useState } from "react";
import { ActionSetState } from "../db/Actions";
import { verifyImport } from "../functions/verifyimport";
import { useAppContext } from "../hooks/AppContext";
import { Share } from "@capacitor/share";
import { Clipboard } from "@capacitor/clipboard";
import { serializeState } from "../db/persistance";
import { useIonToastAdvanced } from "../hooks/useIonToastAdvanced";
import githubMarkLight from "../assets/github-mark-light.png";
import githubMarkDark from "../assets/github-mark-dark.png";
import packageJson from "../../package.json";

import "./Settings.css";

const SettingsPage: React.FC = () => {
  const { dispatch, state } = useAppContext();
  const [openImport, setOpenImport] = useState(false);
  const [importInput, setImportInput] = useState("");
  const showToast = useIonToastAdvanced();

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Einstellungen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonListHeader>Daten Exportieren/Importieren</IonListHeader>
        <IonItem>
          <IonLabel>Daten Importieren</IonLabel>
          <IonButton slot="end" onClick={() => setOpenImport(true)}>
            Import
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel>Daten Exportieren</IonLabel>
          <IonButton
            slot="end"
            onClick={() =>
              Share.share({
                text: serializeState(state),
                dialogTitle: "Deine Daten",
              }).catch(() => {
                Clipboard.write({ string: serializeState(state) });
                showToast("Daten sind jetzt in deiner Zwischenablage", 5000, {
                  translucent: true,
                });
              })
            }>
            Export
          </IonButton>
        </IonItem>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Maskmanager {packageJson.version}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList lines="none">
              <IonItem href="https://github.com/markxoe/maskmanager" detail>
                <IonThumbnail slot="start">
                  <IonImg
                    src={state.darkmode ? githubMarkLight : githubMarkDark}
                  />
                </IonThumbnail>
                <IonLabel>
                  <h2>Made by markxoe</h2>
                  <h3>Source Code auf GitHub</h3>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonModal isOpen={openImport}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton color="danger" onClick={() => setOpenImport(false)}>
                  <IonIcon icon={trashBin} />
                </IonButton>
              </IonButtons>
              <IonTitle>Daten Importieren</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() => {
                    const data = verifyImport(importInput);
                    if (data === undefined) {
                      showToast("Daten nicht valide", 5000);
                    } else {
                      dispatch(ActionSetState(data));
                      showToast("Daten importiert", 5000, {
                        translucent: true,
                      });
                      setOpenImport(false);
                    }
                  }}>
                  <IonIcon icon={save} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonLabel position="stacked">Daten:</IonLabel>
              <IonTextarea
                rows={20}
                onIonChange={(e) => setImportInput(e.detail.value ?? "")}
              />
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
