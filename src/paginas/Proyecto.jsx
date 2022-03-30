import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import useProyectos from "../hooks/useProyectos";

const Proyecto = () => {
  const params = useParams();
  const { obtenerProyecto, proyecto, cargando } = useProyectos();
//   console.log(proyecto);

  const { id } = params;
  useEffect(() => {
    obtenerProyecto(id);
  }, []);

  const { nombre } = proyecto;
  return cargando ? (
    "cargando..."
  ) : (
    <div className="flex justify-between">
      <h1 className="font-black text-4xl"> {nombre} </h1>
      <div className="flex items-center gap-2 text-gray-400 hover:text-black">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>

        <Link className="uppercase font-bold"
            to={`/proyectos/editar/${id}`}>Editar</Link>
      </div>
    </div>
  );
};

export default Proyecto;
