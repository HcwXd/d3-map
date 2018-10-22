let isShowing = false;
let isMousedown = false;
let isSimutating = false;

const controller_btn = document.querySelector('.controller_btn');
const controller_wrap = document.querySelector('.controller_wrap');
const time_slider = document.querySelector('.time_slider');
const simulation_btn = document.querySelector('.simulation_btn');
document.querySelector('.landing_confirm_btn').addEventListener('click', () => {
  document.querySelector('.landing_info').style.display = 'none';
  let isShowing = true;
  controller_wrap.style.opacity = 1;
  controller_wrap.style.transform = 'translateX(calc( 100% + 15px )';
});

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
  document.querySelector('.year_display').innerHTML = `${currentYear} year`;
  generateDatasetByPara();
  generateMapConfig();
  redraw();
});
document.querySelector('.projection_wrap').addEventListener('click', () => {
  projectionType = projectionType === 'equirectangular' ? 'orthographic' : 'equirectangular';
  redraw();
});

time_slider.addEventListener('change', updateMapBySlider);
time_slider.addEventListener('mousemove', () => {
  isMousedown && updateMapBySlider();
});
time_slider.addEventListener('mousedown', () => (isMousedown = true));
time_slider.addEventListener('mouseup', () => (isMousedown = false));

function updateMapBySlider() {
  currentYear = parseInt(document.querySelector('.time_slider').value);
  document.querySelector('.year_display').innerHTML = `${currentYear} year`;
  generateMapConfig();
  redraw();
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

document.querySelectorAll('.hover_info').forEach((el) => {
  el.addEventListener('mouseenter', function() {
    document.querySelector(`[data-show='${this.dataset.hover}']`).style.opacity = '1';
  });
  el.addEventListener('mouseout', function() {
    document.querySelector(`[data-show='${this.dataset.hover}']`).style.opacity = '0';
  });
});
