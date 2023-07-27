/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/ui/Navigation";
import PageTitle from "@/components/ui/PageTitle";
import { Button, Card, Modal, Select } from "react-daisyui";
import { useSocketContext } from "@/hooks/useSocket";
import { dataInitialState } from "@/utils/states";

export default function Page() {
  const { sendMessage } = useSocketContext();
  const [offices, setOffices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState(
    dataInitialState.activeEmployeeInfo
  );
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

  const handleSelectOffice = async (office) => {
    setActiveEmployee({ ...activeEmployee, office });
    await handleGetEmployees(office);
  };

  const handleGetEmployees = async (office) => {
    setLoading(true);
    const message = { action: "employees-get-by-office", office: office };
    try {
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        const json = JSON.parse(res.data);
        console.log(json);
        setEmployees(json);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSelectEmployee = async (employee) => {
    setLoading(true);
    await getActiveTickets(activeEmployee.office, employee.services);
    setActiveEmployee({ ...activeEmployee, ...employee });
    setLoading(false);
  };

  const getActiveTickets = async (office, services) => {
    setLoading(true);
    const message = {
      action: "tickets-get-by-office-services",
      office: office,
      services: services,
    };
    try {
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        setTickets(res.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleAttendTicket = async () => {
    setLoading(true);
    const message = {
      action: "tickets-attend-next",
      office: activeEmployee.office,
      employee: activeEmployee.name,
      services: activeEmployee.services,
    };
    try {
      const res = await sendMessage(message);
      console.log(res);
      if (res.statusCode === 200) {
        setActiveEmployee({
          ...activeEmployee,
          ticket: res.data,
          state: "on call",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    getActiveTickets(activeEmployee.office, activeEmployee.services);
  };

  const handleStartTicket = async () => {
    setLoading(true);
    const message = {
      action: "tickets-attend-start",
      ticket: activeEmployee.ticket.ticket,
    };
    try {
      const res = await sendMessage(message);
      console.log(res);
      if (res.statusCode === 200) {
        setActiveEmployee({
          ...activeEmployee,
          state: "attending",
        });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSkipTicket = async () => {
    setLoading(true);
    const message = {
      action: "tickets-attend-skip",
      ticket: activeEmployee.ticket.ticket,
    };
    try {
      const res = await sendMessage(message);
      console.log(res);
      if (res.statusCode === 200) {
        setActiveEmployee({
          ...activeEmployee,
          state: "waiting",
          ticket: {},
        });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleEndTicket = async () => {
    setLoading(true);
    const message = {
      action: "tickets-attend-end",
      ticket: activeEmployee.ticket.ticket,
    };
    try {
      const res = await sendMessage(message);
      console.log(res);
      if (res.statusCode === 200) {
        setActiveEmployee({ ...activeEmployee, ticket: {}, state: "waiting" });
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    getActiveTickets(activeEmployee.office, activeEmployee.services);
  };

  return (
    <>
      <Navigation />
      {/* {JSON.stringify(activeEmployee)} */}
      {/* <br /> */}
      {/* tickets{JSON.stringify(tickets)} */}
      {/* employees{JSON.stringify(employees)} */}
      <div className="container mx-auto my-5">
        {loading ? (
          <>Cargando</>
        ) : activeEmployee.office === "" ? (
          <>
            <PageTitle title={"Seleccione un oficina y servicio"} />
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
          </>
        ) : activeEmployee.name === "" ? (
          <>
            <PageTitle title={"Seleccione un oficina y servicio"} />
            <Select
              label="Seleccionar"
              placeholder="Seleccionar"
              onChange={(e) => {
                handleSelectEmployee(
                  employees.find((employee) => employee.name === e.target.value)
                );
              }}
            >
              <Select.Option value="">Seleccione una opción</Select.Option>
              {employees.map((employee) => (
                <Select.Option
                  key={employee.identification}
                  value={employee.name}
                >
                  {employee.identification + " - " + employee.name}
                </Select.Option>
              ))}
            </Select>
          </>
        ) : activeEmployee?.state === "on call" ? (
          <>
            <PageTitle
              title={`Empleado: ${activeEmployee.name}`}
              subtitle={`Oficina: ${activeEmployee.office}`}
            />
            <div className="flex justify-center items-center flex-col">
              <PageTitle
                title={`Llamando ${activeEmployee?.ticket?.ticket}`}
                subtitle={`${activeEmployee?.ticket?.called ? "Segundo llamado" : "Primer llamado"} `}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <Button onClick={handleStartTicket}>Iniciar Atención</Button>
              <Button onClick={handleSkipTicket}>Saltar ticket</Button>
              {/* {JSON.stringify(activeEmployee)} */}
            </div>
          </>
        ) : activeEmployee?.state === "attending" ? (
          <>
            <PageTitle
              title={`Empleado: ${activeEmployee.name}`}
              subtitle={`Oficina: ${activeEmployee.office}`}
            />
            <div className="flex justify-center items-center flex-col">
              <PageTitle
                title={"En atención"}
                subtitle={activeEmployee?.ticket?.ticket}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <Button onClick={handleEndTicket}>Terminar atención</Button>
              {/* {JSON.stringify(activeEmployee)} */}
            </div>
          </>
        ) : activeEmployee?.state === "waiting" ? (
          <>
            <PageTitle
              title={`Empleado: ${activeEmployee.name}`}
              subtitle={`Oficina: ${activeEmployee.office}`}
            />
            <div className="grid grid-cols-2 gap-2 text-center">
              <Button
                onClick={() => {
                  setActiveEmployee({ ...activeEmployee, name: "" });
                }}
              >
                Cambiar empleado
              </Button>
              <Button
                onClick={() => {
                  setActiveEmployee({ ...activeEmployee, office: "" });
                }}
              >
                Cambiar oficina
              </Button>
              <p>
                Turnos en cola:{" "}
                {tickets.filter((ticket) => ticket.state === "waiting")?.length}
              </p>
              <p>Tiempo inactivo: 00:00</p>
            </div>
            <div className="flex justify-center items-center flex-col">
              <PageTitle title={"Sin atención"} />
              <Button onClick={handleAttendTicket}>Llamar</Button>
            </div>
          </>
        ) : (
          <>
            <PageTitle
              title={`Empleado: ${activeEmployee.name}`}
              subtitle={`Oficina: ${activeEmployee.office}`}
            />
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
                title={activeEmployee?.ticket?.ticket}
                subtitle={activeEmployee?.ticket?.datetime}
              />
              <div className="flex justify-around w-full text-center">
                <p>{activeEmployee?.ticket?.office}</p>
                <p>{activeEmployee?.ticket?.services}</p>
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => {
              setTicketModal(false);
              setActiveEmployee(dataInitialState.ticketInfo);
            }}
          >
            Cerrar
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}
