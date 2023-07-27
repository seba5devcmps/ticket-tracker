/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/ui/Navigation";
import PageTitle from "@/components/ui/PageTitle";
import { Button, Select, Table } from "react-daisyui";
import { useSocketContext } from "@/hooks/useSocket";
import { dataInitialState } from "@/utils/states";

export default function Page() {
  const { sendMessage } = useSocketContext();
  const [offices, setOffices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeOffice, setActiveOffice] = useState("");

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
    setActiveOffice(office);
    await getActiveTickets(office);
  };

  const getActiveTickets = async (office) => {
    setLoading(true);
    const message = { action: "tickets-get-by-office", office: office };
    try {
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        const json = JSON.parse(res.data);
        console.log(json);
        setTickets(json);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <Navigation />
      {/* tickets{JSON.stringify(tickets)} */}
      <div className="container mx-auto my-5">
        {loading ? (
          <>Cargando</>
        ) : activeOffice === "" ? (
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
        ) : (
          <>
            <PageTitle title={`Oficina: ${activeOffice}`} />
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setActiveOffice("");
                }}
              >
                Cambiar oficina
              </Button>
            </div>
            <div className="overflox-x-hidden">
              <Table>
                <Table.Head>
                  <span>Ticket</span>
                  <span>Estado</span>
                  <span>Servicio</span>
                </Table.Head>
                <Table.Body>
                  {tickets.map((ticket) => (
                    <Table.Row key={ticket.ticket}>
                      <span>{ticket.ticket}</span>
                      <span>{ticket.state}</span>
                      <span>{ticket.services}</span>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
