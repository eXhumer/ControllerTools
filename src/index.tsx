import {
  definePlugin,
  gamepadDialogClasses,
  joinClassNames,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
import { BiBluetooth } from "react-icons/bi";
import { FaBatteryEmpty, FaBatteryFull, FaBatteryQuarter, FaBatteryHalf, FaBatteryThreeQuarters } from "react-icons/fa";
import { BsController } from "react-icons/bs";
import { Controller } from "./types";
import * as backend from "./backend";
import { IconContext } from "react-icons";

function getBatteryIcon(controller: Controller) {
  if (controller.capacity <= 0) {
    return <FaBatteryEmpty />;
  } else if (controller.capacity <= 25) {
    return <FaBatteryQuarter />;
  } else if (controller.capacity <= 50) {
    return <FaBatteryHalf />;
  } else if (controller.capacity <= 75) {
    return <FaBatteryThreeQuarters />;
  } else {
    return <FaBatteryFull />;
  }
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({ }) => {
  const [controllers, setControllers] = useState<Controller[]>([]);
  const FieldWithSeparator = joinClassNames(gamepadDialogClasses.Field, gamepadDialogClasses.WithBottomSeparatorStandard);

  useEffect(() => {
    const fetchControllers = async () => {
      setControllers(await backend.getControllers());
    };

    fetchControllers();
  }, []);

  return (
    <PanelSection title="Controllers">
      {controllers.map((controller) => (
        <PanelSectionRow key={controller.productId}>
          <div className={FieldWithSeparator}>
            <div className={gamepadDialogClasses.FieldLabelRow}>
              <div className={gamepadDialogClasses.FieldLabel}>
                <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: '4px' } }}>
                  <BiBluetooth />
                </IconContext.Provider>
                {controller.name}
              </div>
              <div className={gamepadDialogClasses.FieldChildren}>
                <IconContext.Provider value={{ style: { verticalAlign: 'middle', marginRight: '4px' }, size: '2em' }}>
                  {getBatteryIcon(controller)}
                </IconContext.Provider>
                {controller.capacity}%
              </div>
            </div>
          </div>
        </PanelSectionRow>
      ))}
    </PanelSection >
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>Controller Tools</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <BsController />,
  };
});
