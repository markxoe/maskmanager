import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { add, settings } from "ionicons/icons";
import {
  ActionAddWear,
  ActionDeleteMask,
  ActionStopCurrentWear,
} from "../db/Actions";
import {
  isCurrentlyWearing,
  generateWearId,
  getCurrentWear,
  getLatestWear,
  getMaskWearDuration,
} from "../functions/Masks";
import { convertMStoHHMMSS } from "../functions/time";
import { useAppContext } from "../hooks/AppContext";
import { useTime } from "../hooks/time";

const Home: React.FC = () => {
  const time = useTime(500);
  const [openAlert] = useIonAlert();
  const { state, dispatch } = useAppContext();

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Mask Manager</IonTitle>
          <IonButtons collapse slot="end">
            <IonButton routerLink="/settings">
              <IonIcon icon={settings} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mask Manager</IonTitle>
            <IonButtons slot="end">
              <IonButton routerLink="/settings">
                <IonIcon icon={settings} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        {state.masks.map((i) => (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{i.id}</IonCardTitle>
              <IonCardSubtitle>
                {new Date(i.auspackungszeit).toLocaleString()} |{" "}
                {convertMStoHHMMSS(getMaskWearDuration(i, true))} |{" "}
                {i.wears.length} mal Getragen
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    {isCurrentlyWearing(i)
                      ? `Wird getragen seit ${convertMStoHHMMSS(
                          time - (getCurrentWear(i)?.startTime ?? 0)
                        )}`
                      : getLatestWear(i)
                      ? `Zuletzt getragen bis ${new Date(
                          getLatestWear(i).endTime ?? 0
                        ).toLocaleString()}`
                      : "Noch nicht getragen"}
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="grid-no-column-padding">
                    {isCurrentlyWearing(i) ? (
                      <IonButton
                        onClick={() => dispatch(ActionStopCurrentWear(i))}>
                        Stoppe Tragen
                      </IonButton>
                    ) : (
                      <IonButton
                        onClick={() => {
                          dispatch(
                            ActionAddWear(i, {
                              id: generateWearId(),
                              startTime: Date.now(),
                            })
                          );
                        }}>
                        Starte Tragen
                      </IonButton>
                    )}
                    <IonButton
                      fill="solid"
                      color="danger"
                      onClick={() =>
                        openAlert("Bist du dir Sicher?", [
                          {
                            text: "Ja",
                            handler: () => dispatch(ActionDeleteMask(i)),
                          },
                          { text: "Nein" },
                        ])
                      }>
                      Maske löschen
                    </IonButton>
                    <IonButton
                      routerLink={`/mask/${i.id}/wears`}
                      fill="solid"
                      color="medium">
                      Benutzungen editieren
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        ))}

        <IonCard
          routerLink="/mask/which-rotation"
          button
          hidden={state.masks.length === 0}>
          <IonCardHeader>
            <IonCardTitle>Rotationsverfahrensassistent</IonCardTitle>
            <IonCardSubtitle>
              Hilft dir mit dem Rotationsverfahren
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>

        <IonCard
          routerLink="/mask/which"
          button
          hidden={state.masks.length === 0}>
          <IonCardHeader>
            <IonCardTitle>
              Welche Maske soll ich als nächstes Tragen?
            </IonCardTitle>
            <IonCardSubtitle>
              Hilft dir bei der Auswahl der Maske die du als nächstes tragen
              solltest
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>

        <IonCard routerLink="/mask/add" button color="primary">
          <IonCardHeader>
            <IonCardTitle>Neue Maske hinzufügen</IonCardTitle>
          </IonCardHeader>
        </IonCard>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/mask/add">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
