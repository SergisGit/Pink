(function () {
  'use strict';

  var IE = window.navigator.userAgent;
  if (IE.indexOf("MSIE ") != -1 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.setAttribute('src', 'js/picturefill.min.js');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('async', 'false');
    head.appendChild(script);
  }

  var reviewsSlider = document.querySelector('.reviews__slider'),
    priceSlider = document.querySelector('.price__slider'),
    i;

  //-----Слайдер-----
  var transValue;

  function translateCalculation(toggles, sliderList, transValue) {
    var trV;
    for (i = 0; i < toggles.length; i += 1) {
      if (toggles[i].classList.contains('toggle-index')) {
        trV = transValue * i;
        sliderList.style.transform = 'translateX(' + trV + '%)';
      }
    }
  }

  function toggleSlide(togglesContainer, toggles, sliderList, transValue) {
    togglesContainer.addEventListener('click', function (event) {
      var clickedElement = event.target;
      if (clickedElement.classList.contains('slider__toggle')) {
        event.preventDefault();
        if (clickedElement.classList.contains('toggle-index')) {
          return (false);
        } else {
          for (i = 0; i < toggles.length; i += 1) {
            toggles[i].classList.remove('toggle-index');
          }
          clickedElement.classList.add('toggle-index');
          translateCalculation(toggles, sliderList, transValue);
        }
      }
    });
  }

  function swipeRight(toggles, sliderList, transValue) {
    for (i = 0; i < toggles.length; i += 1) {
      if (toggles[i].classList.contains('toggle-index')) {
        if (i == toggles.length - 1) {
          toggles[i].classList.remove('toggle-index');
          toggles[0].classList.add('toggle-index');
          translateCalculation(toggles, sliderList, transValue);
          break;
        } else {
          toggles[i].classList.remove('toggle-index');
          toggles[i + 1].classList.add('toggle-index');
          translateCalculation(toggles, sliderList, transValue);
          break;
        }
      }
    }
  }

  function swipeLeft(toggles, sliderList, transValue) {
    for (var i = 0; i < toggles.length; i += 1) {
      if (toggles[i].classList.contains('toggle-index')) {
        if (i == 0) {
          toggles[i].classList.remove('toggle-index');
          toggles[toggles.length - 1].classList.add('toggle-index');
          translateCalculation(toggles, sliderList, transValue);
          break;
        } else {
          toggles[i].classList.remove('toggle-index');
          toggles[i - 1].classList.add('toggle-index');
          translateCalculation(toggles, sliderList, transValue);
          break;
        }
      }
    }
  }

  function swipeSlide(toggles, sliderList, transValue) {
    sliderList.addEventListener('touchstart', handleTouchStart, false);
    sliderList.addEventListener('touchmove', handleTouchMove, false);
    var xDown = null;
    var yDown = null;
    function handleTouchStart(evt) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
    }
    function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
      if (Math.abs(xDiff) + Math.abs(yDiff) > 150) { //to deal with to short swipes

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
          if (xDiff > 0) {/* left swipe */
            swipeRight(toggles, sliderList, transValue);
          } else {/* right swipe */
            swipeLeft(toggles, sliderList, transValue);
          }
        }
        /* reset values */
        xDown = null;
        yDown = null;
      }
    }
  }

  function slider(sliderContainer, transValue) {
    var sliderList = sliderContainer.querySelector('.slider__list'),
      togglesContainer = sliderContainer.querySelector('.slider__toggles'),
      toggles = togglesContainer.querySelectorAll('.slider__toggle'),
      sliderPrev = sliderContainer.querySelector('.slider__prev'),
      sliderNext = sliderContainer.querySelector('.slider__next');

    toggleSlide(togglesContainer, toggles, sliderList, transValue);
    swipeSlide(toggles, sliderList, transValue);

    if (sliderPrev && sliderNext) {
      sliderNext.addEventListener('click', function () {
        swipeRight(toggles, sliderList, transValue);
      });
      sliderPrev.addEventListener('click', function () {
        swipeLeft(toggles, sliderList, transValue);
      });
    }
  }

  if (reviewsSlider) {
    transValue = -100;
    slider(reviewsSlider, transValue);
  }

  if (priceSlider) {
    transValue = -90;
    slider(priceSlider, transValue);
  }

  // Google Map

  function gMap() {
    var markLatLng = new google.maps.LatLng(59.93632276, 30.32106467);
    var mapOptions = {
      zoom: 16,
      center: markLatLng,
      disableDefaultUI: true,
      draggable: true, // false - запрет перемещения. По умолчанию true.
      scrollwheel: false, // скролл отключен.
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      }
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Some circle marker properties
    new google.maps.Marker({
      position: markLatLng,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 13,
        fillOpacity: 100,
        fillColor: '#d22856',
        strokeWeight: 10,
        strokeColor: 'white'
      },
      title: 'HTML Academy'
    });

    google.maps.event.addDomListener(window, 'resize', function () {
      map.setCenter(markLatLng);
    });
  }

  var mapContainer = document.getElementById('map');
  if (mapContainer) {
    google.maps.event.addDomListener(window, 'load', gMap);
  }


  // Image Filters
  var rangesBox = document.querySelector('.ranges'),
    rangeMin,
    rangeMax,
    rangeStart;

  function createRange(filter, rangeMin, rangeMax, rangeStart) {

    var range = rangesBox.querySelector('.filter-range_' + filter),
      inputRange = rangesBox.querySelector('#input-' + filter),
      filteredImage = document.querySelector('#filtered-img'),
      maskImage = document.querySelector('#image-mask'),
      rangeValue;

    noUiSlider.create(range, {
      start: rangeStart,
      connect: true,
      step: 1,
      range: {
        'min': rangeMin,
        'max': rangeMax
      },
      format: wNumb({
        decimals: 0
      })
    });

    function maskStyle() {
      var filteredImageWidth = filteredImage.clientWidth,
        filteredImageHeight = filteredImage.clientHeight,
        cropWidth = (filteredImageWidth * rangeValue / 100) / 2,
        cropHeight = (filteredImageHeight * rangeValue / 100) / 2;
      maskImage.style.borderLeftWidth = cropWidth + "px";
      maskImage.style.borderRightWidth = cropWidth + "px";
      maskImage.style.borderTopWidth = cropHeight + "px";
      maskImage.style.borderBottomWidth = cropHeight + "px";
    }

    if (filteredImage && (filter == "crop")) {
      window.addEventListener('resize', function () {
        rangeValue = range.noUiSlider.get();
        maskStyle();
      });
    }

    range.noUiSlider.on('update', function (values, handle) {
      rangeValue = values[handle];
      inputRange.value = rangeValue;

      if (filteredImage) {
        if (filter == "crop") {
          maskStyle();
        } else {
          var newFilter = filter + "(" + rangeValue/100 + ")";
          var styleFilter = getComputedStyle(filteredImage).filter;
          var pattern = new RegExp(filter+"[\(][0-9]+\.?[0-9]*[\)]");

          if (styleFilter === "none") {
            filteredImage.style.filter = newFilter;
          } else {
            if (pattern.test(styleFilter)) {
              styleFilter = styleFilter.replace(pattern, newFilter);
              filteredImage.style.filter = styleFilter;
            } else {
              filteredImage.style.filter = styleFilter + " " + newFilter;
            }
          }
        }
      }
    });
  }

  function changeRange(event) {
    var tool = event.target;
    if (tool.classList.contains('post-image__tool')) {
      for (i = 0; i < tools.length; i += 1) {
        tools[i].classList.remove('tool-index');
        if (tools[i].firstElementChild) {
          tools[i].firstElementChild.style.fill = "rgba(40, 54, 69, 0.3)";
        }
      }
      if (tool.firstElementChild) {
        tool.firstElementChild.style.fill = "#d22856";
      }
      tool.classList.add('tool-index');
      for (i = 0; i < tools.length; i += 1) {
        if (tools[i].classList.contains('tool-index')) {
          rangeWrappers[i].style.display = "block";
        } else {
          rangeWrappers[i].style.display = "none";
        }
      }
    }
  }

  function changeRangeIfMobile() {
    if (window.matchMedia("(max-width: 699px)").matches) {
      for (i = 0; i < tools.length; i += 1) {
        if (tools[i].firstElementChild) {
          tools[i].firstElementChild.style.pointerEvents = "none";
          if (i == 0) {
            tools[i].firstElementChild.style.fill = "#d22856";
          } else {
            tools[i].firstElementChild.style.fill = "rgba(40, 54, 69, 0.3)";
          }
        }
        if (i == 0) {
          rangeWrappers[i].style.display = "block";
        } else {
          rangeWrappers[i].style.display = "none";
        }
      }
      imageToolsContainer.addEventListener('click', changeRange);
    } else {
      imageToolsContainer.removeEventListener('click', changeRange);
      for (i = 0; i < tools.length; i += 1) {
        if (tools[i].firstElementChild) {
          tools[i].firstElementChild.style.fill = "#d22856";
        }
        rangeWrappers[i].style.display = "block";
      }
    }
  }

  if (rangesBox) {

    var rangeWrappers = rangesBox.querySelectorAll('.range-wrapper'),
      ranges = rangesBox.querySelectorAll('.filter-range'),
      filterScales = rangesBox.querySelectorAll('.filter-scale'),
      imageToolsContainer = document.querySelector('.post-image__tools'),
      tools = imageToolsContainer.querySelectorAll('.post-image__tool');

    for (i = 0; i < filterScales.length; i += 1) {
      filterScales[i].classList.add('hide-block');
    }

    //hide filter ranges for mobile devices
    if (imageToolsContainer) {
      changeRangeIfMobile();
      window.addEventListener('resize', function () {
        changeRangeIfMobile();
      });
    }

    //createRange(filter, rangeMin, rangeMax, rangeStart)
    createRange("crop", 0, 60, 0);
    createRange("saturate", 10, 300, 100);
    createRange("contrast", 70, 130, 100);
  }

})();

