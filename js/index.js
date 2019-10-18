const container = document.getElementById('container1');
const waste_input = document.querySelector('.waste_input');
const growth_input = document.querySelector('.growth_input');
const height_input = document.querySelector('.height_input');
const ratio_input = document.querySelector('.ratio_input');

let dataset = {};
let isRepeat = false;
let rotateX = 0;
let rotateY = 0;
let scaleFactor = 225;
let projectionType = 'orthographic'; // mercator / azimuthalEqualArea / equirectangular / orthographic
let currentYear = parseInt(document.querySelector('.time_slider').value);
let playbackRate = 50;

setInterval(() => {
  if (isRepeat) {
    generateMapConfig();
    redraw();
    document.querySelector('.time_slider').value =
      parseInt(document.querySelector('.time_slider').value) + 1;
    currentYear += 1;
    document.querySelector('.year_display').innerHTML = `${currentYear} year`;
  }
}, playbackRate);
generateDatasetByPara();
generateMapConfig();
redraw();

function generateMapConfig() {
  const maxValue = Math.max(...series.map((o) => o[1]), 0);

  const minValue = Math.min(...series.map((o) => o[1]), 0);
  console.log({ maxValue, minValue });

  series.forEach((item) => {
    let country = item[0];
    let value = item[1] < currentYear ? currentYear : item[1];
    let remainYear = value - currentYear;
    dataset[country] = {
      numberOfThings: remainYear,
      fillColor: `rgba(${(255 * currentYear) / value}, 30, ${(60 * remainYear) / value}, ${
        remainYear ? 1 : 0
      })`,
    };
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

        return `<div class="hoverinfo">
                  <div class = "country_row">${geo.properties.name}</div>
                  <div class = "value_row">Year remained: ${data.numberOfThings}</div>
                </div>`;
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

function randomGenerateDataset() {
  series = series.map((obj) => {
    obj[1] = Math.random() * 100;
    return obj;
  });
}

function generateDatasetByPara() {
  console.log('gen');
  series = defaultData.map((obj) => {
    let area = obj[2];
    let height = height_input.value / 100;
    let weightToVolumn = ratio_input.value;
    let growthRate = growth_input.value / 100 + 1;
    let wastePerCapita = obj[3] + parseInt(waste_input.value);
    let population = obj[1];

    surviveYear = calculateGarbage(
      area,
      height,
      weightToVolumn,
      growthRate,
      wastePerCapita,
      population
    );
    return [obj[0], surviveYear];
  });
}
