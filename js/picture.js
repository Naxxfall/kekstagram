'use strict';

(function(){
  window.picture = {};
  picture.picturesContainer = document.querySelector(".pictures");
  window.photoElements = [];
  var pictureTemplate = document.querySelector("#picture").content.querySelector(".picture__link");
  var fragment = document.createDocumentFragment();
  function renderPicture(picture) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector(".picture__img").src = picture.url;
    pictureElement.querySelector(".picture__stat--likes").textContent = picture.likes.toString();
    pictureElement.querySelector(".picture__stat--comments").textContent = picture.comments.length.toString();
    return pictureElement;
  }
  function showMiniatures() {
    for (var i = 0; i < window.photoElements.length; i++){
      fragment.appendChild(renderPicture(window.photoElements[i]));
    }
    picture.picturesContainer.appendChild(fragment);
  }
  function loadSuccess(elements){
    window.photoElements = elements;
    showMiniatures();
  }
  backend.load(loadSuccess, backend.showError);
  picture.pictureClickHandler = function(evt){
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
      preview.renderBigPicture(findPictureObject(pictureUrl, window.photoElements));
      preview.bigPicture.classList.remove("hidden");
      picture.picturesContainer.removeEventListener("click", picture.pictureClickHandler);
      uploadFile.uploadFileInput.removeEventListener("change", uploadFile.showUploadFileOverlay);
      preview.bigPictureCancel.addEventListener("click", preview.bigPictureCancelClickHandler);
      window.addEventListener("keydown", preview.bigPictureCancelClickHandler);
    }
  }
})();
