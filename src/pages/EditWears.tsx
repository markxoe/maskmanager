import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../hooks/AppContext";
import { findMask, generateWearId, sortWears } from "../functions/Masks";
import { Mask } from "../types/Mask";
import IonPadding from "../components/IonPadding";
import { add, save, trashBin } from "ionicons/icons";
import { ActionAddWear, ActionDeleteWear } from "../db/Actions";

const EditWearsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { id } = useParams<{ id: string }>();
  const [toastOpen] = useIonToast();

  const [newWearStart, setNewWearStart] = useState(
    Date.now() - 1000 * 60 * 60 * 2
  );
  const [newWearEnd, setNewWearEnd] = useState(Date.now() - 1000 * 60 * 60);
  const [newWearModalOpen, setNewWearModalOpen] = useState(false);

  const [mask, setMask] = useState<Mask | undefined>(undefined);

  useEffect(() => {
    setMask(findMask(state.masks, id));
  }, [id, state.masks]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Tragungen von {id} ändern</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {mask ? (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{mask.id}</IonCardTitle>
                <IonCardSubtitle>
                  {new Date(mask.auspackungszeit).toLocaleString()}
                </IonCardSubtitle>
              </IonCardHeader>
            </IonCard>
            <IonListHeader>Tragungen</IonListHeader>
            <IonList>
              {sortWears(mask.wears).map((wear) => (
                <IonItem key={wear.id + wear.startTime + wear.endTime}>
                  <IonLabel>
                    Von {new Date(wear.startTime).toLocaleString()}
                  </IonLabel>
                  <IonLabel>
                    {wear.endTime ? (
                      `Bis ${new Date(wear.endTime).toLocaleString()}`
                    ) : (
                      <IonText color="danger">Jetzt</IonText>
                    )}
                  </IonLabel>
                  <IonButton
                    slot="end"
                    fill="clear"
                    color="danger"
                    onClick={() => dispatch(ActionDeleteWear(mask, wear))}>
                    <IonIcon slot="icon-only" icon={trashBin} />
                  </IonButton>
                </IonItem>
              ))}
            </IonList>

            <IonFab horizontal="end" vertical="bottom" slot="fixed">
              <IonFabButton onClick={() => setNewWearModalOpen(true)}>
                <IonIcon icon={add} />
              </IonFabButton>
            </IonFab>
          </>
        ) : (
          <IonPadding>
            <h1>Keine Maske gefunden</h1>
          </IonPadding>
        )}

        <IonModal isOpen={newWearModalOpen}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton
                  color="danger"
                  onClick={() => setNewWearModalOpen(false)}>
                  <IonIcon icon={trashBin} />
                </IonButton>
              </IonButtons>
              <IonTitle>Tragung hinzufügen</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() => {
                    if (mask) {
                      dispatch(
                        ActionAddWear(mask, {
                          id: generateWearId(),
                          startTime: newWearStart,
                          endTime: newWearEnd,
                        })
                      );
                      setNewWearModalOpen(false);
                    } else {
                      toastOpen("Action Illegal", 5000);
                      setNewWearModalOpen(false);
                    }
                  }}>
                  <IonIcon icon={save} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonLabel>Von:</IonLabel>
              <IonDatetime
                displayFormat="DD.MM.YYYY HH:mm:ss"
                pickerFormat="DD.MMMM.YYYY HH mm ss"
                value={new Date(newWearStart).toISOString()}
                onIonChange={(e) =>
                  setNewWearStart(new Date(e.detail.value ?? 0).getTime())
                }
                max={new Date(newWearEnd).toISOString()}
              />
            </IonItem>
            <IonItem>
              <IonLabel>Bis:</IonLabel>
              <IonDatetime
                displayFormat="DD.MM.YYYY HH:mm:ss"
                pickerFormat="DD.MMMM.YYYY HH mm ss"
                value={new Date(newWearEnd).toISOString()}
                onIonChange={(e) =>
                  setNewWearEnd(new Date(e.detail.value ?? 0).getTime())
                }
                min={new Date(newWearStart).toISOString()}
              />
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default EditWearsPage;
