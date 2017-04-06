const isProduction = location.host === 'www.petasitcheff.com' ? true : false;
const environment = isProduction ? 'production' : 'staging';

// Email we send Formspree data to
const email = 'peta@petasitcheff.com';

// Where we store contact form details
let userData = {};

// Fire page view to Google Analytics
if (ga) {
  ga('create', 'UA-34474019-10', 'auto');
  ga('set', {
    dimension1: environment
  });
  ga('send', 'pageview');
}

// The AJAX request to Formspree
function formSpree(data) {
  var deferred = $.Deferred();
  $.ajax({
    url: `https://formspree.io/${email}`,
    method: 'POST',
    data: data,
    dataType: 'json'
  }).done(function(data) {
    deferred.resolve('success');
    console.log('AJAX success', data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    deferred.reject('fail');
    console.error('AJAX fail', jqXHR, textStatus, errorThrown);
  });
  return deferred.promise();
}

function submitContactForm() {
  const label = isProduction ? '' : '[TEST] ';
  const extra = isProduction ? '' : 'This is test data. It\'s very likely Jan or Hannah working on your website this very moment :)';
  let data = {
    _subject: `${label} Someone is contacting you`,
    _format: 'plain',
    about: `Someone just completed the contact form on ${location.href}.`,
  };
  if (!isProduction) {
    data.about = 'This is test data. Most likely Jan or Hannah is now working on your website :)';
  }
  const keys = ['name', 'email', 'phone', 'location', 'company', 'industry', 'message'];
  $.each(keys, function(i, key) {
    data[key] = userData[key] || '-';
  });
  console.log('Submitting contact form to FormSpree ...', data);
  const $btn = $('#contact #form button');
  $btn.html('Sending...').prop('disabled', true);
  $.when(formSpree(data)).then(function() {
    console.log('success');
    $btn.html('Sent!');
  }, function() {
    console.log('fail');
    $btn.html('Whoops, invalid email?').prop('disabled', false).hover(function() {
      $(this).html('Try again');
    }, function() {
      $(this).html('Whoops, invalid email?');
    });
  });
}

// Store key value pairs in sessionStorage
function store(key, value) {
  userData[key] = value;
  console.log(key, value);
}

$(document).ready(function() {

  // TODO: Replace with Nunjucks
  $('body').addClass(environment);

  // Make any hashtag link scroll with animation to element with matching ID
  // Example: <a href="#features"> will scroll to element with ID #features
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  //Add toggle effect for sliding #menu
  let showingMenu = false;
  const $menu = $('#menu');
  const $main = $('main');
  const config2 = {
    duration: 1000,
    easing: 'easeOut'
  };
  $('#menu-burger,.close-menu,#navigation-links>li>a').on('click', function() {
    if (showingMenu) {
      $menu.removeClass('active');
      $main.removeClass('menu-active');
      showingMenu = false;
      event.preventDefault();
    } else {
      $menu.addClass('active');
      $main.addClass('menu-active');
      showingMenu = true;
      event.preventDefault();
    }
    return showingMenu;
  });

  const burgerPos_y = $('#menu-burger').offset().top;
  $(document).on('scroll', function() {
    let scrollPos_y = $(window).scrollTop();
    if (scrollPos_y + $(window).width() / 33 > burgerPos_y) {
      // $('#menu-burger').css('transform', 'translateY(' + (scrollPos_y + ($(window).width() / 33.33) - burgerPos_y) + 'px)');
      $('#menu-burger').css({
        'position': 'fixed',
        'top': '3vw',
        'left': '3vw',
        'margin': 0
      });
    } else {
      // $('#menu-burger').css('transform', 'translateY(0)');
      $('#menu-burger').css({
        'position': 'static',
        'margin-top': '3vw'
      });
    }
  });

  // Animation logic for the "My story" section which can expands
  let showing = 'short';
  const $story = $('#story');
  const $slide = $('#story>div');
  // const $long = $('#story #hort');
  // const $short = $('#story #long');
  const config = {
    duration: 1000,
    easing: 'easeOutExpo'
  };
  $story.find('button').on('click', function() {
    if (showing === 'short') {
      // const longStoryHeight = $long.height();
      // console.log(longStoryHeight);
      // $story.velocity({ height: longStoryHeight }, config);
      $story.velocity({
        height: '92vw'
      }, config);
      $slide.velocity({
        translateX: '-100vw'
      }, config);
      showing = 'long'
    } else {
      $story.velocity({
        height: '74vw'
      }, config);
      $slide.velocity({
        translateX: '0vw'
      }, config);
      showing = 'short';
    }
  });

  // Submit contact form details to FormSpree
  $('#contact #form button').on('click', function() {
    submitContactForm();
  });

  // Observe all inputs and textareas for user interactions, store data as users type
  $(document).on('keyup blur change', 'input, textarea', function() {
    const key = $(this).attr('name');
    const value = $(this).val();
    if (key && value) {
      store(key, value);
      $(this).addClass('has-value');
    } else {
      $(this).removeClass('has-value');
    }
  });

});
