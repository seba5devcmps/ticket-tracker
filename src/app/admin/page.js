/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useState } from "react";
import Navigation from "@/components/ui/Navigation";
import PageTitle from "@/components/ui/PageTitle";
import {  Tabs } from "react-daisyui";
import Offices from "./components/offices/Offices";
import Employees from "./components/employees/Employees";
import Services from "./components/services/Services";

export default function Page() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <>
      <Navigation />
      <PageTitle
        title={"Administrador del sistema"}
        subtitle={"Aquí puede gestionar las oficinas, agentes y servicios"}
      />
      <div className="flex justify-center">
        <Tabs
          value={tabValue}
          onChange={setTabValue}
          size="lg"
          variant="bordered"
        >
          <Tabs.Tab value={0}>Oficinas</Tabs.Tab>
          <Tabs.Tab value={1}>Agentes</Tabs.Tab>
          <Tabs.Tab value={2}>Servicios</Tabs.Tab>
        </Tabs>
      </div>
      <div className="container mx-auto my-5">
        {tabValue === 0 && <Offices />}
        {tabValue === 1 && <Employees />}
        {tabValue === 2 && <Services />}
      </div>

      {/* <form onSubmit={handleFormSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Enviar</button>
      </form> */}
    </>
  );
}
