import PageTitle from "@/components/ui/PageTitle";
import { dataInitialState } from "@/utils/states";
import { useSocketContext } from "@/hooks/useSocket";
import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, Toggle } from "react-daisyui";

const AddService = () => {
  const [serviceInfo, setServiceInfo] = useState(dataInitialState.serviceInfo);
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);

  const { sendMessage } = useSocketContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setServiceInfo({ ...serviceInfo, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const message = {
      action: "services-create",
      name: serviceInfo.name,
      office: serviceInfo.office,
      isFather: serviceInfo.isFather,
      father: serviceInfo.father,
      initial: serviceInfo.initial,
    };
    sendMessage(message);

    setServiceInfo(dataInitialState.serviceInfo);
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

  return (
    <Form onSubmit={handleFormSubmit} className="col-span-2">
      <PageTitle title={"Crear servicios"} />
      <div className="grid grid-cols-2 gap-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Oficina</span>
          </label>
          <Select
            name="office"
            value={serviceInfo.office}
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
            <span className="label-text">Nombre del Servicio</span>
          </label>
          <Input
            type="text"
            name="name"
            value={serviceInfo.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-control w-full">
          <Form.Label title="¿Es Padre?">
            <Toggle color="primary" className="m-2" disabled />
          </Form.Label>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Padre</span>
          </label>
          <Select disabled>
            <Select.Option value={""} disabled>
              Seleccione un servicio
            </Select.Option>
          </Select>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Inicial (3 carácteres)</span>
          </label>
          <Input
            type="text"
            name="initial"
            value={serviceInfo.initial}
            onChange={handleInputChange}
          />
        </div>
        <Button color="primary" className="col-span-2" type="submit">
          Enviar
        </Button>
      </div>
    </Form>
  );
};

export default AddService;
