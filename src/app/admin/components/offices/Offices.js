import PageTitle from "@/components/ui/PageTitle";
import { dataInitialState } from "@/utils/states";
import { useState } from "react";
import { Button, Input, Tabs } from "react-daisyui";
import AddOffice from "./AddOffice";
import EditOffice from "./EditOffice";

const Offices = () => {
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
          <Tabs.Tab value={0}>Añadir oficinas</Tabs.Tab>
          <Tabs.Tab value={1}>Editar oficinas</Tabs.Tab>
        </Tabs>
      </div>
      <div className="container mx-auto my-5">
        {tabValue === 0 && <AddOffice />}
        {tabValue === 1 && <EditOffice />}
      </div>
    </>
  );
};

export default Offices;
