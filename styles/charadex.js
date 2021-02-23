const bodyClass = document.body.classList;

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem('toggle') == null) {
  bodyClass.add('dark');
}

if (localStorage.getItem('toggle') == 'true') {
  bodyClass.add('dark');
}

function switchMode(el) {
  bodyClass.contains('dark')
    ? (bodyClass.remove('dark'))
    : (bodyClass.add('dark')); 
  localStorage.setItem('toggle', $('.body').hasClass('dark'));
};  

$(function () {
  var includes = $('[data-include]')
  $.each(includes, function () {
    var file = 'includes/' + $(this).data('include') + '.html'
    $(this).load(file)
  })
})