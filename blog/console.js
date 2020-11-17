
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
		case "dir posts":
		
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
		await new Promise(r => setTimeout(r, 20));
	}
}

window.onhashchange = async function () {
	var textentry = $("#entry");
	var hashCmd = "";
	if (location.hash === "#home")
		hashCmd = "home";
	else if (location.hash === "#posts")
		hashCmd = "dir posts";
	
	await outputWrite(hashCmd);
	await new Promise(r => setTimeout(r, 20));
	echoLine(hashCmd);
	textentry.val("");
	textentry.width(0);
	processCommand(hashText);
};

$("#entry").focus();
$(document).click(function() { $("#entry").focus() });

$( document ).ready(function() {
    textWrite();
});