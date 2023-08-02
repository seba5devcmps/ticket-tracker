import PageTitle from "@/components/ui/PageTitle";
import Table from "@/components/ui/useTable/Table";
import { dataInitialState } from "@/utils/states";
import { useSocketContext } from "@/hooks/useSocket";
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Modal, Select } from "react-daisyui";
import { toast } from "react-toastify";

const EditEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState(
    dataInitialState.employeeInfo
  );
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { sendMessage } = useSocketContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeInfo({ ...employeeInfo, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const message = { action: "employees-edit", ...employeeInfo };
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        toast.success("Agente editado correctamente");
        setEmployeeInfo(dataInitialState.employeeInfo);
        setServices([]);
        setEditModal(false);
      } else {
        toast.error("Error al editar el agente");
      }
    } catch (error) {
      toast.error("Error al editar el agente");
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

  const handleGetEmployees = async (office) => {
    setLoading(true);
    const message = { action: "employees-get-by-office", office: office };
    try {
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        const json = JSON.parse(res.data);
        console.log(json);
        setEmployees(json);
        handleGetServices(office);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDeleteEmployee = async () => {
    const message = { action: "employees-delete", ...employeeInfo };
    try {
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        toast.success("Agente eliminado correctamente");
        handleGetEmployees(employeeInfo.office);
        setEmployeeInfo(dataInitialState.employeeInfo);
        setDeleteModal(false);
      } else {
        toast.error("Error al eliminar el agente");
      }
    } catch (error) {
      toast.error("Error al eliminar el agente. Error: " + error);
    }
  };

  return (
    <>
      <PageTitle title={"Editar agentes por oficina"} />
      <Select
        className="w-full mb-3"
        placeholder="Selecciona una oficina"
        onChange={(e) => handleGetEmployees(e.target.value)}
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
      ) : employees.length > 0 ? (
        <>
          {/* {JSON.stringify(employees)} */}
          <Table
            columns={[
              "Nombre",
              "Oficina",
              "Identificación",
              "Servicios",
              "Acciones",
            ]}
            data={employees.map((employee) => ({
              Nombre: employee.name,
              Oficina: employee.office,
              Identificación: employee.identification,
              Servicios: employee.services.map((service) => service).join(", "),
              Acciones: (
                <>
                  <Button
                    className="mr-2"
                    size="sm"
                    onClick={() => {
                      setEditModal(true);
                      setEmployeeInfo(employee);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    className="mr-2"
                    size="sm"
                    onClick={() => {
                      setDeleteModal(true);
                      setEmployeeInfo(employee);
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
      ) : employees.length === 0 ? (
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
          {JSON.stringify(employeeInfo)}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Identificación</span>
            </label>
            <Input
              type="text"
              name="identification"
              value={employeeInfo.identification}
              // onChange={handleInputChange}
              placeholder="Identificación"
              disabled
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre</span>
            </label>
            <Input
              type="text"
              name="name"
              value={employeeInfo.name}
              onChange={handleInputChange}
              placeholder="Nombre"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Oficina</span>
            </label>
            <Select
              name="office"
              value={employeeInfo.office}
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
          <div className="form-control">
            <label className="label">
              <span className="label-text">Servicios</span>
            </label>
            {services.length > 0 ? (
              services.map((service) => (
                <Form.Label title={service.name} key={service.name}>
                  <Checkbox
                    name={service.name}
                    value={service.name}
                    label={service.name}
                    checked={employeeInfo.services.includes(service.name)}
                    onChange={() => {
                      employeeInfo.services.includes(service.name)
                        ? setEmployeeInfo({
                            ...employeeInfo,
                            services: employeeInfo.services.filter(
                              (s) => s !== service.name
                            ),
                          })
                        : setEmployeeInfo({
                            ...employeeInfo,
                            services: [...employeeInfo.services, service.name],
                          });
                    }}
                  />
                </Form.Label>
              ))
            ) : employeeInfo.office !== "" ? (
              <p>La oficina no tiene servicios</p>
            ) : (
              <p>Seleccione una oficina</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => {
              setEditModal(false);
              setEmployeeInfo(dataInitialState.employeeInfo);
            }}
            color="primary"
            outline
          >
            Cancelar
          </Button>
          <Button
            onClick={handleFormSubmit}
            color="primary"
            disabled={
              employeeInfo.name === "" ||
              employeeInfo.identification === "" ||
              employeeInfo.office === "" ||
              employeeInfo.services.length === 0
            }
          >
            Guardar
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal open={deleteModal}>
        <Modal.Header>
          <h2>Eliminar agente</h2>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar el agente?</p>
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => {
              setDeleteModal(false);
              setEmployeeInfo(dataInitialState.employeeInfo);
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleDeleteEmployee}>
            Eliminar
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default EditEmployee;
