/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/ui/Navigation";
import PageTitle from "@/components/ui/PageTitle";
import { Button, Card, Modal, Select, Tabs } from "react-daisyui";
import { useSocketContext } from "@/hooks/useSocket";
import { dataInitialState } from "@/utils/states";
// import Offices from "./components/offices/Offices";
// import Employees from "./components/employees/Employees";
// import Services from "./components/services/Services";

export default function Page() {
  const { sendMessage } = useSocketContext();
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState(dataInitialState.ticketInfo);
  const [ticketModal, setTicketModal] = useState(false);

  const handleGetOffices = async () => {
    setLoading(true);
    const message = { action: "offices-get-all" };
    try {
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        setOffices(res.data.Items);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleGetOffices();
  }, []);

  const handleSelectOffice = (office) => {
    setTicketData({ ...ticketData, office });
    handleGetServices(office);
  };

  const handleGetServices = async (office) => {
    setLoading(true);
    const message = { action: "services-get-by-office", office: office };
    try {
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        const json = JSON.parse(res.data);
        console.log(json);
        setServices(json);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCreateTicket = async (service) => {
    setLoading(true);
    setTicketData({ ...ticketData, service });
    const message = {
      action: "tickets-create",
      office: ticketData.office,
      services: service,
    };
    try {
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        console.log(res.data);
        setTicketData({ ...ticketData, ticket: res.data });
        setTicketModal(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <Navigation />
      <PageTitle
        title={`Oficina: ${ticketData.office}`}
        subtitle={"Seleccione un oficina y servicio"}
      />
      <div className="container mx-auto my-5">
        {loading ? (
          <>Cargando</>
        ) : ticketData.office === "" ? (
          <Select
            label="Seleccionar"
            placeholder="Seleccionar"
            onChange={(e) => {
              handleSelectOffice(e.target.value);
            }}
          >
            <Select.Option value="">Seleccione una opción</Select.Option>
            {offices.map((office) => (
              <Select.Option key={office.name} value={office.name}>
                {office.name}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3">
              {services.map((service) => (
                <Button
                  key={service.name}
                  onClick={() => {
                    handleCreateTicket(service.name);
                  }}
                >
                  {service.name}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
      <Modal open={ticketModal}>
        <Modal.Header>Ticket Creado</Modal.Header>
        <Modal.Body>
          {/* {JSON.stringify(ticketData)} */}
          <Card>
            <Card.Body>
              <PageTitle
                title={ticketData?.ticket?.ticket}
                subtitle={ticketData?.ticket?.datetime}
              />
              <div className="flex justify-around w-full text-center">
                <p>{ticketData?.ticket?.office}</p>
                <p>{ticketData?.ticket?.services}</p>
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => {
              setTicketModal(false);
              setTicketData(dataInitialState.ticketInfo);
            }}
          >
            Cerrar
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
