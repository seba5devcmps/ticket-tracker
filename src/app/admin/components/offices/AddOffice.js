import React, { useState } from "react";
import { Button, Input } from "react-daisyui";
import PageTitle from "@/components/ui/PageTitle";
import { dataInitialState } from "@/utils/states";
import { useSocketContext } from "@/hooks/useSocket";

const AddOffice = () => {
  const [officeInfo, setOfficeInfo] = useState(dataInitialState.officeInfo);

  const { sendMessage } = useSocketContext();

  const handleInputChange = (e) => {
    if (e.target.name === "name")
      setOfficeInfo({ ...officeInfo, name: e.target.value });
    if (e.target.name === "address")
      setOfficeInfo({ ...officeInfo, address: e.target.value });
    // setInputValue(event.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const message = { action: "offices-create", data: officeInfo };
    sendMessage(message);

    setOfficeInfo({
      name: "",
      address: "",
    });
  };
  return (
    <form onSubmit={handleFormSubmit} className="col-span-2">
      <PageTitle title={"Crear oficina"} />
      <div className="grid grid-cols-2 gap-2">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Nombre de la oficina</span>
          </label>
          <Input
            type="text"
            name="name"
            value={officeInfo.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Dirección</span>
          </label>
          <Input
            type="text"
            name="address"
            value={officeInfo.address}
            onChange={handleInputChange}
          />
        </div>
        <Button color="primary" className="col-span-2" type="submit">
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default AddOffice;
