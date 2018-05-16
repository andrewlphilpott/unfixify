function unfixify() {
  var allElements = document.querySelectorAll('*');
  var fixedElements = [];

  allElements.forEach(function(element){
    if(
      window.getComputedStyle(element, null).getPropertyValue('position') == 'fixed' ||
      window.getComputedStyle(element, null).getPropertyValue('position') == 'sticky'
    ) {
      fixedElements.push(element);
    }
  });

  fixedElements.forEach(function(fixedElement){
    fixedElement.style.cssText += ';position: absolute!important;';
  });
}

chrome.storage.sync.get({
  disabledDomains: []
}, function(opts){
  disabledDomains = opts.disabledDomains;

  if(disabledDomains.indexOf(window.location.hostname) < 0) {
    unfixify();

    document.addEventListener('scroll', function(){
      unfixify();
    });
  }
});
