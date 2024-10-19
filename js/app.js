const consultarAPI = async () => {
    var dir = document.getElementById("url").value;
   
    var p1 = dir.indexOf("@");
    var p2 = dir.indexOf(",");
    let sub = dir.substring(p2 + 1, dir.length);
    
    let p3 = sub.indexOf(",");
    let lat0 = parseFloat(dir.substring(p1 + 1, p2 - 1));
    let lon0 = parseFloat(sub.substring(0, p3 - 1));
    
    console.log("LATITUD: " + lat0);
    console.log("LONGITUD: " + lon0);

    if (isNaN(lat0) || isNaN(lon0)) {
        Swal.fire({ title: "ERROR", text: "ERROR EN DATOS", icon: "error" });
        return;
    }
    
    const apikey = "8c7b1b2e8ec58d16f10bd3503bd0a18e";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat0}&lon=${lon0}&appid=${apikey}&units=metric&lang=es`);
    
    if (!response.ok) {
        Swal.fire({ title: "ERROR", text: "No se pudo obtener los datos", icon: "error" });
        return;
    }
    
    const json = await response.json();
    console.log(json);

    document.getElementById('datos').innerHTML = `
        <h3>CIUDAD: ${json.city.name}</h3>
        <h4>LAT: <b>${json.city.coord.lat}</b> LON: <b>${json.city.coord.lon}</b></h4>
        <h4>POBLACIÓN: <b>${json.city.population} habitantes</b></h4>
        <h4>ZONA HORARIA: <b>${parseInt(json.city.timezone) / 3600} UTC</b></h4>
    `;

    moment.locale('es');
    
    let html = "";
    const timezoneOffset = json.city.timezone; // Obtiene el offset de zona horaria en segundos

    json.list.slice(0, 6).map(hr => {
        var date = new Date((hr.dt + timezoneOffset) * 1000).toLocaleString("es-MX"); // Ajusta la hora
        let f = moment(date, "DD/MM/YYYY, hh:mm:ss A").format('h:mm A DD MMMM');

        html += `
            <div class="card text-center shadow border m-2 p-2 fondo text-white">
                <p>${f.toUpperCase()}</p>
                <p>${hr.weather[0].description.toUpperCase()}</p>
                <p><img src="https://openweathermap.org/img/wn/${hr.weather[0].icon}@2x.png" width="100px" height="100px"></p>
                <p>TEMP: ${hr.main.temp} °C</p>
                <p>PRESIÓN: ${hr.main.pressure} hPa</p>
                <p>HUMEDAD: ${hr.main.humidity} %</p>
                <p>NUBOSIDAD: ${hr.clouds.all} %</p>
                <p>VELOCIDAD DEL VIENTO: <b>${hr.wind.speed} m/s</b></p>
                <p>LLUVIA: <b>${hr.pop} %</b></p>
            </div>
        `;
    });
    
    document.getElementById('divResultado').innerHTML = html; // Agrega los datos al HTML
}

const borrar = () => {
    document.getElementById('url').value = '';
    document.getElementById('datos').innerHTML = '';
    document.getElementById('divResultado').innerHTML = '';
}
