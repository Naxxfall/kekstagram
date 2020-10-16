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
var photoElements = [];
var pictureTemplate = document.querySelector("#picture").content.querySelector(".picture__link");
var fragment = document.createDocumentFragment();
var picturesContainer = document.querySelector(".pictures");
var bigPicture = document.querySelector(".big-picture");
var bigPictureCancel = bigPicture.querySelector(".big-picture__cancel");
var commentTemplate = bigPicture.querySelector(".social__comment");
var uploadFileInput = document.querySelector("#upload-file");
var imgUploadOverlay = document.querySelector(".img-upload__overlay");
var uploadFileCancel = imgUploadOverlay.querySelector("#upload-cancel");
var uploadSubmit = imgUploadOverlay.querySelector("#upload-submit");
var uploadForm = document.querySelector("#upload-select-image");
var scalePin = imgUploadOverlay.querySelector(".scale__pin");
var uploadHashtags = imgUploadOverlay.querySelector(".text__hashtags");
var scaleLevel = imgUploadOverlay.querySelector(".scale__level");
var scaleValue = imgUploadOverlay.querySelector(".scale__value");

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

function bigPictureCancelClickHandler(evt){
  if (evt.type === "click" || ((evt.type ===  "keydown") && (evt.code === "Escape"))){
    bigPictureCancel.removeEventListener("click", bigPictureCancelClickHandler);
    window.removeEventListener("keydown", bigPictureCancelClickHandler);
    bigPicture.classList.add("hidden");
    picturesContainer.addEventListener("click", pictureClickHandler);
    uploadFileInput.addEventListener("change", showUploadFileOverlay);
  }
}

function pictureClickHandler(evt){
  if (evt.target.classList.contains("picture__img"))
  {
    var pictureUrl = evt.target.src;
    function findPictureObject(url, pictures){
      for (var i = 0; i < pictures.length; i++){
        if (url.includes(pictures[i].url)){
          return pictures[i];
        }
      }
    }
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
    renderBigPicture(findPictureObject(pictureUrl, photoElements));
    bigPicture.querySelector(".social__comment-count").classList.add("visually-hidden");
    bigPicture.querySelector(".social__loadmore").classList.add("visually-hidden");
    bigPicture.classList.remove("hidden");
    picturesContainer.removeEventListener("click", pictureClickHandler);
    uploadFileInput.removeEventListener("change", showUploadFileOverlay);
    bigPictureCancel.addEventListener("click", bigPictureCancelClickHandler);
    window.addEventListener("keydown", bigPictureCancelClickHandler);
  }
}

function generateUrls(number){
  var urls = [];
  for (var i = 0; i < number; i++){
    urls[i] = "photos/" + (i+1).toString() + ".jpg";
  }
  return urls;
}

function showMiniatures() {
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
}

function scalePinMouseupHandler() {
  var left = scaleLevel.offsetWidth;
}

function verifyHashtags(hashtagsString){
 try {
   var normalString = hashtagsString.toLowerCase().trim();
   var hashtags = normalString.split(/\s+/);
   for (var i = 0; i < hashtags.length; i++){
     if (hashtags[i][0] !== '#') {
       throw new SyntaxError("Каждый хэш-тег должен начинаться с символа #");
     }
     if (hashtags[i].length < 2) {
       throw new SyntaxError("Хэш-тег не может состоять только из одного символа");
     }
     if (/.#/.test(hashtags[i])) {
       throw new SyntaxError("Хэш-теги должны быть разделены пробелами");
     }
     if (hashtags[i].length > 20) {
       throw new SyntaxError("Максимальная длина одного хэш-тега не должна превышать 20 символов");
     }
     if (i > 4){
       throw new SyntaxError("Укажите не более пяти хэш-тегов");
     }
     if (hashtags.includes(hashtags[i], i + 1)){
       throw new SyntaxError("Хэш-теги не должны повторяться");
     }
   }
   return hashtags;
 } catch (err) {
   throw err;
 }
}

function uploadSubmitClickHandler(evt) {
  uploadHashtags.setCustomValidity("");
  if (uploadHashtags.value !== "") {
    try{
      verifyHashtags(uploadHashtags.value);
      uploadForm.submit();
    }
    catch (err) {
      uploadHashtags.setCustomValidity(err.message.toString());
    }
  }
}

function showUploadFileOverlay() {
  picturesContainer.removeEventListener("click", pictureClickHandler);
  uploadFileInput.removeEventListener("change", showUploadFileOverlay);
  imgUploadOverlay.classList.remove("hidden");
  uploadFileCancel.addEventListener("click", hideUploadFileOverlay);
  uploadSubmit.addEventListener("click", uploadSubmitClickHandler);
}

function hideUploadFileOverlay(){
  imgUploadOverlay.classList.add("hidden");
  uploadFileInput.value = null;
  uploadSubmit.removeEventListener("click", uploadSubmitClickHandler);
  uploadFileInput.addEventListener("change", showUploadFileOverlay);
  picturesContainer.addEventListener("click", pictureClickHandler);
}

var urls = generateUrls(25);
showMiniatures();
picturesContainer.addEventListener("click", pictureClickHandler);
uploadFileInput.addEventListener("change", showUploadFileOverlay);
