'use strict';

(function() {
  window.uploadFile = {};
  uploadFile.uploadFileInput = document.querySelector("#upload-file");
  var imgUploadOverlay = document.querySelector(".img-upload__overlay");
  var uploadFileCancel = imgUploadOverlay.querySelector("#upload-cancel");
  var uploadSubmit = imgUploadOverlay.querySelector("#upload-submit");
  var uploadForm = document.querySelector("#upload-select-image");
  var scalePin = imgUploadOverlay.querySelector(".scale__pin");
  var scaleLevel = imgUploadOverlay.querySelector(".scale__level");
  var scaleLine = imgUploadOverlay.querySelector(".scale__line");
  var scaleValue = imgUploadOverlay.querySelector(".scale__value");
  var imgUploadEffects = imgUploadOverlay.querySelector(".img-upload__effects");
  var imgUploadPreview = imgUploadOverlay.querySelector(".img-upload__preview");
  var imgUploadScale = imgUploadOverlay.querySelector(".img-upload__scale");
  var uploadHashtags = imgUploadOverlay.querySelector(".text__hashtags");

  function showFilePreview() {
    const FILE_TYPES = ["png", "jpeg", "jpg", "gif"];
    var uploadedFile = uploadFile.uploadFileInput.files[0];
    var fileName = uploadedFile.name.toLowerCase();
    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
    if (matches) {
      var reader = new FileReader();
      reader.addEventListener("load", function () {
        imgUploadPreview.querySelector("img").src = reader.result.toString();
      });
      reader.readAsDataURL(uploadedFile);
    }
  }

  uploadFile.showUploadFileOverlay = function() {
    picture.picturesContainer.removeEventListener("click", picture.pictureClickHandler);
    picture.imageFiltersForm.removeEventListener("click", picture.imageFiltersFormClickHandler);
    uploadFile.uploadFileInput.removeEventListener("change", uploadFile.showUploadFileOverlay);
    imgUploadOverlay.classList.remove("hidden");
    showFilePreview();
    uploadFileCancel.addEventListener("click", hideUploadFileOverlay);
    uploadSubmit.addEventListener("click", uploadSubmitClickHandler);
    uploadFile.scaleLineParams = scaleLine.getBoundingClientRect();
    scalePin.addEventListener("mousedown", scalePinMousedownHandler);
    imgUploadEffects.addEventListener("change", effectChangeHandler);
    imgUploadEffects.querySelector('input[value="none"]').click();
    scaleValue.addEventListener("change", scaleValueChangeHandler);
  }

  function hideUploadFileOverlay() {
    imgUploadOverlay.classList.add("hidden");
    uploadForm.reset();
    uploadFile.currentEffect = "none";
    scaleValue.changeValue(100);
    uploadSubmit.removeEventListener("click", uploadSubmitClickHandler);
    scalePin.removeEventListener("mousedown", scalePinMousedownHandler);
    imgUploadEffects.removeEventListener("change", effectChangeHandler);
    uploadFile.uploadFileInput.addEventListener("change", uploadFile.showUploadFileOverlay);
    picture.imageFiltersForm.addEventListener("click", picture.imageFiltersFormClickHandler);
    picture.picturesContainer.addEventListener("click", picture.pictureClickHandler);
    scaleValue.removeEventListener("change", scaleValueChangeHandler);
  }

  scaleValue.changeValue = function(value){
    if (this.value !== value){
      this.value = value;
      return this.dispatchEvent(new Event("change"));
    }
  }

  function scaleValueChangeHandler(evt){
    evt.preventDefault();;
    applyEffect(uploadFile.currentEffect, evt.target.value);
  }

  function scalePinMousedownHandler(evt) {
    evt.preventDefault();
    var start = evt.clientX;
    const MAX_WIDTH = uploadFile.scaleLineParams.width;
    const VALUE_RATE = 100.0 / MAX_WIDTH;
    function scalePinMousemoveHandler(moveEvt) {
      function calculateValue(offset){
        return Math.round(VALUE_RATE * offset);
      }
      moveEvt.preventDefault();
      if (scalePin.offsetLeft >= 0 && scalePin.offsetLeft <= MAX_WIDTH)
      {
        var shift = start - moveEvt.clientX;
        scalePin.style.left = (scalePin.offsetLeft - shift) + 'px';
        if (scalePin.offsetLeft <= (scalePin.offsetWidth / 2)){
          scalePin.style.left = '0';
          scaleLevel.style.width = '0px';
          scaleValue.changeValue(0);
          start = uploadFile.scaleLineParams.left;
          return;
        }
        if (scalePin.offsetLeft >= MAX_WIDTH - (scalePin.offsetWidth / 2))
        {
          scalePin.style.left = MAX_WIDTH + 'px';
          scaleLevel.style.width = MAX_WIDTH + 'px';
          scaleValue.changeValue(100);
          start = uploadFile.scaleLineParams.right;
          return;
        }
        scaleLevel.style.width = scalePin.offsetLeft + 'px';
        start = moveEvt.clientX;
        scaleValue.changeValue(calculateValue(scaleLevel.offsetWidth));
      }
    }
    function scalePinMouseupHandler(){
      document.removeEventListener("mousemove", scalePinMousemoveHandler);
    }
    document.addEventListener("mousemove", scalePinMousemoveHandler);
    document.addEventListener("mouseup", scalePinMouseupHandler);
  }

  function applyEffect(effect, value) {
    if ((value >= 0) && (value <= 100 )){
      switch (effect) {
        case "none":{
          imgUploadPreview.style.filter = "none";
          return;
        }
        case "chrome":{
          imgUploadPreview.style.filter = "grayscale(" + (value / 100.0) + ")";
          return;
        }
        case "sepia":{
          imgUploadPreview.style.filter = "sepia(" + (value / 100.0) + ")";
          return;
        }
        case "marvin":{
          imgUploadPreview.style.filter = "invert(" + value + "%)";
          return;
        }
        case "phobos":{
          imgUploadPreview.style.filter = "blur(" + (3 / 100.0 * value) + "px)";
          return;
        }
        case "heat": {
          imgUploadPreview.style.filter = "brightness(" + (1 + (2 / 100.0 * value)) + ")";
          return;
        }
        default: return;
      }
    }
  }

  function effectChangeHandler(evt){
    uploadFile.currentEffect = evt.target.value;
    if (uploadFile.currentEffect === "none"){
      scaleValue.changeValue(100);
      imgUploadScale.classList.add("hidden");
      return;
    }
    imgUploadScale.classList.remove("hidden");
    scalePin.style.left = uploadFile.scaleLineParams.width + 'px';
    scaleLevel.style.width = uploadFile.scaleLineParams.width + 'px';
    scaleValue.changeValue(100);
  }

  function verifyHashtags(hashtagsString) {
    try {
      var normalString = hashtagsString.toLowerCase().trim();
      var hashtags = normalString.split(/\s+/);
      for (var i = 0; i < hashtags.length; i++) {
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
        if (i > 4) {
          throw new SyntaxError("Укажите не более пяти хэш-тегов");
        }
        if (hashtags.includes(hashtags[i], i + 1)) {
          throw new SyntaxError("Хэш-теги не должны повторяться");
        }
      }
      return hashtags;
    } catch (err) {
      throw err;
    }
  }
  window.uploadSubmitClickHandler = function(evt) {
    evt.preventDefault();
    uploadHashtags.setCustomValidity("");
    if (uploadHashtags.value !== "") {
      try {
        verifyHashtags(uploadHashtags.value);
      } catch (err) {
        uploadHashtags.setCustomValidity(err.message.toString());
        return;
      }
    }
    backend.save(new FormData(uploadForm), hideUploadFileOverlay, backend.showError);
  }
})();
