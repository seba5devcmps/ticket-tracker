import PageTitle from "@/components/ui/PageTitle";
import { dataInitialState } from "@/utils/states";
import { useSocketContext } from "@/hooks/useSocket";
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Select } from "react-daisyui";

const AddEmployee = () => {
  const [employeeInfo, setEmployeeInfo] = useState(
    dataInitialState.employeeInfo
  );
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
  const [services, setServices] = useState([]);

  const { sendMessage } = useSocketContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeInfo({ ...employeeInfo, [name]: value });
    if (name === "office") {
      handleGetServices(value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const message = {
      action: "employees-create",
      identification: employeeInfo.identification,
      name: employeeInfo.name,
      office: employeeInfo.office,
      services: employeeInfo.services,
    };
    sendMessage(message);
    setEmployeeInfo(dataInitialState.employeeInfo);
    setServices([]);
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
        setServices(json);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSetServices = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      setEmployeeInfo({
        ...employeeInfo,
        services: [...employeeInfo.services, name],
      });
    } else {
      setEmployeeInfo({
        ...employeeInfo,
        services: employeeInfo.services.filter((service) => service !== name),
      });
    }
  };

  return (
    <Form onSubmit={handleFormSubmit} className="col-span-2">
    {/* {JSON.stringify(employeeInfo)} */}
      <PageTitle title={"Crear oficina"} />
      <div className="grid grid-cols-2 gap-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Nombre del empleado</span>
          </label>
          <Input
            type="text"
            name="name"
            value={employeeInfo.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Identificación</span>
          </label>
          <Input
            type="number"
            name="identification"
            value={employeeInfo.identification}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Oficinas</span>
          </label>
          <Select
            name="office"
            value={employeeInfo.office}
            onChange={handleInputChange}
          >
            <Select.Option value={""} disabled>
              Seleccione una oficina
            </Select.Option>
            {offices.map((office) => (
              <Select.Option key={office.name} value={office.name}>
                {office.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Servicios</span>
          </label>
          {/* {JSON.stringify(services)} */}
          {services.length > 0 ?
            services.map((service) => (
              <Form.Label title={service.name} key={service.name}>
                <Checkbox
                  name={service.name}
                  value={service.name}
                  label={service.name}
                  onClick={handleSetServices}
                />
              </Form.Label>
            )) : <p>Seleccione una oficina</p>}
        </div>
        <Button color="primary" className="col-span-2" type="submit">
          Enviar
        </Button>
      </div>
    </Form>
  );
};

export default AddEmployee;
