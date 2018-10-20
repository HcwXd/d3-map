const container = document.getElementById('container1');
let dataset = {};
let isRepeat = true;
let rotateX = 0;
let rotateY = 0;
let scaleFactor = 250;
let translateFactor = [container.offsetWidth / 2, container.offsetHeight / 2];

let projectionType = 'equirectangular'; // mercator / azimuthalEqualArea / equirectangular / orthographic

setInterval(() => {
  if (isRepeat) {
    generateDataset();
    renderMap(dataset);
  }
  isRepeat = false;
}, 100);

function generateDataset() {
  randomDataset();

  const onlyValues = series.map(function(obj) {
    return obj[1];
  });
  const minValue = Math.min.apply(null, onlyValues);
  const maxValue = Math.max.apply(null, onlyValues);

  const paletteScale = d3.scale
    .linear()
    .domain([minValue, maxValue])
    .range(['#EFEFFF', '#02386F']);

  series.forEach((item) => {
    let country = item[0];
    let value = item[1];
    dataset[country] = { numberOfThings: value, fillColor: paletteScale(value) };
  });
}

function renderMap(dataset) {
  const livemap = new Datamap({
    element: document.getElementById('container1'),
    responsive: true,

    fills: { defaultFill: '#F5F5F5' },
    data: dataset,

    setProjection: function(element) {
      const projection = d3.geo[projectionType]()
        .center([0, 0])
        .rotate([rotateX, rotateY])
        .scale(scaleFactor)
        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

      const path = d3.geo.path().projection(projection);
      return { path: path, projection: projection };
    },

    geographyConfig: {
      borderColor: '#DEDEDE',
      highlightBorderWidth: 2.5,

      highlightFillColor: function(geo) {
        return geo['fillColor'] || '#F5F5F5';
      },

      highlightBorderColor: '#B7B7B7',

      popupTemplate: function(geo, data) {
        if (!data) {
          return;
        }

        return [
          '<div class="hoverinfo">',
          '<strong>',
          geo.properties.name,
          '</strong>',
          '<br>Count: <strong>',
          data.numberOfThings,
          '</strong>',
          '</div>',
        ].join('');
      },
    },

    done: function() {
      const drag = d3.behavior.drag().on('drag', function() {
        var dx = d3.event.dx;
        var dy = d3.event.dy;

        var rotation = [rotateX, rotateY];
        var radius = livemap.projection.scale();
        var scale = d3.scale
          .linear()
          .domain([-1 * radius, radius])
          .range([-90, 90]);
        var degX = scale(dx);
        var degY = scale(dy);
        rotation[0] += degX;
        rotation[1] -= degY;
        if (rotation[1] > 90) rotation[1] = 90;
        if (rotation[1] < -90) rotation[1] = -90;

        if (rotation[0] >= 180) rotation[0] -= 360;
        [rotateX, rotateY] = [...rotation];
        redraw();
      });

      const zoom = d3.behavior.zoom().on('zoom', function() {
        scaleFactor = scaleFactor * Math.sqrt(d3.event.scale);
        redraw();
      });
      d3.select('#container1')
        .select('svg')
        .call(zoom);

      d3.select('#container1')
        .select('svg')
        .call(drag);
    },
  });
}

function redraw() {
  d3.select('#container1').html('');
  renderMap(dataset);
}

function randomDataset() {
  series = series.map((obj) => {
    obj[1] = Math.random() * 100;
    return obj;
  });
}
