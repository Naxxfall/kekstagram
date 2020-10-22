'use strict';

(function(){
  window.preview = {};
  preview.bigPicture = document.querySelector(".big-picture");
  preview.bigPictureCancel = preview.bigPicture.querySelector(".big-picture__cancel");
  preview.renderBigPicture = function(picture) {
    var commentTemplate = preview.bigPicture.querySelector(".social__comment");
    preview.bigPicture.querySelector(".big-picture__img img").src = picture.url;
    preview.bigPicture.querySelector(".big-picture__img img").alt = "";
    preview.bigPicture.querySelector(".social__caption").textContent = picture.description;
    preview.bigPicture.querySelector(".likes-count").textContent = picture.likes.toString();
    preview.bigPicture.querySelector(".comments-count").textContent = picture.comments.length.toString();
    function removeComments(){
      while (preview.bigPicture.querySelector(".social__comments").firstChild){
        preview.bigPicture.querySelector(".social__comments").removeChild(preview.bigPicture.querySelector(".social__comments").firstChild);
      }
    }
    removeComments();
    function renderComment (comment){
      var commentElement = commentTemplate.cloneNode(true);
      commentElement.querySelector(".social__picture").src = "img/avatar-" + Math.ceil(Math.random() * 6).toString() + ".svg";
      commentElement.querySelector(".social__picture").alt = "Аватар комментатора фотографии";
      commentElement.querySelector(".social__picture").width = "35";
      commentElement.querySelector(".social__picture").height = "35";
      commentElement.querySelector(".social__text").textContent = comment;
      return commentElement;
    }
    for (var i = 0; i < picture.comments.length; i++){
      preview.bigPicture.querySelector(".social__comments").appendChild(renderComment(picture.comments[i]));
    }
    preview.bigPicture.querySelector(".social__comment-count").classList.add("visually-hidden");
    preview.bigPicture.querySelector(".social__loadmore").classList.add("visually-hidden");
  }

  preview.bigPictureCancelClickHandler = function(evt){
    if (evt.type === "click" || ((evt.type ===  "keydown") && (evt.code === "Escape"))){
      preview.bigPictureCancel.removeEventListener("click", preview.bigPictureCancelClickHandler);
      window.removeEventListener("keydown", preview.bigPictureCancelClickHandler);
      preview.bigPicture.classList.add("hidden");
      picture.picturesContainer.addEventListener("click", picture.pictureClickHandler);
      uploadFile.uploadFileInput.addEventListener("change", uploadFile.showUploadFileOverlay);
    }
  }
})();

