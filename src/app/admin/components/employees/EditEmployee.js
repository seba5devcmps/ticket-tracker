import PageTitle from "@/components/ui/PageTitle";
import Table from "@/components/ui/useTable/Table";
import { dataInitialState } from "@/utils/states";
import { useSocketContext } from "@/hooks/useSocket";
import React, { useEffect, useState } from "react";
import { Button, Select } from "react-daisyui";

const EditEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceInfo, setServiceInfo] = useState(dataInitialState.serviceInfo);

  const { sendMessage } = useSocketContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceInfo({ ...serviceInfo, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const message = { action: "offices-create", data: serviceInfo };
    sendMessage(message);

    setServiceInfo({
      name: "",
      address: "",
    });
  };

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
  
  const handleGetServices = async (office) => {
    setLoading(true);
    const message = { action: "employees-get-by-office", office: office };
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

  return (
    <form onSubmit={handleFormSubmit} className="">
      <PageTitle title={"Editar empleados por oficina"} />
      <Select
        className="w-full mb-3"
        placeholder="Selecciona una oficina"
        onChange={(e) => handleGetServices(e.target.value)}
      >
        <Select.Option>Selecciona una oficina</Select.Option>
        {offices.map((office) => (
          <Select.Option key={office.id} value={office.id}>
            {office.name}
          </Select.Option>
        ))}
      </Select>
      {loading ? (
        <p>Cargando...</p>
      ) : services.length > 0 ? (
        <>
          {/* {JSON.stringify(offices)} */}
          <Table
            columns={["Nombre", "Oficina", "Identificación", "Servicios", "Acciones"]}
            data={services.map((service) => ({
              Nombre: service.name,
              Oficina: service.office,
              Identificación: service.identification,
              Servicios: service.services.map((service) => service).join(", "),
              Acciones: (
                <>
                  <Button
                    className="mr-2"
                    size="sm"
                    onClick={() => console.log("Editar")}
                  >
                    Editar
                  </Button>
                  <Button
                    className="mr-2"
                    size="sm"
                    onClick={() => console.log("Eliminar")}
                  >
                    Eliminar
                  </Button>
                </>
              ),
            }))}
            rowsPerPage={5}
          />
        </>
      ) : (
        <>
          <PageTitle title={"Seleccione una oficina"} />
        </>
      )}
    </form>
  );
};

export default EditEmployee;
