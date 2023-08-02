import { useState } from "react";
import {  Tabs } from "react-daisyui";
import AddEmployee from "./AddEmployee";
import EditEmployee from "./EditEmployee";

const Employees = () => {
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
          <Tabs.Tab value={0}>Añadir agentes</Tabs.Tab>
          <Tabs.Tab value={1}>Editar agentes</Tabs.Tab>
        </Tabs>
      </div>
      <div className="container mx-auto my-5">
        {tabValue === 0 && <AddEmployee />}
        {tabValue === 1 && <EditEmployee />}
      </div>
    </>
  );
};

export default Employees;
