$('.save-button').on('click', newTask);
$('.idea-list').on('blur', 'h2', editTitle);
$('.idea-list').on('blur', '.card-task', editTask);
$('.filter-input').on('keyup', filterList);
$('.inputs').on('keyup', enableSave);
$('.idea-list').on('click', '.completed-task', completeTask);
$('.show-complete').on('click', showCompleted);
$('.idea-list').on('click', '.up-vote', upVote);
$('.idea-list').on('click', '.down-vote', downVote);
$('.idea-list').on('click', '.delete-button', deleteCard);


retrieveCard();
hideMore();

function enableSave () {
  var title = $('.title-input');
  var task = $('.task-input');
  if (title.val() != '' && task.val() != '') {
  $('.save-button').attr('disabled', false);
  } else {
    $('.save-button').attr('disabled', true);
  }
}

function newTask(event) {
  var $title = $('.title-input');
  var $task = $('.task-input');
  event.preventDefault();
  var newCard = new MakeCard($title.val(), $task.val(), Date.now());
  prependCard(newCard);
  $title.val('');
  $task.val('');
  $('.save-button').attr('disabled', true);
};

function MakeCard(title, task, id) {
  // var qualityArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  this.title = title;
  this.task = task;
  this.id = id;
  this.counter = 2;
  this.completed = false;
  makeCardStorage(this.title, this.task, this.id, this.counter, this.completed);
};

function makeCardStorage (title, task, id, counter, completed) {
  var objectToStore = {id: id, title: title, task: task, counter: counter, completed: completed};
  var stringifiedObject = JSON.stringify(objectToStore);
  localStorage.setItem(id, stringifiedObject);
}

  function prependCard (newCard, id, title, task, counter = 2) {
    var ratingArray = ['None', 'Low', 'Normal', 'High', 'Critical']
  $('.idea-list').prepend(
    `<article class="card" id="${newCard.id}">
      <h2 class="card-title" contenteditable="true">${newCard.title}</h2>
      <button class="card-buttons delete-button"></button>
      <p class="card-task" contenteditable="true">${newCard.task}</p>
      <nav>
        <button class="card-buttons up-vote"></button>
        <button class="card-buttons down-vote"></button>
        <label for="quality">quality:</label>
        <p class="quality">${ratingArray[counter]}</p>
        <button class="completed-task">Completed Task</button>
      </nav>
    </article>`)
};

function retrieveCard(){
  for(var i = 0; i < localStorage.length; i++) {
  var retrievedObject = localStorage.getItem(localStorage.key(i));
  var parsedObject = JSON.parse(retrievedObject);
  prependCard(parsedObject, parsedObject.id, parsedObject.title, parsedObject.task, parsedObject.counter, parsedObject.completed);
  };
  displayTen();
};

function pushToStorage(id, object){
  var stringifiedObject = JSON.stringify(object);
  localStorage.setItem(id, stringifiedObject);
}

function upVote() {
  var clickedCardId = $(this).closest('article').attr('id');
  var theObject = localStorage.getItem(clickedCardId);
  var parsedTheObject = JSON.parse(theObject);
  $(this).siblings('.down-vote').removeAttr('disabled');
  upVoteToLocalStorage(clickedCardId, theObject, parsedTheObject, this);
}

function upVoteToLocalStorage(id, obj, parsedObj, thisEl) {
  var ratingArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
  $(thisEl).siblings('.down-vote').removeAttr('disabled');
  if (parsedObj.counter === 4) {
    $(thisEl).attr('disabled', true);
    } else {
    parsedObj.counter++;
    $(thisEl).closest('article').find('.quality').text(ratingArray[parsedObj.counter]);
    localStorage.setItem(id, JSON.stringify(parsedObj));
  };
}

function downVote() {
  var clickedCardId = $(this).closest('article').attr('id');
  var theObject = localStorage.getItem(clickedCardId);
  var parsedTheObject = JSON.parse(theObject);
  $(this).siblings('.up-vote').removeAttr('disabled');
  downVoteToLocalStorage(clickedCardId, theObject, parsedTheObject, this);
}

function downVoteToLocalStorage(id, obj, parsedObj, thisEl) {
  var ratingArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
  $(thisEl).siblings('.up-vote').removeAttr('disabled');
  if (parsedObj.counter === 0) {
    $(thisEl).attr('disabled', true);
    } else {
    parsedObj.counter--;
    $(thisEl).closest('article').find('.quality').text(ratingArray[parsedObj.counter]);
    localStorage.setItem(id, JSON.stringify(parsedObj));
  };
}

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

function completeTask(card) {
  var id = this.closest('article').getAttribute('id');
    var retrievedObject = localStorage.getItem(id);
    var parsedObject = JSON.parse(retrievedObject);
    parsedObject.completed = !parsedObject.completed;
    $(this).closest('article').toggleClass('complete');
    pushToStorage(id, parsedObject);
};

function showCompleted() {
  for (let i = 0; i < localStorage.length; i++) {
    var retrievedObject = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedObject);
    if (parsedObject.completed === true) {
      var completedCardId = parsedObject.id
    $(`#${completedCardId}`).addClass('complete');
    $(`#${completedCardId}`).show('slow');
    }
  }
}

function hideMore() {
  for (let i = 0; i < localStorage.length; i++) {
    var retrievedObject = localStorage.getItem(localStorage.key(i));
    var parsedObject = JSON.parse(retrievedObject);
  if (parsedObject.completed === true) {
      var completedCardId = parsedObject.id
      $(`#${completedCardId}`).hide()
    } else {
      $(`#${completedCardId}`).show()
    }
  }
}

// displayTen();
function displayTen(){
  // $('article').slice(0, 6).show();}
  $('.show-more').on('click', function () {
  $('article:hidden').slice(0, 10).slideDown();
  if ($('article:hidden').length == 0) {
  $('article').fadeOut('slow');
  }
})}