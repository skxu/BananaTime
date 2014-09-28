window.onload = function() {
  document.getElementById("optionA").addEventListener("click", function(e) {
    Control.process("optionA"), e.preventDefault()
  });
  
    document.getElementById("optionB").addEventListener("click", function(e) {
    Control.process("optionB"), e.preventDefault()
  });
  
    document.getElementById("optionC").addEventListener("click", function(e) {
    Control.process("optionC"), e.preventDefault()
  });

}