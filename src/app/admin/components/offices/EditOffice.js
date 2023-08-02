import PageTitle from "@/components/ui/PageTitle";
import Table from "@/components/ui/useTable/Table";
import { dataInitialState } from "@/utils/states";
import { useSocketContext } from "@/hooks/useSocket";
import React, { useEffect, useState } from "react";
import { Button, Input, Modal } from "react-daisyui";
import { toast } from "react-toastify";

const EditOffice = () => {
  const [loading, setLoading] = useState(false);
  const [offices, setOffices] = useState([]);
  const [officeInfo, setOfficeInfo] = useState(dataInitialState.officeInfo);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { sendMessage } = useSocketContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfficeInfo({ ...officeInfo, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const message = { action: "offices-edit", ...officeInfo };
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        toast.success("Oficina editada correctamente");
        setOfficeInfo(dataInitialState.officeInfo);
        setEditModal(false);
      } else {
        toast.error("Error al editar la oficina");
      }
    } catch (error) {
      toast.error("Error al editar la oficina");
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

  const handleDeleteOffice = async () => {
    const message = { action: "offices-delete", ...officeInfo };
    try {
      const res = await sendMessage(message);
      if (res.statusCode === 200) {
        toast.success("Servicio eliminado correctamente");
        handleGetOffices();
        setOfficeInfo(dataInitialState.officeInfo);
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
      <PageTitle title={"Editar oficinas"} />
      {loading ? (
        <p>Cargando...</p>
      ) : offices.length > 0 ? (
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
                    onClick={() => {
                      setEditModal(true);
                      setOfficeInfo(office);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    className="mr-2"
                    size="sm"
                    onClick={() => {
                      setDeleteModal(true);
                      setOfficeInfo(office);
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
      ) : (
        <>
          <PageTitle title={"No hay oficinas disponibles"} />
        </>
      )}
      <Modal open={editModal}>
        <Modal.Header>
          <h2>Editar oficina</h2>
        </Modal.Header>
        <Modal.Body>
          {/* {JSON.stringify(officeInfo)} */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre</span>
            </label>
            <Input
              type="text"
              name="name"
              value={officeInfo.name}
              // onChange={handleInputChange}
              placeholder="Nombre"
              disabled
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Dirección</span>
            </label>
            <Input
              type="text"
              name="address"
              value={officeInfo.address}
              onChange={handleInputChange}
              placeholder="Dirección"
              required
            />
          </div>
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => {
              setEditModal(false);
              setOfficeInfo(dataInitialState.officeInfo);
            }}
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleFormSubmit}
            color="primary"
            disabled={officeInfo.address === ""}
          >
            Guardar
          </Button>
        </Modal.Actions>
      </Modal>
      <Modal open={deleteModal}>
        <Modal.Header>
          <h2>Eliminar oficina</h2>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar la oficina?</p>
        </Modal.Body>
        <Modal.Actions>
          <Button
            onClick={() => {
              setDeleteModal(false);
              setOfficeInfo(dataInitialState.officeInfo);
            }}
          >
            Cancelar
          </Button>
          <Button onClick={handleDeleteOffice}>
            Eliminar
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default EditOffice;
