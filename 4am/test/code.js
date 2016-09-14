// http://packery.metafizzy.co/packery.pkgd.js added as external resource

$(function(){
  var button = $('button');
  var container = $(".packery");
  container.packery({
	isHorizontal: true
  });
  var pckry = container.data("packery");
  
  $('button').on('click', function() {
    // create new item elements
    var elems = [];
    for ( var i = 0; i < 3; i++ ) {
      var elem = getItemElement();
	  console.log(elem);
      elems.push(elem);
    }
	container.append(elems);
	container.packery('appended', elems );
	console.log(pckry.packer);
  });
});


// create random item element
function getItemElement() {
  var elem = document.createElement('div');
  var wRand = Math.random();
  var hRand = Math.random();
  var widthClass = wRand > 0.85 ? 'w4' : wRand > 0.7 ? 'w2' : '';
  var heightClass = hRand > 0.85 ? 'h4' : hRand > 0.7 ? 'h2' : '';
  elem.className = 'item ' + widthClass + ' ' + heightClass;
  return elem;
}