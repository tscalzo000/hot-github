let active = '';
let today = new Date();

let lastMonth = new Date();
lastMonth.setMonth(today.getMonth()-1);
let lastMonthYear = lastMonth.getFullYear();
let lastMonthDay = lastMonth.getDate();
let lastMonthMonth = lastMonth.getMonth()+1;
if (lastMonthDay < 10) {
    lastMonthDay = ('0' + lastMonthDay);
}
if (lastMonthMonth < 10) {
    lastMonthMonth = ('0' + lastMonthMonth);
}
let lastMonthFormat = lastMonthYear + '-' + lastMonthMonth + '-' + lastMonthDay;

let lastYear = new Date();
lastYear.setFullYear(today.getFullYear() - 1);
let lastYearYear = lastYear.getFullYear();
let lastYearDay = lastYear.getDate();
let lastYearMonth = lastYear.getMonth()+1;
if (lastYearDay < 10) {
    lastYearDay = ('0' + lastYearDay);
}
if (lastYearMonth < 10) {
    lastYearMonth = ('0' + lastYearMonth);
}
let lastYearFormat = lastYearYear + '-' + lastYearMonth + '-' + lastYearDay;

let urlRepo = 'https://api.github.com/search/repositories?q=created:>=' + lastMonthFormat + '&sort:stars&order:desc&per_page=100';
let urlUser = 'https://api.github.com/search/users?q=created:>=' + lastYearFormat + '&sort:followers&order:desc&per_page=100';

function repoRefresh() {
  if ((active === '') || (active == 'users')) {
    active = 'repos';
    stopFunction();
    document.getElementById('title').innerHTML = 'Hottest Repos (in the past month by stars)';
    document.getElementById('one').innerHTML = 'ID';
    document.getElementById('two').innerHTML = 'Name';
    document.getElementById('three').innerHTML = 'Stars';
    document.getElementById('four').innerHTML = 'Description';
    fetch (urlRepo)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        let errorMessage = `${response.status} (${response.statusText})`,
            error = new Error(errorMessage);
        throw(error);
      }
    })
    .then(response => {
      return response.text();
    })
    .then(responseBody => {
      let bodyParsed = JSON.parse(responseBody);
      for (var i = 0; i < 5; i++) {
        let id = bodyParsed.items[i].id;
        let name = bodyParsed.items[i].name;
        let stars = bodyParsed.items[i].stargazers_count;
        let desc = bodyParsed.items[i].description;
        let html = document.getElementById('user' + (i+1));
        html.innerHTML = '<th>' + id + '</th>';
        html.innerHTML += '<th>' + name + '</th>';
        html.innerHTML += '<th>' + stars + '</th>';
        html.innerHTML += '<th>' + desc + '</th>';
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  } else {
    alert('That button has already been activated!');
  }
}

let myVar = '';

function userRefresh() {
  if ((active === '') || (active == 'repos')) {
    active = 'users';
    document.getElementById('title').innerHTML = 'Hottest Users (in the past year by followers)';
    document.getElementById('one').innerHTML = 'Avatar';
    document.getElementById('two').innerHTML = 'ID';
    document.getElementById('three').innerHTML = 'Login';
    document.getElementById('four').innerHTML = 'Followers';
    fetch (urlUser)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        let errorMessage = `${response.status} (${response.statusText})`,
            error = new Error(errorMessage);
        throw(error);
      }
    })
    .then(response => {
      return response.text();
    })
    .then(responseBody => {
      let bodyParsed = JSON.parse(responseBody);
      let users = [];
      for (var i = 0; i < 5; i++) {
        let id = bodyParsed.items[i].id;
        let login = bodyParsed.items[i].login;
        let avatar = bodyParsed.items[i].avatar_url;
        let url = bodyParsed.items[i].url;
        let html = document.getElementById('user' + (i+1));
        html.innerHTML = '<th><img src=' + avatar + ' style="width:100px;height:100px;"></th>';
        html.innerHTML += '<th>' + id + '</th>';
        html.innerHTML += '<th>' + login + '</th>';
        followers(url, i);
        users.push(url);
      }
      myVar = setInterval(function(){ followerRefresh(users); }, 120000);
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`));
  } else {
    alert('That button has already been activated!');
  }
}

function followers(user, value) {
  fetch(user)
  .then(response => {
    return response.text();
  })
  .then(responseBody => {
    let bodyParsed = JSON.parse(responseBody);
    let followers = bodyParsed.followers;
    let follow = document.getElementById('user' + (value+1));
    if (document.getElementById('follower' + (value+1)) === null) {
      follow.innerHTML += '<th id = "follower' + (value+1) + '"' + (value+1) + '>' + followers + '</th>';
    } else {
      document.getElementById('follower' + (value+1)).innerHTML = followers;
    }
  });
}

function followerRefresh(users) {
  for (var j = 0; j < 5; j++) {
    followers(users[j], j);
  }
}

function stopFunction() {
    clearInterval(myVar);
}
