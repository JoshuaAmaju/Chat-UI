let messageField = document.querySelector('.message-field');
let sendButton = document.querySelector('.send');
let messages = document.querySelector('.messages ul');

let contacts = document.querySelectorAll('.contact-card');
let messageList = messages.querySelectorAll('li:not(.me)');
let messageListMe = messages.querySelectorAll('li.me');

let chatField = document.querySelector('.chat');
let searchField = document.querySelector('.search-field');

let moreHandle = document.querySelector('.more-handle');
let more = document.querySelector('.more');

TweenMax.staggerFrom(contacts, 0.5, {y: 100, opacity: 0, scale: 0.7}, 0.2);
TweenMax.staggerFrom(messageList, 0.5, {x: -150, y: 100, opacity: 0, scale: 0.6}, 0.2);
TweenMax.staggerFrom(messageListMe, 0.5, {x: 150, y: 100, opacity: 0, scale: 0.6}, 0.2);

TweenMax.from(chatField, 0.5, {y: 100});

searchField.addEventListener('keydown', (e) => {
  match();
});

searchField.addEventListener('keyup', (e) => {
  match();
});

function match() {
  contacts.forEach((contact) => {
    let contactName = contact.querySelector('.name');
    if (contactName.innerHTML.toUpperCase().indexOf(searchField.value.toUpperCase()) > -1) {
      contact.classList.add('filter-in');
      contact.classList.remove('filter-out');
    } else {
      contact.classList.add('filter-out');
      let filterIn = document.querySelectorAll('.filter-in');
      TweenMax.staggerFromTo(filterIn, 0.3, {y: 100, opacity: 0, scale: 0.7}, {y: 0, opacity: 1, scale: 1}, 0.2);
    }
  });
}

function findMatch(wordToMatch, contact) {
  const regex = new RegExp(wordToMatch, 'gi');
  return contact.match(regex);
}

moreHandle.addEventListener('click', () => more.classList.toggle('show'));

sendButton.addEventListener('click', (e) => {
  chat();
});

messageField.addEventListener('focus', () => {
  document.addEventListener('keydown', (e) => {
    switch (e.which) {
      case 13:
      if (messageField.value !== '') {
        chat();
      }
      break;
    }
  });
});

function chat() {
  createMessage('me', messageField.value);
  messageField.value = '';
  setTimeout(function () {
    createMessage('not-me', `Typical reply.`);
  }, 1000);
}

function createMessage(sender = 'not-me', message) {
  let messageHolder = document.createElement('li');
  let msgHolder = document.createElement('div');
  let msg = document.createElement('span');
  msgHolder.setAttribute('class', 'message');

  msg.innerHTML = message;

  if (sender == 'me') {
    messageHolder.setAttribute('class', 'me');
    TweenMax.from(messageHolder, 0.25, {x: 20, y: 20, scale: 0.8, opacity: 0});
  } else {
    let imgAndTime = document.createElement('div');
    let senderImg = document.createElement('img');
    let time = document.createElement('span');

    imgAndTime.setAttribute('class', 'img-and-time');
    time.setAttribute('class', 'time');
    time.innerHTML = getTime();
    senderImg.setAttribute('src', 'https://images.unsplash.com/photo-1534250181471-a453fae2231d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=387c169266fa097ff927ca2a9f5ef818&auto=format&fit=crop&w=334&q=80');

    imgAndTime.appendChild(senderImg);
    imgAndTime.appendChild(time);
    messageHolder.appendChild(imgAndTime);

    TweenMax.from(messageHolder, 0.25, {x: -20, y: 20, scale: 0.8, opacity: 0});
  }

  msgHolder.appendChild(msg);
  messageHolder.appendChild(msgHolder);
  messages.appendChild(messageHolder);

  scrollTo(messages.parentNode, 1500);
  messages.parentNode.style.overflow = 'hidden';
}

function getTime() {
  let now = new Date();
  return `${(now.getHours())}:${(now.getMinutes())}`;
}

messages.parentNode.addEventListener('mouseover', () => {
  messages.parentNode.style.overflow = 'auto';
});

messages.parentNode.addEventListener('mouseout', () => {
  messages.parentNode.style.overflow = 'hidden';
});

function scrollTo (element, duration) {
  if (!element) return;

  var target = element.scrollHeight;
  target = Math.round(target);
  duration = Math.round(duration);

  if (duration < 0) return false;
  if (duration === 0) {
    element.scrollTop = target;
    return true;
  }

  var start_time = Date.now();
  var end_time = start_time + duration;

  var start_top = element.scrollTop;
  var distance = target - start_top;

  var smooth_step = function (start, end, point) {
    if (point <= start) return 0;
    if (point >= end) return 1;

    var x = (point - start) / (end - start); // interpolation
    return x * x * (3 - 2 * x);
  }

  // This is to keep track of where the element's scrollTop is
  // supposed to be, based on what we're doing
  var previous_top = element.scrollTop;

  // This is like a think function from a game loop
  var scroll_frame = function () {
    if (element.scrollTop !== previous_top) return false;

    // set the scrollTop for this frame
    var now = Date.now();
    var point = smooth_step(start_time, end_time, now);
    var frameTop = Math.round(start_top + (distance * point));
    element.scrollTop = frameTop;

    // check if we're done!
    if (now >= end_time) return true;

    // If we were supposed to scroll but didn't, then we
    // probably hit the limit, so consider it done; not
    // interrupted.
    if (element.scrollTop === previous_top && element.scrollTop !== frameTop) return true;
    previous_top = element.scrollTop;

    // schedule next frame for execution
    setTimeout(scroll_frame, 0);
  }

  // boostrap the animation process
  setTimeout(scroll_frame, 0);
}
