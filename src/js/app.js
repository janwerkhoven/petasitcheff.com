/*! Scripts for www.reddust.org.au */

const isProduction = location.host === 'www.reddust.org.au' ? true : false;
const environment = isProduction ? 'production' : 'staging';

// Fire page view to Google Analytics
if (ga) {
  ga('create', 'UA-34474019-10', 'auto');
  ga('set', {
    dimension1: environment
  });
  ga('send', 'pageview');
}

/*

<!-- Begin MailChimp Signup Form -->
<div id="mc_embed_signup">
<form action="//petasitcheff.us15.list-manage.com/subscribe/post?u=81562367b11da2f0e94d42dbd&amp;id=f610797f40" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
    <div id="mc_embed_signup_scroll">

<div class="mc-field-group">
	<label for="mce-EMAIL">Email Address </label>
	<input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
</div>
<div class="mc-field-group">
	<label for="mce-FNAME">First Name </label>
	<input type="text" value="" name="FNAME" class="" id="mce-FNAME">
</div>
<div class="mc-field-group">
	<label for="mce-LNAME">Last Name </label>
	<input type="text" value="" name="LNAME" class="" id="mce-LNAME">
</div>
	<div id="mce-responses" class="clear">
		<div class="response" id="mce-error-response" style="display:none"></div>
		<div class="response" id="mce-success-response" style="display:none"></div>
	</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_81562367b11da2f0e94d42dbd_f610797f40" tabindex="-1" value=""></div>
    <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
    </div>
</form>
</div>

<!--End mc_embed_signup-->

*/

// The AJAX request to Mailchimp
function mailChimp(data) {
  var deferred = $.Deferred();
  // var url = '//finsecptx.us13.list-manage.com/subscribe/post-json?u=500670fda51c3a1aa312eecfa&id=0d0bbdfa29&c=?'; // Testing
  // var url = '//petasitcheff.us15.list-manage.com/subscribe/post-json?u=81562367b11da2f0e94d42dbd&id=1f0a8aa42&c=?'; // Testing
  var url = '//petasitcheff.us15.list-manage.com/subscribe/post-json?u=81562367b11da2f0e94d42dbd&id=f610797f40c=?';
  if (isProduction) {
    // url = '//finsecptx.us13.list-manage.com/subscribe/post-json?u=500670fda51c3a1aa312eecfa&id=202853ccf3&c=?'; // Live
    // url = '//petasitcheff.us15.list-manage.com/subscribe/post-json?u=81562367b11da2f0e94d42dbd&id=1f0a8aa42&c=?'; // Testing
  }
  $.ajax({
    type: 'GET',
    url: url,
    data: $.param(data),
    cache: false,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8'
  }).done(function(data) {
    deferred.resolve('success');
    console.log('AJAX success', data);
  }).fail(function(jqXHR, textStatus, errorThrown) {
    deferred.reject('fail');
    console.error('AJAX fail', jqXHR, textStatus, errorThrown);
  });
  return deferred.promise();
}

$(document).ready(function() {

  $('#mailchimp button').addClass('aaaaaah').on('click', function() {

    var $btn = $(this);
    $btn.html('Subcribing...').prop('disabled', true);

    // var dataMailChimp = {};
    // var keys = ['title', 'name', 'email', 'phone', 'state', 'age'];
    // $.each(keys, function(i, key) {
    //   dataMailChimp[key.toUpperCase()] = sessionStorage.getItem(key) || '-';
    // });

    var dataMailChimp = {
      'EMAIL': $('#mailchimp [name="email"]').val(),
      'FNAME': '-',
      'LNAME': '-'
    };

    console.log('Submitting subscription to Mailchimp ...', dataMailChimp);

    $.when(mailChimp(dataMailChimp)).then(function() {
      $btn.html('Done! Check email');
    }, function() {
      $btn.html('Whoops');
    });
  });

});
