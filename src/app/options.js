enabledDomains = [];
disableAll = false;

function saveOpts () {
  // Get the existing options
  chrome.storage.sync.get({
    enabledDomains: [],
    disableAll: false
  }, function(opts){
    enabledDomains = opts.enabledDomains;
    disableAll = opts.disableAll;
  });

  var data = {};

  // Check if all should be disabled
  var disableAllDomains = document.querySelector('#opt-disable-all').checked;

  if(disableAllDomains) {
    data.disableAll = true;
  } else {
    data.disableAll = false;
  }

  // Check if this domain should be added
  // to the list of disabled domains
  var enableThisDomain = document.querySelector('#opt-enable').checked;

  if(enableThisDomain) {
    // Add domain to the disabled list if checked
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(enabledDomains.indexOf(thisDomain) < 0) {
        enabledDomains.push(thisDomain);
      }

      // Save the options
      data.enabledDomains = enabledDomains;

      storeOpt(data)
    });
  } else {
    // Otherwise, remove it
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(enabledDomains.indexOf(thisDomain) >= 0) {
        var thisIndex = enabledDomains.indexOf(thisDomain);
        enabledDomains.splice(thisIndex, 1);
      }

      // Save the options
      data.enabledDomains = enabledDomains;

      storeOpt(data);
    });
  }
}

function storeOpt(data) {
  chrome.storage.sync.set(data, function(){
    // Let the user know the options were saved
    var body = document.body;

    var toaster = document.createElement('aside');
    toaster.className = 'toaster';

    var toasterBody = document.createElement('p');
    toasterBody.textContent = 'Your settings have been saved.';

    toaster.append(toasterBody);
    body.append(toaster);

    // Make sure the alert gets removed
    setTimeout(function(){
      toaster.remove();
    }, 3000);

    // Refresh the page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.reload(tabs[0].id);
    });
  });
}

function initOpts() {
  var optForm = document.querySelector('#opt-form');
  optForm.addEventListener('submit', function(e){
    e.preventDefault();
    saveOpts();
  });

  chrome.storage.sync.get({
    enabledDomains: [],
    disableAll: false
  }, function(opts){
    enabledDomains = opts.enabledDomains;
    disableAll = opts.disableAll;

    // Check if this domain has been enabled
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(enabledDomains.indexOf(thisDomain) >= 0) {
        document.querySelector('#opt-enable').checked = true;
      }
    });

    // Check if all domains have been disabled
    if(disableAll === true) {
      document.querySelector('#opt-disable-all').checked = true;
    }

    // List all enabled domains
    if(enabledDomains.length) {
      const enabledList = document.querySelector('#enabled-list');

      // Append domains
      for(let i = 0; i < enabledDomains.length; i++) {
        const li = document.createElement('li');
        li.textContent = enabledDomains[i];

        // const liRemove = document.createElement('button');
        // liRemove.className = 'btn--remove';
        // liRemove.textContent = 'X';
        //
        // li.appendChild(liRemove);
        enabledList.appendChild(li);
      }

      enabledList.classList.add('hidden');

      // Show/hide enabled list
      const enabledListToggle = document.querySelector('[href="#enabled-list"]');

      enabledListToggle.addEventListener('click', function(e){
        e.preventDefault();
        enabledList.classList.toggle('hidden');
        enabledListToggle.classList.toggle('expanded');

        if(enabledList.className.indexOf('hidden') > -1) {
          enabledListToggle.textContent = 'Show enabled sites';
        } else {
          enabledListToggle.textContent = 'Hide enabled sites';
        }
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', initOpts);
