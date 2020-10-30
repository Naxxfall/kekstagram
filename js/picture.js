'use strict';

(function(){
  window.picture = {};
  picture.picturesContainer = document.querySelector(".pictures");
  window.photoElements = [];
  picture.imageFiltersForm = document.querySelector(".img-filters__form");
  picture.currentFilter = picture.imageFiltersForm.querySelector(".img-filters__button--active");
  var pictureTemplate = document.querySelector("#picture").content.querySelector(".picture__link");
  var fragment = document.createDocumentFragment();
  function renderPicture(picture) {
    var pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector(".picture__img").src = picture.url;
    pictureElement.querySelector(".picture__stat--likes").textContent = picture.likes.toString();
    pictureElement.querySelector(".picture__stat--comments").textContent = picture.comments.length.toString();
    return pictureElement;
  }
  function showMiniatures(miniatures) {
    miniatures.forEach(function (miniature) {
      fragment.appendChild(renderPicture(miniature));
    })
    picture.picturesContainer.appendChild(fragment);
  }

  function loadSuccess(elements){
    window.photoElements = elements;
    showMiniatures(window.photoElements);
    document.querySelector(".img-filters").classList.remove("img-filters--inactive");
    picture.picturesContainer.addEventListener("click", picture.pictureClickHandler);
    picture.imageFiltersForm.addEventListener("click", picture.imageFiltersFormClickHandler);
  }

  backend.load(loadSuccess, backend.showError);

  function removeMiniatures(){
    var miniatures = picture.picturesContainer.querySelectorAll(".picture__link");
    miniatures.forEach(function (miniature){
      miniature.remove();
    })
  }
  picture.imageFiltersFormClickHandler = function(evt){
    if ((evt.target.classList.contains("img-filters__button")) && (evt.target !== picture.currentFilter)){
      picture.currentFilter.classList.remove("img-filters__button--active");
      picture.currentFilter = evt.target;
      picture.currentFilter.classList.add("img-filters__button--active");
      switch (picture.currentFilter.id){
        case "filter-popular":{
          removeMiniatures();
          showMiniatures(window.photoElements);
          return;
        }
        case "filter-new":{
          removeMiniatures();
          const NEW_PICTURES_NUMBER = 10;
          var newPictures = [];
          var temp = window.photoElements.slice();
          for (var i = 0; i < NEW_PICTURES_NUMBER; i++){
            newPictures.push(temp.splice(Math.floor(Math.random() * temp.length), 1)[0]);
          }
          showMiniatures(newPictures);
          return;
        }
        case "filter-discussed":{
          removeMiniatures();
          var discussedPictures = window.photoElements.slice().sort(function (value1, value2) {
            if (value1.comments.length > value2.comments.length) return -1;
            if (value1.comments.length < value2.comments.length) return 1;
            return 0;
          })
          showMiniatures(discussedPictures);
          return;
        }
        default: return;
      }
    }
  }
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
      picture.imageFiltersForm.removeEventListener("click", picture.imageFiltersFormClickHandler);
      uploadFile.uploadFileInput.removeEventListener("change", uploadFile.showUploadFileOverlay);
      preview.bigPictureCancel.addEventListener("click", preview.bigPictureCancelClickHandler);
      window.addEventListener("keydown", preview.bigPictureCancelClickHandler);
    }
  }
})();
