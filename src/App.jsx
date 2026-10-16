import { useEffect, useState } from 'react';

const STORAGE_KEY = 'clientes';

const clientesIniciales = [
  { id: 1, nombre: 'Ana López', correo: 'ana@example.com', telefono: '555-123-4567' },
  { id: 2, nombre: 'Carlos Pérez', correo: 'carlos@example.com', telefono: '555-987-6543' },
  { id: 3, nombre: 'María García', correo: 'maria@example.com', telefono: '555-222-3344' },
];

function obtenerClientes() {
  try {
    const clientesGuardados = localStorage.getItem(STORAGE_KEY);
    return clientesGuardados ? JSON.parse(clientesGuardados) : clientesIniciales;
  } catch (error) {
    console.error('No se pudieron cargar los clientes.', error);
    return clientesIniciales;
  }
}

function App() {
  const [clientes, setClientes] = useState(obtenerClientes);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [clienteEditando, setClienteEditando] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clientes));
    } catch (error) {
      console.error('No se pudieron guardar los clientes.', error);
    }
  }, [clientes]);

  function guardarCliente(event) {
    event.preventDefault();

    if (clienteEditando) {
      setClientes(clientes.map((cliente) => (
        cliente.id === clienteEditando
          ? { ...cliente, nombre, correo, telefono }
          : cliente
      )));
      setClienteEditando(null);
    } else {
      setClientes([
        ...clientes,
        { id: Date.now(), nombre, correo, telefono },
      ]);
    }

    limpiarFormulario();
  }

  function editarCliente(cliente) {
    setClienteEditando(cliente.id);
    setNombre(cliente.nombre);
    setCorreo(cliente.correo);
    setTelefono(cliente.telefono);
  }

  function eliminarCliente(id) {
    setClientes(clientes.filter((cliente) => cliente.id !== id));
    if (clienteEditando === id) {
      limpiarFormulario();
    }
  }

  function limpiarFormulario() {
    setNombre('');
    setCorreo('');
    setTelefono('');
    setClienteEditando(null);
  }

  const clientesFiltrados = clientes.filter((cliente) => (
    `${cliente.nombre} ${cliente.correo} ${cliente.telefono}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  ));

  return (
    <main className="contenedor">
      <h1>Registro de clientes</h1>
      <p>Agrega clientes y consulta sus datos.</p>

      <section className="seccion">
        <h2>{clienteEditando ? 'Editar cliente' : 'Agregar cliente'}</h2>
        <form onSubmit={guardarCliente}>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            required
          />

          <label htmlFor="correo">Correo electrónico</label>
          <input
            id="correo"
            type="email"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            required
          />

          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            type="tel"
            value={telefono}
            onChange={(event) => setTelefono(event.target.value)}
            required
          />

          <div className="acciones-formulario">
            <button type="submit">
              {clienteEditando ? 'Guardar cambios' : 'Agregar cliente'}
            </button>
            {clienteEditando && (
              <button type="button" onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="seccion">
        <h2>Lista de clientes</h2>
        <label htmlFor="busqueda">Buscar cliente</label>
        <input
          id="busqueda"
          type="search"
          value={busqueda}
          onChange={(event) => setBusqueda(event.target.value)}
          placeholder="Escribe un nombre, correo o teléfono"
        />

        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo electrónico</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.correo}</td>
                  <td>{cliente.telefono}</td>
                  <td className="acciones-tabla">
                    <button type="button" onClick={() => editarCliente(cliente)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => eliminarCliente(cliente.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="4">No hay clientes para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p>Total de clientes: {clientes.length}</p>
      </section>
    </main>
  );
}

export default App;
