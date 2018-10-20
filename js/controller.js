let isShowing = true;
let isMousedown = false;
let isSimutating = false;

const controller_btn = document.querySelector('.controller_btn');
const controller_wrap = document.querySelector('.controller_wrap');
const time_slider = document.querySelector('.time_slider');
const simulation_btn = document.querySelector('.simulation_btn');

controller_btn.addEventListener('click', () => {
  if (isShowing) {
    controller_btn.style.opacity = 1;
    controller_wrap.style.opacity = 0;
    controller_wrap.style.transform = 'translateX(0%)';
  } else {
    controller_wrap.style.opacity = 1;
    controller_wrap.style.transform = 'translateX(calc( 100% + 15px )';
  }
  isShowing = !isShowing;
});

simulation_btn.addEventListener('click', startSimulation);

document.querySelector('.reset_wrap').addEventListener('click', () => {
  scaleFactor = 225;
  rotateY = 0;
  redraw();
});
document.querySelector('.stop_wrap').addEventListener('click', () => {
  document.querySelector('.time_slider').value = 0;
  currentYear = parseInt(document.querySelector('.time_slider').value);
  generateMapConfig();
  redraw();
});
document.querySelector('.projection_wrap').addEventListener('click', () => {
  projectionType = projectionType === 'equirectangular' ? 'orthographic' : 'equirectangular';
  redraw();
});

time_slider.addEventListener('change', updateMapBySlider);
time_slider.addEventListener('mousemove', updateMapBySlider);
time_slider.addEventListener('mousedown', () => (isMousedown = true));
time_slider.addEventListener('mouseup', () => (isMousedown = false));

function updateMapBySlider() {
  console.log('range');
  currentYear = parseInt(document.querySelector('.time_slider').value);
  document.querySelector('.year_display').innerHTML = `${currentYear} year`;
  if (isMousedown) {
    generateMapConfig();
    redraw();
  }
}

function startSimulation() {
  if (isSimutating) {
    this.textContent = 'Start Simulation ▶';
    this.style.backgroundColor = 'mediumseagreen';
  } else {
    this.textContent = 'Stop Simulation ■';
    this.style.backgroundColor = 'red';

    generateDatasetByPara();
    generateMapConfig();
    redraw();
  }
  isSimutating = !isSimutating;
  isRepeat = !isRepeat;
}
