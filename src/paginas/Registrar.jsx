import { Link } from "react-router-dom";
import { useState } from "react";
import Alerta from "../components/Alerta";
import clienteAxios from "../../config/clienteAxios";

const Registrar = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const data0 = await axios.get('http://localhost:4000/api/usuarios').then(res => res.data )
    // console.log(data0);

    if ([nombre, email, password, repetirPassword].includes("")) {
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
      return;
    }

    if (password !== repetirPassword) {
      setAlerta({
        msg: "Los password no son iguales",
        error: true,
      });
      return;
    }

    if (password.length < 6) {
      setAlerta({
        msg: "El Password es muy corto, agrega minimo 6 caracteres",
        error: true,
      });
      return;
    }

    setAlerta({});

    // Crear el usuario en la API
    try {

      const { data } = await clienteAxios.post(`/usuarios`, {nombre, email, password} )
      // const { data } = await axios.post(`http://localhost:4000/api/usuarios`, {nombre, email, password} )
      // const { data } = await clienteAxios.post(`/usuarios`, {nombre, email, password} )

      console.log(data);

      setAlerta({
          msg: data.msg,
          error: false
      })

      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')
  } catch (error) {
      setAlerta({
          msg: error.response.data.msg,
          error: true
      })
  }
  };

  const { msg } = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Crea tu cuenta y administra tus{" "}
        <span className="text-slate-700">proyectos</span>
      </h1>
      { msg && <Alerta alerta={alerta} /> }
      <form
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            htmlFor="nombre"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="password"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="password2"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Repertir Password
          </label>
          <input
            id="password2"
            type="password"
            placeholder="Repetir tu Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={repetirPassword}
            onChange={(e) => setRepetirPassword(e.target.value)}
          />
        </div>

        <input
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          type="submit"
          value="Registrar"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          {" "}
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>

        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="olvide-password"
        >
          {" "}
          Olvidé mi password
        </Link>
      </nav>
    </>
  );
};

export default Registrar;
