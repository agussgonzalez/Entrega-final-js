const navesEspaciales = [];
let planetasDisponibles = [];

document.addEventListener('DOMContentLoaded', function () {
  const botonEmpezarViaje = document.getElementById('empezar-viaje');
  const seleccionarNaveContainer = document.getElementById('seleccionar-nave');
  const navesContainer = document.getElementById('naves-container');
  const detallesNave = document.getElementById('detalles-nave');

  botonEmpezarViaje.addEventListener('click', function () {
    botonEmpezarViaje.style.display = 'none';
    seleccionarNaveContainer.style.display = 'block';
    cargarNaves();
  });

  function cargarNaves() {
    Promise.all([
      fetch('datos/naves.JSON').then(response => response.json()),
      fetch('datos/planetas.JSON').then(response => response.json())
    ])
      .then(([navesData, planetasData]) => {
        navesEspaciales.push(...navesData);
        planetasDisponibles = planetasData;
        mostrarNaves();
      })
      .catch(error => {
        mostrarMensajeError('Error al cargar las naves espaciales', error);
      });
  }

  function mostrarNaves() {
    navesContainer.innerHTML = '';
    navesEspaciales.forEach((nave, index) => {
      const naveElement = document.createElement('button');
      naveElement.id = `nave-${index + 1}`;
      naveElement.textContent = nave.nombre;
      naveElement.classList.add('nave');
      naveElement.addEventListener('click', () => seleccionarNave(nave));
      navesContainer.appendChild(naveElement);
    });
  }

  function seleccionarNave(nave) {
    detallesNave.innerHTML = `
      <h2>${nave.nombre}</h2>
      <p>Costo: ${nave.costo}</p>
      <p>Tasa de Éxito: ${nave.tasaDeExito}</p>
    `;
    mostrarOpcionesPlanetas();
  }

  function mostrarOpcionesPlanetas() {
    const opcionesPlanetasContainer = document.getElementById('opciones-planetas');
    const selectPlanetas = document.createElement('select');
    selectPlanetas.id = 'planeta-seleccionado';

    planetasDisponibles.forEach(planeta => {
      const optionPlaneta = document.createElement('option');
      optionPlaneta.textContent = planeta.nombre;
      optionPlaneta.value = planeta.nombre;

      selectPlanetas.appendChild(optionPlaneta);
    });

    const confirmarPlanetaButton = document.createElement('button');
    confirmarPlanetaButton.textContent = 'Confirmar Planeta';
    confirmarPlanetaButton.addEventListener('click', () => {
      const planetaSeleccionado = selectPlanetas.value;
      if (planetaSeleccionado) {
        const planeta = planetasDisponibles.find(planeta => planeta.nombre === planetaSeleccionado);
        const naveSeleccionada = navesEspaciales.find(nave => nave.nombre === detallesNave.querySelector('h2').textContent);
        const costoViaje = calcularCostoViaje(naveSeleccionada, planeta);

        mostrarDetallesPlaneta(planeta, costoViaje);
      } else {
        mostrarMensajeError('Por favor selecciona un planeta antes de confirmar.');
      }
    });

    opcionesPlanetasContainer.innerHTML = '';
    opcionesPlanetasContainer.appendChild(selectPlanetas);
    opcionesPlanetasContainer.appendChild(confirmarPlanetaButton);
    opcionesPlanetasContainer.style.display = 'block';
  }

  function mostrarDetallesPlaneta(planeta, costoViaje) {
    Swal.fire({
      title: `${planeta.nombre}`,
      html: `
            <p>Distancia desde la Tierra: ${planeta.distanciaDesdeTierra}</p>
            <p>Condiciones: ${planeta.condiciones}</p>
            <p>Dangers: ${planeta.dangers.join(', ')}</p>
            <p>Habitabilidad: ${planeta.habitabilidad}</p>
            <p>Descripción: ${planeta.descripcion}</p>
            <p>Costo del viaje: ${costoViaje} créditos</p>
        `,
      icon: 'info',
      confirmButtonText: 'Entendido'
    });
  }

  function mostrarMensajeError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensaje,
    });
  }

  function calcularCostoViaje(nave, planeta) {
    // Calcular la distancia del viaje (por ejemplo, en kilómetros)
    // Supongamos que la distancia se calcula de manera simple por la diferencia entre la distancia del planeta y la Tierra
    const distanciaViaje = calcularDistancia(planeta.distanciaDesdeTierra);

    // Calcular el costo del viaje basado en la distancia y el costo de la nave
    const costoTotal = distanciaViaje * nave.costo;

    return costoTotal;
  }

  function calcularDistancia(distanciaDesdeTierra) {
    // Supongamos que la distancia está en unidades astronómicas (UA) y queremos convertirla a kilómetros
    // Asumimos que 1 UA equivale a 150 millones de kilómetros
    const distanciaEnKilometros = parseFloat(distanciaDesdeTierra) * 150000000;

    return distanciaEnKilometros;
  }
});
