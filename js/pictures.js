'use strict';
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
var urls = [];
var photoElements = [];
var pictureTemplate = document.querySelector("#picture").content.querySelector(".picture__link");
var fragment = document.createDocumentFragment();
var picturesContainer = document.querySelector(".pictures");
var bigPicture = document.querySelector(".big-picture");
var commentTemplate = document.querySelector(".social__comment");

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

function renderPicture(picture) {
  var pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector(".picture__img").src = picture.url;
  pictureElement.querySelector(".picture__stat--likes").textContent = picture.likes.toString();
  pictureElement.querySelector(".picture__stat--comments").textContent = picture.comments.length.toString();
  return pictureElement;
}

for (var i = 0; i < 25; i++){
  urls[i] = "photos/" + (i+1).toString() + ".jpg";
}
for (var i = 0; i < 25; i++){
  photoElements[i] = {
    url: urls.splice(Math.floor(Math.random() * urls.length), 1)[0],
    likes: Math.round(Math.random() * 185.0) + 15,
    comments: generateComments(commentsList),
    description: generateRandom(descriptions)
  };
  fragment.appendChild(renderPicture(photoElements[i]));
}
picturesContainer.appendChild(fragment);
bigPicture.classList.remove("hidden");
var removeComments = function(){
  while (bigPicture.querySelector(".social__comments").firstChild){
    bigPicture.querySelector(".social__comments").removeChild(bigPicture.querySelector(".social__comments").firstChild);
  }
}
removeComments();
var renderBigPicture = function(picture) {
  bigPicture.querySelector(".big-picture__img img").src = picture.url;
  bigPicture.querySelector(".big-picture__img img").alt = "";
  bigPicture.querySelector(".social__caption").textContent = picture.description;
  bigPicture.querySelector(".likes-count").textContent = picture.likes.toString();
  bigPicture.querySelector(".comments-count").textContent = picture.comments.length.toString();
  var renderComment = function (comment){
    var commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector(".social__picture").src = "img/avatar-" + Math.ceil(Math.random() * 6).toString() + ".svg";
    commentElement.querySelector(".social__picture").alt = "Аватар комментатора фотографии";
    commentElement.querySelector(".social__picture").width = "35";
    commentElement.querySelector(".social__picture").height = "35";
    commentElement.querySelector(".social__text").textContent = comment;
    return commentElement;
  }
  for (var i = 0; i < picture.comments.length; i++){
    bigPicture.querySelector(".social__comments").appendChild(renderComment(picture.comments[i]));
  }
}
renderBigPicture(photoElements[0]);
bigPicture.querySelector(".social__comment-count").classList.add("visually-hidden");
bigPicture.querySelector(".social__loadmore").classList.add("visually-hidden");
