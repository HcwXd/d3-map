let dataset = {};
let opacity = 0;
let isRepeat = true;
let rotateX = 0;

setInterval(() => {
  if (isRepeat) {
    IterateDataset();
    renderMap(dataset, 'equirectangular');
  }
  // isRepeat = false;
}, 100);

function IterateDataset() {
  randomDataset();

  var onlyValues = series.map(function(obj) {
    return obj[1];
  });
  var minValue = Math.min.apply(null, onlyValues);
  var maxValue = Math.max.apply(null, onlyValues);

  var paletteScale = d3.scale
    .linear()
    .domain([minValue, maxValue])
    .range(['#EFEFFF', '#02386F']);

  series.forEach((item) => {
    let country = item[0];
    let value = item[1];
    dataset[country] = { numberOfThings: value, fillColor: paletteScale(value) };
    // dataset[country] = { numberOfThings: value, fillColor: `rgba(255, 0, 0, ${opacity})` };
  });
  opacity += 0.01;
}

function renderMap(dataset, projection) {
  document.getElementById('container1').innerHTML = '';
  new Datamap({
    element: document.getElementById('container1'),
    projection: projection, // mercator / azimuthalEqualArea / equirectangular / orthographic
    responsive: true,

    fills: { defaultFill: '#F5F5F5' },
    data: dataset,

    setProjection: function(element) {
      var projection = d3.geo
        .equirectangular()
        .center([0, 0])
        .rotate([rotateX, 0])
        .scale(250)
        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

      var path = d3.geo.path().projection(projection);
      rotateX += 1;
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
  });
}

function randomDataset() {
  series = series.map((obj) => {
    obj[1] = Math.random() * 100;
    return obj;
  });
}
