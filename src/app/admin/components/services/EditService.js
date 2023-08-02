import PageTitle from "@/components/ui/PageTitle";
import Table from "@/components/ui/useTable/Table";
import { dataInitialState } from "@/utils/states";
import { useSocketContext } from "@/hooks/useSocket";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Toggle } from "react-daisyui";
import { toast } from "react-toastify";

const EditService = () => {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceInfo, setServiceInfo] = useState(dataInitialState.serviceInfo);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { sendMessage } = useSocketContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "initial") {
      setServiceInfo({ ...serviceInfo, [name]: value.toUpperCase() });
      return;
    }
    setServiceInfo({ ...serviceInfo, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const message = { action: "services-edit", ...serviceInfo };
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        toast.success("Servicio editado correctamente");
        handleGetServices(serviceInfo.office);
        setServiceInfo(dataInitialState.serviceInfo);
        setEditModal(false);
      } else {
        toast.error("Error al editar el servicio");
      }
    } catch (error) {
      toast.error("Error al editar el servicio. Error: " + error);
    }
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

  const handleDeleteService = async () => {
    const message = { action: "services-delete", ...serviceInfo };
    try {
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        toast.success("Servicio eliminado correctamente");
        handleGetServices(serviceInfo.office);
        setServiceInfo(dataInitialState.serviceInfo);
        setDeleteModal(false);
      } else {
        toast.error("Error al eliminar el servicio");
      }
    } catch (error) {
      toast.error("Error al eliminar el servicio. Error: " + error);
    }
  };

  return (
    <>
      <PageTitle title={"Editar agentes por oficina"} />
      <Select
        className="w-full mb-3"
        placeholder="Selecciona una oficina"
        onChange={(e) => handleGetServices(e.target.value)}
      >
        <Select.Option>Selecciona una oficina</Select.Option>
        {offices.map((office) => (
          <Select.Option key={office.name} value={office.name}>
            {office.name}
          </Select.Option>
        ))}
      </Select>
      {loading ? (
        <p>Cargando...</p>
      ) : services.length > 0 ? (
        <>
          {/* {JSON.stringify(services)} */}
          <Table
            columns={[
              "Nombre",
              "Inicial",
              "Padre",
              "Padre de",
              "Oficina",
              "Acciones",
            ]}
            data={services.map((service) => ({
              Nombre: service.name,
              Inicial: service.initial,
              Padre: service.isFather ? "Si" : "No",
              "Padre de": !service.isFather ? service.father : "N/A",
              Oficina: service.office,
              Acciones: (
                <>
                  <Button
                    className="mr-2"
                    size="sm"
                    onClick={() => {
                      setEditModal(true);
                      setServiceInfo(service);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    className="mr-2"
                    size="sm"
                    onClick={() => {
                      setDeleteModal(true);
                      setServiceInfo(service);
                    }}
                  >
                    Eliminar
                  </Button>
                </>
              ),
            }))}
            rowsPerPage={5}
          />
        </>
      ) : services.length === 0 ? (
        <>
          <PageTitle title={"La oficina no tiene agentes"} />
        </>
      ) : (
        <>
          <PageTitle title={"Seleccione una oficina"} />
        </>
      )}
      <Modal open={editModal}>
        <Modal.Header>
          <h2>Editar agente</h2>
        </Modal.Header>
        <Modal.Body>
          {JSON.stringify(serviceInfo)}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre</span>
            </label>
            <Input
              type="text"
              name="name"
              value={serviceInfo.name}
              // onChange={handleInputChange}
              placeholder="Nombre"
              disabled
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Inicial</span>
            </label>
            <Input
              type="text"
              name="initial"
              value={serviceInfo.initial}
              onChange={handleInputChange}
              placeholder="Inicial"
              required
              // solo puede tener 3 caracteres
              maxLength={3}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">¿Es Padre?</span>
            </label>
            <Form.Label title={serviceInfo.isFather ? "Sí" : "No"}>
              <Toggle
                value={serviceInfo.isFather}
                onChange={() =>
                  setServiceInfo({
                    ...serviceInfo,
                    isFather: !serviceInfo.isFather,
                    father: "",
                  })
                }
              />
            </Form.Label>
          </div>
          {!serviceInfo.isFather && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Padre</span>
              </label>
              <Select
                name="father"
                value={serviceInfo.father}
                onChange={(e) => {
                  handleInputChange(e);
                }}
              >
                <Select.Option>Selecciona una oficina</Select.Option>
                {/* Filtra los servicios que son padre y los muestra */}
                {services
                  .filter((service) => service.isFather)
                  .map((service) => (
                    <Select.Option key={service.name} value={service.name}>
                      {service.name}
                    </Select.Option>
                  ))}
              </Select>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Oficina</span>
            </label>
            <Select
              name="office"
              value={serviceInfo.office}
              onChange={(e) => {
                handleInputChange(e);
                handleGetServices(e.target.value);
              }}
            >
              <Select.Option>Selecciona una oficina</Select.Option>
              {offices.map((office) => (
                <Select.Option key={office.name} value={office.name}>
                  {office.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => {
              setEditModal(false);
              setServiceInfo(dataInitialState.serviceInfo);
            }}
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleFormSubmit}
            color="primary"
            disabled={
              serviceInfo.name === "" ||
              serviceInfo.initial === "" ||
              serviceInfo.office === "" ||
              (!serviceInfo.isFather && serviceInfo.father === "")
            }
          >
            Guardar
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal open={deleteModal}>
        <Modal.Header>
          <h2>Eliminar servicio</h2>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar el servicio?</p>
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => {
              setDeleteModal(false);
              setServiceInfo(dataInitialState.serviceInfo);
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleDeleteService}>
            Eliminar
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default EditService;
