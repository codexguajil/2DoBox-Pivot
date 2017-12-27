// var $title = $('.title-input');
// var $body = $('.body-input');
var $saveButton = $('.save-button');
var $ideaList = $('.idea-list');
var $searchBar = $('.search-input');

$saveButton.on('click', newIdea);
$ideaList.on('blur', 'h2', editTitle);
$ideaList.on('blur', '.card-body', editBody);
$searchBar.on('keyup', searchList);

retrieveCard();

function newIdea(event) {
  var $title = $('.title-input');
  var $body = $('.body-input');
  event.preventDefault();
  var newCard = new MakeCard($title, $body, $title.val(), $body.val(), (new Date()).getTime());
  prependCard(newCard);
  $title.val('');
  $body.val('');
};

function MakeCard($title, $body, title, body, uniqueid) {
  var qualityArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  this.title = title;
  this.body = body;
  this.quality = qualityArray[2];
  this.uniqueid = uniqueid;
  makeCardStorage(this.title, this.body, this.uniqueid, this.quality);
};

function makeCardStorage (title, body, uniqueid, quality) {
  var objectToStore = {title: title, body: body, quality: quality};
  var stringifiedObject = JSON.stringify(objectToStore);
  localStorage.setItem(uniqueid, stringifiedObject);
}

// MakeCard.prototype.appendCard = function(){
  function prependCard (newCard) {
  $ideaList.prepend(
    `<article class="card" id="${newCard.uniqueid}">
      <h2 class="card-title" contenteditable="true">${newCard.title}</h2>
      <button class="card-buttons delete-button"></button>
      <p class="card-body" contenteditable="true">${newCard.body}</p>
      <nav>
        <button class="card-buttons up-vote"></button>
        <button class="card-buttons down-vote"></button>
        <label for="quality">quality:</label>
        <p class="quality">${newCard.quality}</p>
      </nav>
    </article>`)
};

function retrieveCard(){
  for(var i=0; i < localStorage.length; i++) {
  var retrievedObject = localStorage.getItem(localStorage.key(i));
  var parsedObject = JSON.parse(retrievedObject);
  prependCard(parsedObject);
  };
};

function pushToStorage(id, object){
  var stringifiedObject = JSON.stringify(object);
  localStorage.setItem(id, stringifiedObject);
}

// $('.idea-list').on('click', '.up-vote', function {
//   if ($(this).closest('nav').children('p').text() === 'quality: swill') 
//     {$(this).siblings('.quality').text('quality: plausible');
    // var id = this.closest('article').getAttribute('id');
    // var retrievedObject = localStorage.getItem(id);
    // var parsedObject = JSON.parse(retrievedObject);
    // parsedObject.quality = 'plausible';
    // pushToStorage(id, parsedObject);
//  } else if ($(this).closest('nav').children('p').text() === 'quality: plausible')
//     {$(this).siblings('.quality').text('quality: genius')
//     var id = this.closest('article').getAttribute('id');
//     var retrievedObject = localStorage.getItem(id);
//     var parsedObject = JSON.parse(retrievedObject);;
//     parsedObject.quality = 'genius';
//     pushToStorage(id, parsedObject);
// }});

$('.idea-list').on('click', '.up-vote', upVote);
$('.idea-list').on('click', '.up-vote', upVote2);
$('.idea-list').on('click', '.down-vote', downVote);
$('.idea-list').on('click', '.down-vote', downVote2);

function upVote () {
  if ($(this).closest('nav').children('p').text() === 'Normal') {
    $(this).siblings('.quality').text('High');
    var quality = $('.quality').text();
    persistInStorage(this, quality);
  } else if ($(this).closest('nav').children('p').text() === 'High') {
    $(this).siblings('.quality').text('Critical')
    var quality = $('.quality').text();
    persistInStorage(this, quality);
  }
}

function downVote () {
  if ($(this).closest('nav').children('p').text() === 'Normal') {
    $(this).siblings('.quality').text('Low');
    var quality = $('.quality').text();
    persistInStorage(this, quality);
  } else if ($(this).closest('nav').children('p').text() === 'Low') {
    $(this).siblings('.quality').text('None')
    var quality = $('.quality').text();
    persistInStorage(this, quality);
  }
}

function upVote2 () {
  if ($(this).closest('nav').children('p').text() === 'None') {
    $(this).siblings('.quality').text('Low');
    var quality = $('.quality').text();
    persistInStorage(this, quality);
  } else if ($(this).closest('nav').children('p').text() === 'Low') {
    $(this).siblings('.quality').text('Normal')
    var quality = $('.quality').text();
    persistInStorage(this, quality);
  }
}

function downVote2 () {
  if ($(this).closest('nav').children('p').text() === 'Critical') {
    $(this).siblings('.quality').text('High');
    var quality = $('.quality').text();
    persistInStorage(this, quality);
  } else if ($(this).closest('nav').children('p').text() === 'High') {
    $(this).siblings('.quality').text('Normal')
    var quality = $('.quality').text();
    persistInStorage(this, quality);
  }
}

function persistInStorage(upvote, quality) {
var id = upvote.closest('article').getAttribute('id');
    var retrievedObject = localStorage.getItem(id);
    var parsedObject = JSON.parse(retrievedObject);
    parsedObject.quality = quality;
    pushToStorage(id, parsedObject);
  }

$('.idea-list').on('click', '.delete-button', deleteCard);
function deleteCard() {
  var id = this.closest('article').getAttribute('id');
  localStorage.removeItem(id);
  this.closest('article').remove();
};

function editTitle(card) {
  var id = this.closest('article').getAttribute('id');
  var newTitle = $(this).closest('.card-title').text();
  var retrievedObject = localStorage.getItem(id);
  var parsedObject = JSON.parse(retrievedObject);
  parsedObject.title = newTitle;
  pushToStorage(id, parsedObject);
};

function editBody(card) {
  var id = this.closest('article').getAttribute('id');
  var newTitle = $(this).closest('.card-body').text();
  var retrievedObject = localStorage.getItem(id);
  var parsedObject = JSON.parse(retrievedObject);
  parsedObject.body = newTitle;
  pushToStorage(id, parsedObject);
};

function searchList(e) {
  event.preventDefault();
  var titles = $('h2');
  var bodies = $('.card-body');
  var eachtitle = '';
  var eachbody = '';
  for (var i = 0; i < (titles.length || bodies.length); i++) { 
    eachtitle = titles[i].innerText;
    eachbody = bodies[i].innerText;
    var searchInputTitle = eachtitle.includes($searchBar.val());
    var searchInputBody = eachbody.includes($searchBar.val());
  if (searchInputTitle === false && searchInputBody === false) {
    $($('h2')[i]).parent().hide();
  } else if (searchInputTitle === true || searchInputBody === true) {
    $($('h2')[i]).parent().show();
}}};