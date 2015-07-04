window.onload = function() {

    // Choose center and zoom level
    var options = {
                center: [19.411, -99.16], // Ciudad de México
                zoom: 10
            }

    // Instantiate map on specified DOM element
    var map = new L.Map('map', options);
    //En polygons vamos a guardar los features resaltados

    // Add a basemap to the map object just created
    L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: 'Stamen'
        }).addTo(map);

    //El estilo para la capa de usos de suelo
    s1 = "#usos_colonia{\
            polygon-fill: #FFFFB2;\
            polygon-opacity: 0.8;\
            line-color: #FFF;\
            line-width: 0.1;\
            line-opacity: 1;\
          }\
          #usos_colonia [ entropia <= 0.822853671464274] {\
             polygon-fill: #B10026;\
          }\
          #usos_colonia [ entropia <= 0.487766945422883] {\
             polygon-fill: #E31A1C;\
          }\
          #usos_colonia [ entropia <= 0.34212827696922] {\
             polygon-fill: #FC4E2A;\
          }\
          #usos_colonia [ entropia <= 0.30266251565322] {\
             polygon-fill: #FD8D3C;\
          }\
          #usos_colonia [ entropia <= 0.237916871657603] {\
             polygon-fill: #FEB24C;\
          }\
          #usos_colonia [ entropia <= 0.166048720217869] {\
             polygon-fill: #FED976;\
          }\
          #usos_colonia [ entropia <= 0.16026284961159] {\
             polygon-fill: #FFFFB2;\
         }"


    //La fuente de datos para la capa
    q1 = 'select * from usos_colonia'
    var layerSource = {
      user_name: 'plabloedu',
      type: 'cartodb',
      sublayers: [
        {
          sql: q1,
          interactivity: 'cartodb_id,the_geom',
          cartocss: s1
        }
    ]};

    options = options || {}//Si no nos pasan opciones, instanciamos unas vacías
    //El estilo para resaltar el polígono
    var HIGHLIGHT_STYLE = {
        weight: 3,
        color: '#FFFFFF',
        opacity: 1,
        fillColor: '#FFFFFF',
        fillOpacity: 0.3
    };
    //Colgamos el estilo a la propiedad style de las opciones (si no la tiene)
    style = options.style || HIGHLIGHT_STYLE;


    //Esta es la función que configura la interactividad de la capa
    function geometryClick(username, map, layer, options) {
        var polygons = {};

        //Creamos un array para guardar los polígonos resaltados, para poder borralos después
        var polygonsHighlighted = [];

        // Traemos la geometría del polígono clickeado
        function fetchGeometry(id){
            var sql = new cartodb.SQL({ user: username, format: 'geojson' });
            sql_stmt = "select cartodb_id, the_geom  from (" +layer.getSQL() + ") as _wrap where _wrap.cartodb_id="+ id
            sql.execute(sql_stmt).
            done(function(geojson) {
                //Cuando el query regrese los datos, agarramos su geometría,
                //la convertimos en capa de leaflet y la añadimos al mapa
                var feature = geojson.features[0];
                var geo = L.GeoJSON.geometryToLayer(feature.geometry);
                map.addLayer(geo)
                //También la añadimos en polygonsHighlighted
                polygonsHighlighted.push(geo)
            })
            .error(function(errors) {
                // errors contains a list of errors
                console.log("errors:" + errors);
            });
        }


        function featureClick(e, pos, latlng, data) {
            //console.log(data)
            featureOut();
            fetchGeometry(data.cartodb_id)
        }

        function featureOut() {
            var pol = polygonsHighlighted;
            for(var i = 0; i < pol.length; ++i) {
              map.removeLayer(pol[i]);
            }
            polygonsHighlighted = [];
        }

        layer.on('featureClick', featureClick);
        //layer.on('featureOut', featureOut);
        layer.setInteraction(true);

    }


    //Instanciamos la capa a partir de la fuente de datos
    cartodb.createLayer(map, layerSource, {cartodb_logo: false})
    .addTo(map)
    .on('done',function(layer){//Aquí colgamos la función que maneja la interactividad
        //console.log('capaaaaa')
        geometryClick('plabloedu', map, layer.getSubLayer(0));
    })
    .on('error',function(){
        cartodb.log.log("some error occurred");
    });
}
