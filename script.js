$('.save-button').on('click', newTask);
$('.idea-list').on('blur', 'h2', editTitle);
$('.idea-list').on('blur', '.card-task', editTask);
$('.filter-input').on('keyup', filterList);

retrieveCard();

function newTask(event) {
  var $title = $('.title-input');
  var $task = $('.task-input');
  event.preventDefault();
  var newCard = new MakeCard($title, $task, $title.val(), $task.val(), (new Date()).getTime());
  prependCard(newCard);
  $title.val('');
  $task.val('');
};

function MakeCard($title, $task, title, task, uniqueid) {
  var qualityArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  this.title = title;
  this.task = task;
  this.quality = qualityArray[2];
  this.uniqueid = uniqueid;
  makeCardStorage(this.title, this.task, this.uniqueid, this.quality);
};

function makeCardStorage (title, task, uniqueid, quality) {
  var objectToStore = {title: title, task: task, quality: quality};
  var stringifiedObject = JSON.stringify(objectToStore);
  localStorage.setItem(uniqueid, stringifiedObject);
}

  function prependCard (newCard) {
  $('.idea-list').prepend(
    `<article class="card" id="${newCard.uniqueid}">
      <h2 class="card-title" contenteditable="true">${newCard.title}</h2>
      <button class="card-buttons delete-button"></button>
      <p class="card-task" contenteditable="true">${newCard.task}</p>
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

function editTask(card) {
  var id = this.closest('article').getAttribute('id');
  var newTitle = $(this).closest('.card-task').text();
  var retrievedObject = localStorage.getItem(id);
  var parsedObject = JSON.parse(retrievedObject);
  parsedObject.task = newTitle;
  pushToStorage(id, parsedObject);
};

function filterList() {
  for (var i = 0; i < ($('h2').length || $('.card-task').length); i++) { 
    var eachtitle = $('h2')[i].innerText;
    var eachtask = $('.card-task')[i].innerText;
  if (eachtitle.includes($('.filter-input').val()) === false && eachtask.includes($('.filter-input').val()) === false) {
    $($('h2')[i]).parent().hide();
  } else if (eachtitle.includes($('.filter-input').val()) === true || eachtask.includes($('.filter-input').val()) === true) {
    $($('h2')[i]).parent().show();
}}};

