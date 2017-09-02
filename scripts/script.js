mapboxgl.accessToken = 'pk.eyJ1Ijoia29raHRldiIsImEiOiJjaXplaXAzYTEwMDY2MnFreTY2dHkwcWhpIn0.5wc4efR7jjB3InwAYAAROQ';
var center = [98,66];
/*if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    center = [0,0];
}*/
var map = new mapboxgl.Map({
    attributionControl: false,
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: center,
    zoom: 2.3,
    })
.addControl(new mapboxgl.AttributionControl({
    compact: true
}));
var time = Array.apply(null, {length: 2017}).map(Number.call, Number)
function year_filter(t) {
    var filter = ['<=', 'year', t];
    map.setFilter('year-circles', filter);
    var year_string = '';
    year_string = t.toString() + ' год';
    document.getElementById('year_slider').textContent = year_string;
}

map.on('load', function() {
    fetch('./Data/bounds.geojson') ////////////////////////
        .then(result => result.json())
        .then(d => {
        map.addLayer({
            "id": "bounds",
            "type": "line",
            "source": {
               "type": "geojson",
               "data": d
            },
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#787878",
                'line-opacity': 0.6,
                "line-width": 1
            }
        })
    });
    fetch('./Data/cities.geojson') //////////////////////////////
    .then(res => res.json())
    .then(data => {
        map.addSource('year', {
            'type': 'geojson',
            'data': data
        });
        map.addLayer({
            'id': 'year-circles',
            'type': 'circle',
            'source': 'year',
            'paint': {
                'circle-color':'#195464',
                'circle-opacity': 1,
                "circle-radius": 2.5
            }
        });
        year_filter(700);
        document.getElementById('slider').addEventListener('input', function(e) {
            var time = parseInt(e.target.value, 10);
            year_filter(time);
        });
    });
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });
    map.on('mouseenter', 'year-circles', function(e) {
        map.getCanvas().style.cursor = 'pointer';
        y = e.features[0].properties.year
        if (y < 0) {
            showing_year = (-1*y).toString() + ' год до н.э.';
        } else {
            showing_year = (y).toString() + ' год';
        }
        popup.setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.city.split('(')[0]+'<div>'+showing_year+'</div>')
            .addTo(map);
    });
    map.on('mouseleave', 'year-circles', function() {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
});
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-left');