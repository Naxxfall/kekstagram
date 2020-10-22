'use strict';

(function(){
  var commentsList = ["Всё отлично!",
    "В целом всё неплохо. Но не всё.",
    "Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.",
    "Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.",
    "Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.",
    "Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!"];

  var descriptions = ["Тестим новую камеру!",
    "Затусили с друзьями на море",
    "Как же круто тут кормят",
    "Отдыхаем...",
    "Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......",
    "Вот это тачка!"];

  function generateRandom(arrayOfElements){
    return arrayOfElements[Math.floor(Math.random() * arrayOfElements.length)];
  }

  function generateComments(commentsList){
    var comments = [generateRandom(commentsList)];
    if (Math.random() < 0.5){
      do {
        comments[1] = generateRandom(commentsList);
      } while (comments[1] === comments[0]);
    }
    return comments;
  }

  function generatePhotoElements(){
    window.photoElements = [];
    function generateUrls(number){
      var urls = [];
      for (var i = 0; i < number; i++){
        urls[i] = "photos/" + (i+1).toString() + ".jpg";
      }
      return urls;
    }
    var urls = generateUrls(25);
    for (var i = 0; i < 25; i++) {
      photoElements[i] = {
        url: urls.splice(Math.floor(Math.random() * urls.length), 1)[0],
        likes: Math.round(Math.random() * 185.0) + 15,
        comments: generateComments(commentsList),
        description: generateRandom(descriptions)
      };
    }
  }
  generatePhotoElements();
})();
