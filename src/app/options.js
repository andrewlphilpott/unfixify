disabledDomains = [];
disableAll = false;

function saveOpts () {
  // Get the existing options
  chrome.storage.sync.get({
    disabledDomains: [],
    disableAll: false
  }, function(opts){
    disabledDomains = opts.disabledDomains;
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
  var disableThisDomain = document.querySelector('#opt-disable').checked;

  if(disableThisDomain) {
    // Add domain to the disabled list if checked
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(disabledDomains.indexOf(thisDomain) < 0) {
        disabledDomains.push(thisDomain);
      }

      // Save the options
      data.disabledDomains = disabledDomains;

      storeOpt(data)
    });
  } else {
    // Otherwise, remove it
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(disabledDomains.indexOf(thisDomain) >= 0) {
        var thisIndex = disabledDomains.indexOf(thisDomain);
        disabledDomains.splice(thisIndex, 1);
      }

      // Save the options
      data.disabledDomains = disabledDomains;

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
    disabledDomains: [],
    disableAll: false
  }, function(opts){
    disabledDomains = opts.disabledDomains;
    disableAll = opts.disableAll;

    // Check if this domain has been disabled
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      var link = document.createElement('a');
      link.href = tabs[0].url;

      var thisDomain = link.hostname;

      if(disabledDomains.indexOf(thisDomain) >= 0) {
        document.querySelector('#opt-disable').checked = true;
      }
    });

    // Check if all domains have been disabled
    if(disableAll === true) {
      document.querySelector('#opt-disable-all').checked = true;
    }
  });
}

document.addEventListener('DOMContentLoaded', initOpts);
