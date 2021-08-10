import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonDatetime,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonListHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../hooks/AppContext";
import {
  findMask,
  generateWearId,
  isMaskValid,
  sortWears,
} from "../functions/Masks";
import { Mask } from "../types/Mask";
import IonPadding from "../components/IonPadding";
import { add, save, trashBin } from "ionicons/icons";
import { ActionAddWear, ActionDeleteWear } from "../db/Actions";
import { useIonToastAdvanced } from "../hooks/useIonToastAdvanced";

const EditWearsPage: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { id } = useParams<{ id: string }>();
  const showToast = useIonToastAdvanced();

  const [newWearStart, setNewWearStart] = useState(
    Date.now() - 1000 * 60 * 60 * 2
  );
  const [newWearEnd, setNewWearEnd] = useState(Date.now() - 1000 * 60 * 60);
  const [newWearModalOpen, setNewWearModalOpen] = useState(false);

  const [mask, setMask] = useState<Mask | undefined>(undefined);
  const [maskNotValid, setMaskNotValid] = useState<boolean>(false);

  useEffect(() => {
    setMask(findMask(state.masks, id));
  }, [id, state.masks]);

  useEffect(() => {
    setMaskNotValid(mask ? !isMaskValid(mask) : false);
  }, [mask]);

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              disabled={mask ? !isMaskValid(mask) : false}
              defaultHref="/"
            />
          </IonButtons>
          <IonTitle>Benutzungen von {id} ändern</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {mask ? (
          <>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{mask.id}</IonCardTitle>
                <IonCardSubtitle>
                  {new Date(mask.auspackungszeit).toLocaleString()}
                </IonCardSubtitle>
              </IonCardHeader>
              {maskNotValid ? (
                <IonCardContent>
                  <IonChip color="danger">Einträge überlappen sich</IonChip>
                </IonCardContent>
              ) : (
                ""
              )}
            </IonCard>
            <IonListHeader>Benutzungen</IonListHeader>
            {sortWears(mask.wears).map((wear) => (
              <IonCard key={wear.id + wear.startTime + wear.endTime}>
                <IonCardHeader>
                  <IonCardSubtitle>
                    Von {new Date(wear.startTime).toLocaleString()}
                  </IonCardSubtitle>

                  <IonCardSubtitle>
                    Bis{" "}
                    {wear.endTime
                      ? new Date(wear.endTime).toLocaleString()
                      : "Jetzt"}
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton
                    slot="end"
                    fill="clear"
                    color="danger"
                    onClick={() => dispatch(ActionDeleteWear(mask, wear))}>
                    <IonIcon slot="icon-only" icon={trashBin} />
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}

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
              <IonTitle>Benutzung hinzufügen</IonTitle>
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
                      showToast("Action Illegal", 5000, { translucent: true });
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
