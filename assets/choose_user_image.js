window.onload = function () {

  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = document.querySelector('.img-container');
  var image = container.getElementsByTagName('img').item(0);
  var download = document.getElementById('download');
  var actions = document.getElementById('actions');
  var dataX = document.getElementById('dataX');
  var dataY = document.getElementById('dataY');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');
  var dataRotate = document.getElementById('dataRotate');
  var dataScaleX = document.getElementById('dataScaleX');
  var dataScaleY = document.getElementById('dataScaleY');
  var options = {
    crop: function (e) {
      var data = e.detail;

      dataX.value = Math.round(data.x);
      dataY.value = Math.round(data.y);
      dataHeight.value = Math.round(data.height);
      dataWidth.value = Math.round(data.width);
      dataRotate.value = typeof data.rotate !== 'undefined' ? data.rotate : '';
      dataScaleX.value = typeof data.scaleX !== 'undefined' ? data.scaleX : '';
      dataScaleY.value = typeof data.scaleY !== 'undefined' ? data.scaleY : '';
    },
    zoomOnWheel: false
  };
  var cropper = new Cropper(image, options);
  var originalImageURL = image.src;
  var uploadedImageURL;

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Buttons
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  // Methods
  actions.querySelector('.docs-buttons').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropped;
    var result;
    var input;
    var data;

    if (!cropper) {
      return;
    }

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }
      target = target.parentNode;
    }

    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }

    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option') || undefined,
      secondOption: target.getAttribute('data-second-option') || undefined
    };

    cropped = cropper.cropped;

    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
          } catch (e) {
            console.log(e.message);
          }
        }
      }

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            cropper.clear();
          }
          break;

        case 'save':
          var dataURL = cropper.getCroppedCanvas({
            // width: 180,
            // height: 300,
            fillColor: '#fff',
            imageSmoothingQuality: 'high',
          }).toDataURL();
          try {
            sessionStorage.setItem("sample",dataURL);
          } catch (err) {
            alert("The image you have chosen is too large to fit in memory.  Either choose a smaller or less detailed image, or zoom in to a smaller area.");
            break;
          }

          window.location.href= "choose_branch.html";
          break;
      }

      result = cropper[data.method](data.option, data.secondOption);

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            cropper.crop();
          }
          break;

        case 'scaleX':
        case 'scaleY':
          target.setAttribute('data-option', -data.option);
          break;

        case 'destroy':
          cropper = null;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            image.src = originalImageURL;
          }
          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  };

  // Import image
  var inputImage = document.getElementById('inputImage');
  inputImage.onchange = function () {
    var files = this.files;
    var file;

    if (cropper && files && files.length) {
      file = files[0];

      if (/^image\/\w+/.test(file.type)) {
        if (uploadedImageURL) {
          URL.revokeObjectURL(uploadedImageURL);
        }

        image.src = uploadedImageURL = URL.createObjectURL(file);
        cropper.destroy();
        cropper = new Cropper(image, options);
        inputImage.value = null;
      } else {
        window.alert('Please choose an image file.');
      }
    }
  };

  function chooseImage(event) {
    // The target source is the thumbnail, but we want the non-thumbnail to crop
    var thumbnailSrc = event.target.src;
    image.src = thumbnailSrc.replace(/-thumbnail\.png/, ".png");

    cropper.destroy();
    cropper = new Cropper(image, options);

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    var inMemoryImage = new Image();
    inMemoryImage.src = event.target.src;
    inMemoryImage.onload = function() {
      console.log("Setting canvas height to "+inMemoryImage.naturalHeight /* +200 */);
      canvas.width = inMemoryImage.naturalWidth;
      canvas.height = inMemoryImage.naturalHeight/* + 200 */;
      ctx.drawImage(inMemoryImage, 0, 0);
      var dataURL = canvas.toDataURL();
      sessionStorage.setItem("sample",dataURL);
    };
  }

  for (var sampleImage of document.querySelectorAll('.chooseYourWatermarkButton figure img')) {
    sampleImage.onclick = chooseImage;
  }
  this.document.getElementById("noImage").onclick = function() {
    sessionStorage.removeItem("sample");
    window.location.href= "choose_branch.html";
  }
};