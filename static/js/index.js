const jMap = $('.map');
let height = jMap.height();
let width = jMap.width();
let mapJsonUrl = 'https://ucarecdn.com/8e1027ea-dafd-4d6c-bf1e-698d305d4760/world110m2.json';
let svg = d3
  .select('.map')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

const getProjection = function(worldJson) {
    // create a first guess for the projection
    let scale = 1;
    let offset = [width / 2, height / 2];
    let projection = d3
      .geoEquirectangular()
      .scale(scale)
      .rotate([0, 0])
      .center([0, 5])
      .translate(offset);
    let bounds = mercatorBounds(projection);

    let scale = width / (bounds[1][0] - bounds[0][0]);
    let scaleExtent = [scale, 10 * scale];

    projection.scale(scaleExtent[0]);

    return projection;
  },
  mercatorBounds = function(projection) {
    // find the top left and bottom right of current projection
    let maxLatitude = 83;
    let yaw = projection.rotate()[0];
    let xymax = projection([-yaw + 180 - 1e-6, -maxLatitude]);
    let xymin = projection([-yaw - 180 + 1e-6, maxLatitude]);

    return [xymin, xymax];
  };

d3.json(mapJsonUrl, function(error, worldJson) {
  if (error) throw error;

  let projection = getProjection();
  let path = d3.geoPath().projection(projection);

  svg
    .selectAll('path.land')
    .data(topojson.feature(worldJson, worldJson.objects.countries).features)
    .enter()
    .append('path')
    .attr('class', 'land')
    .attr('d', path);
});
