/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useSocketContext } from "@/hooks/useSocket";
import Link from "next/link";
import { Navbar, Dropdown, Button } from "react-daisyui";
import { FaBars, FaBroadcastTower } from "react-icons/fa";

const Navigation = () => {
  const { socket, connect, disconnect } = useSocketContext();

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <Navbar className="bg-primary">
      <Navbar.Start>
        <Dropdown>
          <Button color="ghost" shape="circle" tabIndex={0}>
            <FaBars />
          </Button>
          <Dropdown.Menu tabIndex={0} className="menu-compact w-52">
            <Link className="p-2 text-md" as={Dropdown.Item} href="/">
              Inicio
            </Link>
            <Link className="p-2 text-md" as={Dropdown.Item} href="/admin">
              Administrador
            </Link>
            <Link className="p-2 text-md" as={Dropdown.Item} href="/create-ticket">
              Crear ticket
            </Link>
            <Link className="p-2 text-md" as={Dropdown.Item} href="/agent">
              Agente
            </Link>
            <Link className="p-2 text-md" as={Dropdown.Item} href="/tracker">
              Tracker
            </Link>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Start>
      <Navbar.Center>
        <Button color="ghost" className="normal-case text-xl">
          Ticket Tracker
        </Button>
      </Navbar.Center>
      <Navbar.End className="navbar-end">
        {socket?.readyState === WebSocket.OPEN ? (
          <Button onClick={()=>handleDisconnect()}>
            <FaBroadcastTower className="text-xl text-green-500 mr-2" />{" "}
            Conectado
          </Button>
        ) : (
          <Button onClick={()=>handleConnect()}>
            <FaBroadcastTower className="text-xl text-red-500 mr-2" />{" "}
            Desconectado
          </Button>
        )}
      </Navbar.End>
    </Navbar>
  );
};

export default Navigation;
