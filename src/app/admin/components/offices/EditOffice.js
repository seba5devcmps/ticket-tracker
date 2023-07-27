import PageTitle from "@/components/ui/PageTitle";
import Table from "@/components/ui/useTable/Table";
import { dataInitialState } from "@/utils/states";
import { useSocketContext } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import { Button, Input } from "react-daisyui";

const EditOffice = () => {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
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
    <form onSubmit={handleFormSubmit} className="">
      <PageTitle title={"Editar oficina"} />
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {/* {JSON.stringify(offices)} */}
          <Table
            columns={["Nombre", "Dirección", "Acciones"]}
            data={offices.map((office) => ({
              Nombre: office.name,
              Dirección: office.address,
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
      )}
    </form>
  );
};

export default EditOffice;
