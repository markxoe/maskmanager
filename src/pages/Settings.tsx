import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonListHeader,
  IonModal,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { save, trashBin } from "ionicons/icons";
import React, { useState } from "react";
import { ActionSetState } from "../db/Actions";
import { verifyImport } from "../functions/verifyimport";
import { useAppContext } from "../hooks/AppContext";
import { Share } from "@capacitor/share";
import { Clipboard } from "@capacitor/clipboard";
import { serializeState } from "../db/persistance";

const SettingsPage: React.FC = () => {
  const { dispatch, state } = useAppContext();
  const [openImport, setOpenImport] = useState(false);
  const [importInput, setImportInput] = useState("");
  const [showToast] = useIonToast();

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
                showToast("Daten sind jetzt in deiner Zwischenablage", 5000);
              })
            }>
            Export
          </IonButton>
        </IonItem>
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
                      showToast("Daten importiert", 5000);
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
