/*! Scripts for www.reddust.org.au */

const isProduction = location.host === 'www.petasitcheff.com' ? true : false;
const environment = isProduction ? 'production' : 'staging';

// Fire page view to Google Analytics
if (ga) {
  ga('create', 'UA-34474019-10', 'auto');
  ga('set', {
    dimension1: environment
  });
  ga('send', 'pageview');
}

// // The AJAX request to Mailchimp
// function mailChimp(data) {
//   var deferred = $.Deferred();
//   // var url = '//finsecptx.us13.list-manage.com/subscribe/post-json?u=500670fda51c3a1aa312eecfa&id=0d0bbdfa29&c=?'; // Testing
//   var url = '//petasitcheff.us15.list-manage.com/subscribe/post-json?u=81562367b11da2f0e94d42dbd&id=f610797f40&c=?';
//   if (isProduction) {
//     // url = '//finsecptx.us13.list-manage.com/subscribe/post-json?u=500670fda51c3a1aa312eecfa&id=202853ccf3&c=?'; // Live
//     url = '//petasitcheff.us15.list-manage.com/subscribe/post-json?u=81562367b11da2f0e94d42dbd&id=1f0a8aa42c&c=?';
//   }
//   $.ajax({
//     type: 'GET',
//     url: url,
//     data: $.param(data),
//     cache: false,
//     dataType: 'json',
//     contentType: 'application/json; charset=utf-8'
//   }).done(function(data) {
//     deferred.resolve('success');
//     console.log('AJAX success', data);
//   }).fail(function(jqXHR, textStatus, errorThrown) {
//     deferred.reject('fail');
//     console.error('AJAX fail', jqXHR, textStatus, errorThrown);
//   });
//   return deferred.promise();
// }

$(document).ready(function() {

  // TODO: Replace with Nunjucks
  $('body').addClass(environment);

  // Make any hashtag link scroll with animation to element with matching ID
  // Example: <a href="#features"> will scroll to element with ID #features
  // Commonly found in the #hero of each page
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

  // $('#mailchimp button').on('click', function() {
  //
  //   var $btn = $(this);
  //   $btn.html('Subcribing...').prop('disabled', true);
  //
  //   var dataMailChimp = {
  //     'EMAIL': $('#mailchimp [name="email"]').val()
  //   };
  //
  //   console.log('Submitting subscription to Mailchimp ...', dataMailChimp);
  //
  //   $.when(mailChimp(dataMailChimp)).then(function() {
  //     $btn.html('Done! Check email');
  //   }, function() {
  //     $btn.html('Whoops');
  //   });
  // });

});
