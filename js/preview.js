'use strict';

(function(){
  window.preview = {};
  preview.bigPicture = document.querySelector(".big-picture");
  preview.bigPictureCancel = preview.bigPicture.querySelector(".big-picture__cancel");
  var socialLoadmore = preview.bigPicture.querySelector(".social__loadmore");
  var allComments = [];
  var showedComments = [];
  var commentTemplate = preview.bigPicture.querySelector(".social__comment");
  socialLoadmore.classList.add("hidden");

  function removeComments(){
    while (preview.bigPicture.querySelector(".social__comments").firstChild){
      preview.bigPicture.querySelector(".social__comments").removeChild(preview.bigPicture.querySelector(".social__comments").firstChild);
    }
  }

  function renderComment (comment){
    var commentElement = commentTemplate.cloneNode(true);
    commentElement.querySelector(".social__picture").src = comment.avatar;
    commentElement.querySelector(".social__picture").alt = comment.name;
    commentElement.querySelector(".social__picture").width = "35";
    commentElement.querySelector(".social__picture").height = "35";
    commentElement.querySelector(".social__text").textContent = comment.message;
    return commentElement;
  }

  function showComments() {
    var temp = allComments.slice(showedComments.length, showedComments.length + 5);
    temp.forEach(function (item) {
      preview.bigPicture.querySelector(".social__comments").appendChild(renderComment(item));
      showedComments.push(item);
    });
    if (showedComments.length === 0){
      preview.bigPicture.querySelector(".social__comment-count").classList.add("hidden");
    }
    preview.bigPicture.querySelector(".comments-showed").textContent = showedComments.length.toString();
  }

  function socialLoadmoreClickHandler(){
    showComments();
    if (showedComments.length >= allComments.length){
      socialLoadmore.removeEventListener("click", socialLoadmoreClickHandler);
      socialLoadmore.classList.add("hidden");
    }
  }

  preview.renderBigPicture = function(picture) {
    allComments = picture.comments;
    preview.bigPicture.querySelector(".big-picture__img img").src = picture.url;
    preview.bigPicture.querySelector(".big-picture__img img").alt = "";
    preview.bigPicture.querySelector(".social__caption").textContent = picture.description;
    preview.bigPicture.querySelector(".likes-count").textContent = picture.likes.toString();
    preview.bigPicture.querySelector(".comments-count").textContent = picture.comments.length.toString();
    removeComments();
    /*function renderRandomComment (comment){
      var commentElement = commentTemplate.cloneNode(true);
      commentElement.querySelector(".social__picture").src = "img/avatar-" + Math.ceil(Math.random() * 6).toString() + ".svg";
      commentElement.querySelector(".social__picture").alt = "Аватар комментатора фотографии";
      commentElement.querySelector(".social__picture").width = "35";
      commentElement.querySelector(".social__picture").height = "35";
      commentElement.querySelector(".social__text").textContent = comment;
      return commentElement;
    }*/
    showComments();
    if (showedComments.length < allComments.length){
      socialLoadmore.classList.remove("hidden");
      socialLoadmore.addEventListener("click", socialLoadmoreClickHandler);
    }
    //preview.bigPicture.querySelector(".social__comment-count").classList.add("visually-hidden");

  }

  preview.bigPictureCancelClickHandler = function(evt){
    if (evt.type === "click" || ((evt.type ===  "keydown") && (evt.code === "Escape"))){
      allComments = [];
      showedComments = [];
      preview.bigPictureCancel.removeEventListener("click", preview.bigPictureCancelClickHandler);
      window.removeEventListener("keydown", preview.bigPictureCancelClickHandler);
      preview.bigPicture.classList.add("hidden");
      picture.picturesContainer.addEventListener("click", picture.pictureClickHandler);
      picture.imageFiltersForm.addEventListener("click", picture.imageFiltersFormClickHandler);
      uploadFile.uploadFileInput.addEventListener("change", uploadFile.showUploadFileOverlay);
    }
  }
})();

