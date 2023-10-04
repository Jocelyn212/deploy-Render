recibirVivienda();

function recibirVivienda() {
  fetch("/api/viviendas")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let viviendas = "";
      for (let i = 0; i < data.length; i++) {
        viviendas += `
            <div class="card" >
                <h3>${data[i].tipo}</h3>
                <h4>${data[i].estado}</h4>
                <p>Descripcion: ${data[i].descripcion}</p>
                <p>Metros construidos: ${data[i].metros}</p>
                <p>Habitaciones: ${data[i].habitaciones}</p>
                <p>Baños: ${data[i].baños}</p>
                <p>Terreno: ${data[i].patio}</p>
                <p>Ciudad: ${data[i].ciudad}</p>
                <div class="card-img">
                   <img src="${data[i].img1}" alt="vivienda" width="180" height="240">
                   <img src="${data[i].img2}" alt="vivienda" width="180" height="240">
                   <img src="${data[i].img3}" alt="vivienda" width="180" height="240">
                </div>
                <div>Precio: ${data[i].precio}</div>
                 <button onclick="eliminarVivienda('${data[i]._id}')">Eliminar</button>
                 <button onclick="editarVivienda('${data[i]._id}')">Editar</button>
                  </div>
        `;
      }
      // USO DEL DOM.  IMPRIMO DESDE EL JS AL HTML
      document.getElementById("div1").innerHTML = viviendas;
    });
}

// Sube las imágenes a Cloudinary en el folder "Inmobiliaria" y luego inserta la vivienda en la base de datos.
function insertarVivienda() {
  let tipo = document.getElementById("tipo").value;
  let estado = document.getElementById("estado").value;
  let descripcion = document.getElementById("descripcion").value;
  let metros = document.getElementById("metros").value;
  let habitaciones = document.getElementById("habitaciones").value;
  let baños = document.getElementById("baños").value;
  let patio = document.getElementById("patio").value;
  let ciudad = document.getElementById("ciudad").value;
  let imagen1 = document.getElementById("imagen1").files[0];
  let imagen2 = document.getElementById("imagen2").files[0];
  let imagen3 = document.getElementById("imagen3").files[0];

  let formData1 = new FormData();
  formData1.append("file", imagen1);
  formData1.append("upload_preset", "inmobiliaria_lc"); // Reemplaza con tu nombre de "upload preset"
  formData1.append("folder", "Inmobiliaria"); // Nombre del folder

  let formData2 = new FormData();
  formData2.append("file", imagen2);
  formData2.append("upload_preset", "inmobiliaria_lc"); // Reemplaza con tu nombre de "upload preset"
  formData2.append("folder", "Inmobiliaria"); // Nombre del folder

  let formData3 = new FormData();
  formData3.append("file", imagen3);
  formData3.append("upload_preset", "inmobiliaria_lc"); // Reemplaza con tu nombre de "upload preset"
  formData3.append("folder", "Inmobiliaria"); // Nombre del folder

  Promise.all([
    fetch("https://api.cloudinary.com/v1_1/pruebaweb/image/upload", {
      method: "POST",
      body: formData1,
    }),
    fetch("https://api.cloudinary.com/v1_1/pruebaweb/image/upload", {
      method: "POST",
      body: formData2,
    }),
    fetch("https://api.cloudinary.com/v1_1/pruebaweb/image/upload", {
      method: "POST",
      body: formData3,
    }),
  ])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((results) => {
      // imageUrls contiene las URLs de las imágenes en Cloudinary
      let img1 = results[0].secure_url;
      let img2 = results[1].secure_url;
      let img3 = results[2].secure_url;
      let precio = document.getElementById("precio").value;

      let viviendaInsertar = {
        tipo,
        estado,
        descripcion,
        metros,
        habitaciones,
        baños,
        patio,
        ciudad,
        img1,
        img2,
        img3,
        precio,
      };

      fetch("/api/nuevaVivienda/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(viviendaInsertar),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          console.log(data);
          agregarVivienda(data); // Agregar la vivienda insertada directamente a la lista existente
        });

      // Muestra un mensaje
      let mensaje = document.getElementById("mensaje");
      mensaje.textContent = "Agregado exitosamente";
      mensaje.style.display = "block";

      // Oculta el mensaje después de 3 segundos
      setTimeout(function () {
        mensaje.style.display = "none";

        // Recargar la página después de 2 segundos
        setTimeout(function () {
          location.reload();
        }, 2000);
      }, 3000);
    })
    .catch((error) => {
      console.error(
        "Error al cargar imágenes o insertar en la base de datos:",
        error
      );
    });
}

//BUSCAR EN LA BASE DE DATOS
function buscar() {
  let tipo = document.getElementById("tipoBusqueda").value;
  let estado = document.getElementById("estadoBusqueda").value;
  let ciudad = document.getElementById("ciudadBusqueda").value;
  let url = "/api/viviendas/buscar?";
  if (tipo) {
    url += "tipo=" + tipo + "&";
  }
  if (estado) {
    url += "estado=" + estado + "&";
  }
  if (ciudad) {
    url += "ciudad=" + ciudad;
  }
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let viviendas = "";
      for (let i = 0; i < data.length; i++) {
        viviendas += `
          <div class="card" id="${data[i]._id}">
            <h3 class="tipo">${data[i].tipo}</h3>
            <h4 class="estado">${data[i].estado}</h4>
            <p class="descripcion">Descripción: ${data[i].descripcion}</p>
            <p class="metros">Metros construidos: ${data[i].metros}</p>
            <p class="habitaciones">Habitaciones: ${data[i].habitaciones}</p>
            <p class="baños">Baños: ${data[i].baños}</p>
            <p class="patio">Terreno: ${data[i].patio}</p>
            <p class="ciudad">Ciudad: ${data[i].ciudad}</p>
            <div>
              <img class="img1" src="${data[i].img1}" alt="vivienda" width="180" height="240">
              <img class="img2" src="${data[i].img2}" alt="vivienda" width="180" height="240">
              <img class="img3" src="${data[i].img3}" alt="vivienda" width="180" height="240">
            </div>
            <div class="precio">Precio: ${data[i].precio}</div>
            <button onclick="eliminarVivienda('${data[i]._id}')">Eliminar</button>
            <button onclick="editarVivienda('${data[i]._id}')">Editar</button>
          </div>
        `;
      }
      document.getElementById("div1").innerHTML = viviendas;
    });
}

//ELIMINAR VIVIENDA
function eliminarVivienda(id) {
  fetch(`/api/viviendas/${id}`, {
    method: "DELETE",
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      recibirVivienda();
    });
}
// EDITAR VIVIENDA
function editarVivienda(id) {
  console.log("ID de la vivienda:", id); // Imprime el valor del parámetro id
  let viviendaCard = document.getElementById(id);
  console.log("Elemento de la tarjeta de vivienda:", viviendaCard); // Imprime el elemento viviendaCard
  let tipo = viviendaCard.querySelector(".tipo").innerHTML;
  let estado = viviendaCard.querySelector(".estado").innerHTML;
  let descripcion = viviendaCard.querySelector(".descripcion").innerHTML;
  let metros = viviendaCard.querySelector(".metros").innerHTML;
  let habitaciones = viviendaCard.querySelector(".habitaciones").innerHTML;
  let baños = viviendaCard.querySelector(".baños").innerHTML;
  let patio = viviendaCard.querySelector(".patio").innerHTML;
  let ciudad = viviendaCard.querySelector(".ciudad").innerHTML;
  let nuevaImagen1 = viviendaCard.querySelector(".edit-img1").files[0];
  let nuevaImagen2 = viviendaCard.querySelector(".edit-img2").files[0];
  let nuevaImagen3 = viviendaCard.querySelector(".edit-img3").files[0];
  let formData1 = new FormData();
  formData1.append("file", nuevaImagen1);
  formData1.append("upload_preset", "inmobiliaria_lc");
  formData1.append("folder", "Inmobiliaria");
  let formData2 = new FormData();
  formData2.append("file", nuevaImagen2);
  formData2.append("upload_preset", "inmobiliaria_lc");
  formData2.append("folder", "Inmobiliaria");
  let formData3 = new FormData();
  formData3.append("file", nuevaImagen3);
  formData3.append("upload_preset", "inmobiliaria_lc");
  formData3.append("folder", "Inmobiliaria");
  Promise.all([
    fetch("https://api.cloudinary.com/v1_1/pruebaweb/image/upload", {
      method: "POST",
      body: formData1,
    }),
    fetch("https://api.cloudinary.com/v1_1/pruebaweb/image/upload", {
      method: "POST",
      body: formData2,
    }),
    fetch("https://api.cloudinary.com/v1_1/pruebaweb/image/upload", {
      method: "POST",
      body: formData3,
    }),
  ])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((results) => {
      // imageUrls contiene las URLs de las imágenes en Cloudinary
      let img1 = results[0].secure_url;
      let img2 = results[1].secure_url;
      let img3 = results[2].secure_url;
      let precio = viviendaCard.querySelector(".precio").innerHTML;
      viviendaCard.innerHTML = `
        <input type="text" value="${tipo}" class="edit-tipo">
        <input type="text" value="${estado}" class="edit-estado">
        <input type="text" value="${descripcion}" class="edit-descripcion">
        <input type="text" value="${metros}" class="edit-metros">
        <input type="text" value="${habitaciones}" class="edit-habitaciones">
        <input type="text" value="${baños}" class="edit-baños">
        <input type="text" value="${patio}" class="edit-patio">
        <input type="text" value="${ciudad}" class="edit-ciudad">
        <input type="file" class="edit-img1">
        <input type="file" class="edit-img2">
        <input type="file" class="edit-img3">
        <input type="text" value="${precio}" class="edit-precio">
        <button onclick="guardarEdicion('${id}')">Guardar</button>
        <button onclick="cancelarEdicion('${id}', '${tipo}', '${estado}', '${descripcion}', '${metros}', '${habitaciones}', '${baños}', '${patio}', '${ciudad}', '${img1}', '${img2}', '${img3}', '${precio}')">Cancelar</button>
      `;
    })
    .catch((error) => {
      console.error("Error al cargar imágenes en Cloudinary:", error);
    });
}

// GUARDAR CAMBIOS
function guardarEdicion(id) {
  let viviendaCard = document.getElementById(id);
  let tipo = viviendaCard.querySelector(".edit-tipo").value;
  let estado = viviendaCard.querySelector(".edit-estado").value;
  let descripcion = viviendaCard.querySelector(".edit-descripcion").value;
  let metros = viviendaCard.querySelector(".edit-metros").value;
  let habitaciones = viviendaCard.querySelector(".edit-habitaciones").value;
  let baños = viviendaCard.querySelector(".edit-baños").value;
  let patio = viviendaCard.querySelector(".edit-patio").value;
  let ciudad = viviendaCard.querySelector(".edit-ciudad").value;
  let img1 = viviendaCard.querySelector(".edit-img1").value;
  let img2 = viviendaCard.querySelector(".edit-img2").value;
  let img3 = viviendaCard.querySelector(".edit-img3").value;
  let precio = viviendaCard.querySelector(".edit-precio").value;
  let viviendaActualizar = {
    tipo,
    estado,
    descripcion,
    metros,
    habitaciones,
    baños,
    patio,
    ciudad,
    img1,
    img2,
    img3,
    precio,
  };
  fetch(`/api/viviendas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(viviendaActualizar),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log(data);
      recibirVivienda();
    });
}

function cancelarEdicion(
  id,
  tipo,
  estado,
  descripcion,
  metros,
  habitaciones,
  baños,
  patio,
  ciudad,
  img1,
  img2,
  img3,
  precio
) {
  let viviendaCard = document.getElementById(id);
  viviendaCard.innerHTML = `
    <h3 class="tipo">${tipo}</h3>
    <h4 class="estado">${estado}</h4>
    <p class="descripcion">Descripción: ${descripcion}</p>
    <p class="metros">Metros construidos: ${metros}</p>
    <p class="habitaciones">Habitaciones: ${habitaciones}</p>
    <p class="baños">Baños: ${baños}</p>
    <p class="patio">Terreno: ${patio}</p>
    <p class="ciudad">Ciudad: ${ciudad}</p>
    <div>
      <img class="img1" src="${img1}" alt="vivienda" width="180" height="240">
      <img class="img2" src="${img2}" alt="vivienda" width="180" height="240">
      <img class="img3" src="${img3}" alt="vivienda" width="180" height="240">
    </div>
    <div class="precio">Precio: ${precio}</div>
    <button onclick="eliminarVivienda('${id}')">Eliminar</button>
    <button onclick="editarVivienda('${id}')">Editar</button>
  `;
}
