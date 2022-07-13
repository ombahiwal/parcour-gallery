const cardCanvas = document.querySelector(".canvas");
const cardContainer = document.querySelector(".cards");
const cards = document.querySelectorAll(".card:not(.hidden)");
const ratio = [3, 4];
const slackFraction = 5;

let isDragging = false;
let isDown = false;
let velX;
let startX;
let velY;
let startY;

// var c = document.getElementById("myCanvas");
// var ctx = c.getContext("2d");
// ctx.moveTo(0, 0);
// ctx.lineTo(200, 200);
// ctx.stroke();

var width = window.innerWidth;
var height = window.innerHeight;

// animation equations

function easeOutCirc (t, b, c, d) {
  return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
}

function changePositionLayer(coords, layer) {
  
  layer.absolutePosition({x:0-coords.x, y:0-coords.y})
}

function stickTextToPointer(coords, text){
  text.absolutePosition({x:coords.x+200, y:coords.y +100});
}

function getRandomCoordInCirc(){
  var radius = (width) * 2;
  var pt_angle = Math.random() * 2 * Math.PI;
    var pt_radius_sq = Math.random() * radius * radius;
    var pt_x = Math.floor(Math.abs(Math.sqrt(pt_radius_sq) * Math.cos(pt_angle)));
    var pt_y = Math.floor(Math.abs(Math.sqrt(pt_radius_sq) * Math.sin(pt_angle)));
    return {x:pt_x, y:pt_y};
}

function generateCoord(){
    return {x:Math.floor(Math.random() * width * 1.5 + 100), y:Math.floor(Math.random() * height * 1.5 + 100)}
}

function distanceBetween(x1, y1, x2, y2){
    var a = x1 - x2;
  var b = y1 - y2;
  return Math.sqrt( a*a + b*b );
}

var randomPoints = new Array();

// function to generate random points in a 2d rectangle. rect1
function randomRect(){  
    var pt_count = 0;
    var rp_arr = new Array({x:0, y:0});
    while(pt_count <= imagesData.length) {
      // var pt_r = generateCoord();
      var pt_r = getRandomCoordInCirc()
      var pt_flag = true;
      // x and y, to randomPoints
      rp_arr = rp_arr;
      randomPoints.every((pt)=>{
        console.log(pt_r.x, pt_r.y, pt.x, pt.y,distanceBetween(pt_r.x, pt_r.y, pt.x, pt.y));
        if(parseInt(distanceBetween(pt_r.x, pt_r.y, pt.x, pt.y)) <= 800){
          pt_flag = false;
          return false;
        }
      });
      console.log(pt_flag, pt_r);
      if(pt_flag){
        randomPoints.push(pt_r);
        rp_arr.push(pt_r)
        pt_count++;
      }
    }
  }


// function to get all image elements
function scrapeImages(){
  var section = document.getElementById("entries");
  console.log(section.children[0].children[0]);
  var total = section.children.length;
  var article;
  var imagesArray = new Array({});
  var imageData;
  // section loop (articles)
  for(var i = 0; i < total; i++){
    imageData = new Object();
    article = section.children[i];
    imageData['nominated'] = article.dataset.nominated === 'no' ? false : true;
    imageData['degree'] = article.dataset.degree;
    imageData['major'] = article.dataset.major;
    imageData['tags'] = article.dataset.tags;
    imageData['href'] = article.children[0].href;
    imageData['portrait'] = article.children[0].children[0].children[0].src;
    imageData['thumbnail'] = article.children[0].children[1].children[0].src;
    imageData['project'] = article.children[0].children[2].children[1].innerHTML;
    imageData['name'] = article.children[0].children[2].children[0].innerHTML;
    if(!imageData['thumbnail'].includes('localhost'))
      imagesArray.push(imageData);
  }
  return imagesArray;
}
// Stage
var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
  draggable:true,
});

var ratio_scale_factor = 2;
var layer = new Konva.Layer();
var layer2 = new Konva.Layer();
var image_array = new Array();
var total_images = 10;
var init_coord = 0;
var rect1 = new Konva.Rect({
  x:0, 
  y:0, 
  width:width * 1.5, 
  height:height * 1.5,
  stroke:'black',
  strokeWidth:1,
});



// scrape image from 
  function drawImage(imageObjPortrait, imgObjThumbIndex){

    var random_coord = randomPoints[imgObjThumbIndex];
    console.log(random_coord, randomPoints)
    // for( var img_count = total_images; img_count >1; img_count-- ){
    //   var random_coord = getRandomCoordInCirc();
    //   // console.log(random_coord)
    //   image_array.push(new Konva.Image({
    //     image: imageObj,
    //     x: random_coord.x,
    //     y: random_coord.y,
    //     width: 200,
    //     height: 300,
    //   }));
       
    //   init_coord = random_coord;
    //   // layer.add(image_array[img_count]);
    // }
    // console.log(image_array)

    // darth vader
    var actual_height = imageObjPortrait.height/ratio_scale_factor;
    var actual_width = imageObjPortrait.width/ratio_scale_factor;
    var darthVaderImg = new Konva.Image({
      image: imageObjPortrait,
      x: random_coord.x,
      y: random_coord.y,
      height: actual_height,
      width: actual_width,
      offsetX: actual_width/4,
      offsetY: actual_height/4
    });
   
    

    // animation of images
    var period = 2000;
    var scale = 1;
    var animZoomIn = new Konva.Animation(function (frame){
      // var scale = Math.sqrt((frame.time *2 * Math.PI) / 2 + 0.001); // transition formula herer 
      scale = 1.2
      if(scale >= 1)
      darthVaderImg.scale({x:scale, y:scale});
    }, layer);

    var animZoomOut = new Konva.Animation(function (frame){
      // var scale = Math.sqrt((frame.time *2 * Math.PI) / 2 + 0.001); // transition formula herer 
      
      scale = 1;      
      
      darthVaderImg.scale({x:scale, y:scale});
    }, layer);


   // add node before tween 
    layer.add(darthVaderImg);

    var tween = new Konva.Tween({
      node: darthVaderImg,
      x: 280,
      easing: Konva.Easings['StrongEaseIn'],
      duration: 2,
    });

    darthVaderImg.tween = new Konva.Tween({
      node: darthVaderImg,
      // height:imageObjectsThumb[imgObjThumbIndex].height,
      // width:imageObjectsThumb[imgObjThumbIndex].width,
      scaleX: 1.5,
      scaleY: 1.5,
      easing: Konva.Easings.EaseIn,
      duration: 0.4,
    });

    // add cursor styling
    darthVaderImg.on('mouseover', function (evt) {
      document.body.style.cursor = 'pointer';
      simpleText.setText(imagesData[imgObjThumbIndex].project);
      darthVaderImg.image(imageObjectsThumb[imgObjThumbIndex])
      const crop = getCrop(
        imageObjectsThumb[imgObjThumbIndex],
        { width: darthVaderImg.width / 4, height: darthVaderImg.height / 4 }        
      );
      darthVaderImg.setAttrs(crop);

      
      evt.target.tween.play();
      console.log(imageObjectsThumb[imgObjThumbIndex-1])
    });

    darthVaderImg.on('mouseout', function (evt) {
      document.body.style.cursor = 'default';
      simpleText.setText("");
      // animZoomIn.stop();
      // animZoomOut.start();
      darthVaderImg.scale({x:1, y:1});
      darthVaderImg.image(imageObjPortrait);
      evt.target.tween.reverse();

    });

    darthVaderImg.on('pointerup', function () {
      document.location = imagesData[imgObjThumbIndex].href
    });

    // text rules
    var simpleText = new Konva.Text({
      x: stage.width() / 2,
      y: 15,
      text: '',
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: 'green',
    });

    // stage events 
    stage.on('pointermove', function (){
      var pointerPos = stage.getPointerPosition();
      var x = pointerPos.x - 190;
      var y = pointerPos.y - 40;
    
      changePositionLayer({x:x, y:y}, layer);
      stickTextToPointer({x:x, y:y}, simpleText);
    });

    // for(var i=0; i<total_images -1; i++){
    //   image_array[i].on('mouseover', function () {
    //     document.body.style.cursor = 'pointer';
    //     simpleText.setText("hello");
    //     anim.start();
    //   });
    //   image_array[i].on('mouseout', function () {
    //     document.body.style.cursor = 'default';
    //     simpleText.setText("");
    //     anim.stop();
    //     darthVaderImg.scale({x:1, y:1});
    //   });
      
    //   layer.add(image_array[i]);
    // }
    layer2.add(simpleText)
  }

  layer.add(rect1);
    stage.add(layer);
    stage.add(layer2)


  // image objects

  // main loop

  /*
    - logic to replace images img object, 
    - logic to spread images
   x - logic to maintain aspect ratio of the images, get height and width
    - logic to distance images from eachother.
    - logic to 

  */
  var imagesData = new Array();
  var imageObjectsPortrait = new Array();
  var imageObjectsThumb = new Array()

  function mainLoop(){
    // konva image objects
    imagesData = scrapeImages();
    randomRect();
    // loading logic here
    var tempImg = new Image();
    var tempImg2 = new Image();
    
    
    imagesData.forEach((img, index)=>{
      tempImg = new Image();
      tempImg2 = new Image()
      tempImg.src = img.portrait;
      tempImg2.src = img.thumbnail;
      if(tempImg2.width <= 0 ){
        tempImg2.width = 100;
        tempImg2.height = 100;
      }
      imageObjectsPortrait.push(tempImg);
      imageObjectsThumb.push(tempImg2);
      try{
        tempImg.onload = function (){
          drawImage(this, index);
        };
      }catch(e){
        console.log('Image not found', e)
      }
    });
    

  }

mainLoop();


function getCrop(image, size, clipPosition = 'center-middle') {
  const width = size.width;
  const height = size.height;
  const aspectRatio = width / height;

  let newWidth;
  let newHeight;

  const imageRatio = image.width / image.height;

  if (aspectRatio >= imageRatio) {
    newWidth = image.width;
    newHeight = image.width / aspectRatio;
  } else {
    newWidth = image.height * aspectRatio;
    newHeight = image.height;
  }

  let x = 0;
  let y = 0;
  if (clipPosition === 'left-top') {
    x = 0;
    y = 0;
  } else if (clipPosition === 'left-middle') {
    x = 0;
    y = (image.height - newHeight) / 2;
  } else if (clipPosition === 'left-bottom') {
    x = 0;
    y = image.height - newHeight;
  } else if (clipPosition === 'center-top') {
    x = (image.width - newWidth) / 2;
    y = 0;
  } else if (clipPosition === 'center-middle') {
    x = (image.width - newWidth) / 2;
    y = (image.height - newHeight) / 2;
  } else if (clipPosition === 'center-bottom') {
    x = (image.width - newWidth) / 2;
    y = image.height - newHeight;
  } else if (clipPosition === 'right-top') {
    x = image.width - newWidth;
    y = 0;
  } else if (clipPosition === 'right-middle') {
    x = image.width - newWidth;
    y = (image.height - newHeight) / 2;
  } else if (clipPosition === 'right-bottom') {
    x = image.width - newWidth;
    y = image.height - newHeight;
  } else if (clipPosition === 'scale') {
    x = 0;
    y = 0;
    newWidth = width;
    newHeight = height;
  } else {
    console.error(
      new Error('Unknown clip position property - ' + clipPosition)
    );
  }

  return {
    cropX: x,
    cropY: y,
    cropWidth: newWidth,
    cropHeight: newHeight,
  };
}