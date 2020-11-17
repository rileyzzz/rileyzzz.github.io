
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

function echoLine(text) {
	$(".output").append("<div class='entrytext'>C:\\Users\\riley>" + text + "</div>");
}

function processCommand(text) {
	switch(text) {
		case "home":
			window.location.href = 'https://rileyzzz.dev/';
			break;
		default:
			
	}
}


$("#entry").keydown(function() {
	var textentry = $("#entry");
	var text = textentry.val();
	//submit
	if(event.key === 'Enter') {
		echoLine(text);
		processCommand(text);
		textentry.val("");
    }
	textentry.width((text.length + 1) * 9.8);
});

async function outputWrite(text) {
	var textentry = $("#entry");
	var textbuffer = "";
	while(textbuffer.length < text.length)
	{
		textbuffer += text[textbuffer.length];
		textentry.val(textbuffer);
		textentry.width((text.length + 1) * 9.8);
		await new Promise(r => setTimeout(r, 10));
	}
}

window.onhashchange = async function () {
	var textentry = $("#entry");
	var hashText = "";
	if (location.hash === "#home")
		hashText = "home";
	else if (location.hash === "#posts")
		hashText = "posts";
	
	await outputWrite(hashText);
	await new Promise(r => setTimeout(r, 20));
	echoLine(hashText);
	textentry.val("");
	processCommand(hashText);
};

$("#entry").focus();
$(document).click(function() { $("#entry").focus() });

$( document ).ready(function() {
    textWrite();
});