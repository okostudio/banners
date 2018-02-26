var banner = {
  imagesLoaded: 0,
  images: [],
  htmlMem: '',
};

// IMAGE PRELOADER ----------------------------------
function preLoadImage(imgURL, targetElement){
var newImage = new Image();
newImage.onload = imageLoaded;
newImage.src = imgURL;
}

function imageLoaded(e){
  banner.imagesLoaded ++;

  if(banner.imagesLoaded == banner.images.length && !banner.init){
    banner.init = true;
    trace('>> ALL IMAGES LOADED')
    frame0();
  }
}

//  ---- LISTENERS --------------------------
function addListeners(){
  trace(">> LISTENERS ADDED")
  $('.clickthrough').click(onClickThrough);
  $('.clickthrough').mouseover(onExitOver);
  $('.clickthrough').mouseout(onExitOut);
  // // $('.replay').click(replay);
}

function onClickThrough(){
  window.open(window.clickTag);
  // Enabler.exit('Backgrond Clickthrough');
  console.log('>> Clickthrough');
}

function onExitOver(){ to('.hover', 0.4, {alpha: 1}, 'out') };
function onExitOut(){ to('.hover', 0.4, {alpha: 0}, 'out') };


// ---- DYNAMIC DOTS ------------------------------
function drawDots(width, height, diameter, spacing, color){
  if(!color) color = "#fff";
  var html = '<defs><style>.text-color{fill:'+ color +'}</style></defs>';
  var x = spacing * 0.5, 
      y,
      radius = diameter * 0.5;
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 " + width + " " + height);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("id", "dots");
  while(x < width){
    y = spacing * 0.5;
    while(y < height){
      var circleX = x + radius;
      var circleY = y + radius;
        html += '<circle class="text-color" cx="'+ circleX +'" cy="'+ circleY +'" r="'+ radius +'"/>';
      y += diameter + spacing;
    }
    x += diameter + spacing;
  }
  svg.innerHTML = html;
  document.querySelectorAll('.banner .htmlMem .dots')[0].appendChild(svg);
  $('.dots').html(document.querySelector('.banner .htmlMem .dots').innerHTML);
}



// ---- COLOUR TRANSITIONS --------------------------
function colorTween(color1, color2, time, ease, onUpdateFunction, delay){
  var fromObject = toRGB(color1);
  var toObject = toRGB(color2);
  
  toObject.onUpdate = onUpdateFunction;
  toObject.onUpdateParams = [fromObject];
  toObject.ease = ease;
  toObject.delay = delay;

  TweenLite.to(fromObject, time, toObject);

}

function toRGB(hex){
  var c;
  if(hex.indexOf('rgb') > -1){
    c = hex.replace(/[^0-9,]/g, '').split(',');
    return {r: c[0], g: c[1], b: c[2]};
  }
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return {r: (c>>16)&255, g: (c>>8)&255, b: c&255};
  }
  throw new Error('Bad Hex');
}

function roundRgbValues(rgbObject){
  return 'rgb(' + [ Math.round(rgbObject.r), Math.round(rgbObject.g), Math.round(rgbObject.b) ] + ')';
}



// ---- SPLIT SEPARATE FRAMES -------------------------
function separateFrames(){
  killAll();

  var totalFrames = [];
  var htmlCopy = "";
  $('.frame').map(function(index, i){
    
    if( /frame[0-9]/.test($(i).attr('class')) ){
      totalFrames.push(index);
      htmlCopy += htmlOriginal;
    }

  });
    
  $('body').html(htmlCopy);
  
  var banners = $('.banner');
  for(i = 0; i < banners.length; i++){
    var _i = i+1;
    
    $(banners[i]).addClass('banner' + _i);
    
    $('.banner').css({
      display: 'inline-block',
      position: 'relative',
      margin: '0 30px 30px 0'
    });

    $('.banner' + _i).show();
    $('.banner' + _i + " .frame" + _i).show();
    banner.expanded = {height: $('.banner' + _i).offset().top + banner.height + 50};
    
    var _i = i+1;
    var x = $('.banner' + _i).offset().left - $('.banner' + 1).offset().left;
    var y = $('.banner' + _i).offset().top - $('.banner' + 1).offset().top;
    from('.banner' + _i, 0.3, {x: -x, y: -y, alpha: 0}, 'out');

  }

  onSplitFrames();
}



function resetFrames(){
  killAll();
  var banners = $('.banner');
  for(i = 1; i < banners.length; i++){
    var _i = i+1;
    var x = $('.banner' + _i).offset().left - $('.banner' + 1).offset().left;
    var y = $('.banner' + _i).offset().top - $('.banner' + 1).offset().top;
    to('.banner' + _i, 0.2, {x: -x, y: -y, alpha: 0}, 'in');
  }

  wait(0.2, function(){
    killAll();
    $('body').html(htmlOriginal);
    $('.banner').show();
    frame1();
  })
}