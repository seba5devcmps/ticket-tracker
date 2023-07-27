import { useState } from "react";
import { Tabs } from "react-daisyui";
import AddService from "./AddService";
import EditService from "./EditService";

const Services = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <>
      <div className="flex justify-center">
        <Tabs
          value={tabValue}
          onChange={setTabValue}
          size="lg"
          variant="bordered"
        >
          <Tabs.Tab value={0}>Añadir servicios</Tabs.Tab>
          <Tabs.Tab value={1}>Editar servicios</Tabs.Tab>
        </Tabs>
      </div>
      <div className="container mx-auto my-5">
        {tabValue === 0 && <AddService />}
        {tabValue === 1 && <EditService />}
      </div>
    </>
  );
};

export default Services;
