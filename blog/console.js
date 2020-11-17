
async function textWrite() {
	var elements = document.getElementsByClassName("entrytext");
	var initialtext = []
	for(var i = 0; i < elements.length; i++) {
		let ele = elements.item(i);
		initialtext.push(ele.textContent);
		ele.textContent = "";
	}
	
	for(var i = 0; i < elements.length; i++) {
		let ele = elements.item(i);
		var text = initialtext[i];
		
		var textbuffer = "";
		while(textbuffer.length < text.length)
		{
			textbuffer += text[textbuffer.length];
			ele.textContent = textbuffer;
			await new Promise(r => setTimeout(r, 10));
		}
	}
}

function echoLine() {
	
}

$("#entry").keypress(function(){
	var textentry = $("#entry");
	var text = textentry.val();
	//submit
	if(event.key === 'Enter') {
		
		
    } else {
		console.log(text);
		textentry.width((text.length + 1) * 9.8);
	}
	
});

$("#entry").focus();
$(document).click(function() { $("#entry").focus() });

$( document ).ready(function() {
    textWrite();
});