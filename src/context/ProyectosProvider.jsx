import { useState, useEffect, createContext } from "react";
import clienteAxios from "../../config/clienteAxios";
import { useNavigate } from "react-router-dom";

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  const [tarea, setTarea] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await clienteAxios("/proyectos", config);
        setProyectos(data);
      } catch (error) {
        console.log(error);
      }
    };
    obtenerProyectos();
  }, []);

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);

    setTimeout(() => {
      setAlerta({});
    }, 5000);
  };

  const submitProyecto = async (proyecto) => {
    const { id } = proyecto;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = !!id
        ? await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
        : await clienteAxios.post("/proyectos", proyecto, config);
      let messageAlerta = "";
      // console.log(id);
      if (!!id) {
        // Sincronizar el state
        const proyectosActualizados = proyectos.map((proyectoState) =>
          proyectoState._id === data._id ? data : proyectoState
        );
        setProyectos(proyectosActualizados);
        messageAlerta = "Proyecto Actualizado correctamente";
      } else {
        setProyectos([...proyectos, data]);
        messageAlerta = "Proyecto Creado correctamente";
      }
      setAlerta({
        msg: messageAlerta,
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerProyecto = async (id) => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios(`/proyectos/${id}`, config);
      setProyecto(data);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarProyecto = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);

      // Sincronizar el state
      const proyectosActualizados = proyectos.filter(
        (proyectoState) => proyectoState._id !== id
      );
      setProyectos(proyectosActualizados);

      setAlerta({
        msg: data.msg,
        error: false,
      });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({});
  };

  const handleModalEditarTarea = (tarea) => {
    setTarea(tarea);
    setModalFormularioTarea(true);
  };

  const submitTarea = async (tarea) => {
    console.log(tarea);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // const { data } = await clienteAxios.post(`/tareas`, tarea, config);

      const { data } = !!tarea.id
        ? await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
        : await await clienteAxios.post(`/tareas`, tarea, config);

      // console.log(data);
      const proyectoActualizado = { ...proyecto };

      if (tarea.id) {
        // Agregar la tarea al state
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(
          (tareaState) => (tareaState._id === data._id ? data : tareaState)
        );

        // setProyecto(proyectoActualizado);
      } else {
        // Agregar la tarea al state
        // const proyectoActualizado = { ...proyecto };
        proyectoActualizado.tareas = [...proyecto.tareas, data];

        // setProyecto(proyectoActualizado);
      }
      setProyecto(proyectoActualizado);
      setAlerta({});
      setModalFormularioTarea(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalEliminarTarea = (tarea) => {
    setTarea(tarea);
    setModalEliminarTarea(!modalEliminarTarea);
  };

  const eliminarTarea = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.delete(
        `/tareas/${tarea._id}`,
        config
      );
      setAlerta({
        msg: data.msg,
        error: false,
      });

      let proyectoActualizado = { ...proyecto };
      proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)

      setProyecto(proyectoActualizado);
      setModalEliminarTarea(false);

      setTarea({});
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        modalEliminarTarea,
        handleModalEliminarTarea,
        eliminarTarea,
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };

export default ProyectosContext;
